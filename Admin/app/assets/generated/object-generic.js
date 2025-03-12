import { LitElement, html } from 'lit';
import { until } from 'lit/directives/until.js'
import { get, translate } from 'lit-translate'
import { Preferences } from '@capacitor/preferences';

import { Modal, Toast } from 'bootstrap';

import { Datepicker } from 'vanillajs-datepicker'
import fr from 'vanillajs-datepicker/locales/fr';
Object.assign(Datepicker.locales, fr);

import { Jodit } from 'jodit';

export default class GenericObjectElement extends LitElement {
    static properties = { 
        objectName: {type: String},
        metadata: {type: Object},
        user: {type: Object},
    }
    static get styles() { }

    constructor() {
        super()
        this.conf = undefined
        this.foreignData = {}
        this.LABEL_SUFFIX = "_label"
        this.modalSelector = null
    }


    /**
     * Don't use the shadow-root node. The "styles" property will not be used.
     * @returns 
     */
    createRenderRoot() {
        return this;
    }


	
    /**
     * Called by update() and should be implemented to return a renderable 
     *   result (such as a TemplateResult) used to render the component's DOM.
     *
     * Updates?    No. Property changes inside this method do not trigger an element update.
     * Call super? Not necessary.
     * 
     * @returns html
     */
    render() {
        if(this.objectName == undefined){
            console.error('objectName is not defined.')
            return html``
        }
        return until(this.loadExternalData().then( () => {
            return html`
                ${ this.renderModal() }

                <div id="toast" class="toast toast-top" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <i class="bi bi-info-circle-fill me-2 icon-info"></i>
                        <i class="bi bi-check-circle-fill me-2 icon-success"></i>
                        <i class="bi bi-exclamation-triangle-fill me-2 icon-warning"></i>
                        <i class="bi bi-bug-fill me-2 icon-danger"></i>
                        <strong class="me-auto toast-title">Information</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        This is a toast message.
                    </div>
                </div>
            `
        }), 
        html`
            <div class="centered-loader flex-column">
                <div class="mb-2">
                    ${ translate("app-login.loading") }
                </div>
                <div class="loader spinner-border" role="status">
                    <span class="visually-hidden">
                    ${ translate("app-login.loading") }</span>
                </div>
            </div>`)
    }

    loadMetadata(){
        return new Promise((resolve, reject) => {
            if(this.metadata == undefined){
                fetch(BASE_HREF+'/assets/metadata/'+this.objectName+'-meta-data.json')
                    .then((response) => response.json())
                    .then((json) => {
                        this.metadata = json
                        return resolve()
                    })
            }else{
                return resolve()
            }
        })
    }

    loadExternalData(){
        return this.loadMetadata().then(() => {
            const foreignFields = this.metadata.fields.filter(f => f.references != undefined && f.references.access != "ajax")
            return new Promise((resolve, reject) => {
                let promises = [ Preferences.get({ key: window.KEY_CONFIG }) ] 
                for(let foreignField of foreignFields){
                    promises.push(this.loadForeignData(foreignField.references.object))
                }
                Promise.all(promises).then((result) => {
                    this.conf = JSON.parse(result[0].value)
                    resolve()
                })
            })
        })
    }


    urlOfExternalData(externalObject, searchField, searchValue){
        //console.log("urlOfExternalData", externalObject)
        const limitQueryParam = "?limit=100"
        if(searchField && searchValue){
            return '/api/v1/'+externalObject+'s/'+limitQueryParam+'&sort_by=' + searchField +
                '&search_on=' + searchField + '&search_value=' + searchValue
        }else{
            return '/api/v1/'+externalObject+'s/'+limitQueryParam
        }
    }


    loadForeignData(externalObject){
        this.foreignData[externalObject] = []
        return new Promise((resolve, reject) => {
            call(this.urlOfExternalData(externalObject), 'GET').then((responseOk, responseFailure) => {
                if(responseOk){
                    this.foreignData[externalObject] = responseOk.data
                    resolve()
                }else{
                    reject(responseFailure)
                }
            })
        })
    }



    getFields(){
        return this.metadata.fields
            //.filter((f) => f.show.edit == true) // Take ALL fields, then hide them
            .map((f) => this.getField(f) )
    }


    getField(f){
        if(f.show.edit == false || f.primary){
            return this.getFieldAsHidden(f)
        }
        if(f.references){
            return this.wrapFieldHtml(f, this.getFieldForReference(f) )
        }
        if(f.type.toLowerCase() == "int" || f.type.toLowerCase().startsWith("float") || 
            f.type.toLowerCase().startsWith("varchar")){
            return this.wrapFieldHtml(f, this.getFieldOfTypeText(f) )
        }
        if(f.type.toLowerCase().startsWith("date")){
            return this.wrapFieldHtml(f, this.getFieldOfTypeDate(f) )
        }
        if(f.type.toLowerCase().startsWith("text")){
            return this.wrapFieldHtml(f, this.getFieldOfTypeWysiwyg(f) )
        }
        if(f.type.toLowerCase().startsWith("file")){
            return this.wrapFieldHtml(f, this.getFieldOfTypeFile(f) )
        }
        if(f.type.toLowerCase().startsWith("password")){
            return this.wrapFieldHtml(f, this.getFieldOfTypePassword(f) )
        }
        if(f.type.toLowerCase().startsWith("enum")){
            return this.wrapFieldHtml(f, this.getFieldOfTypeEnum(f) )
        }
        if(f.type.toLowerCase().startsWith("timestamp")){
            return this.wrapFieldHtml(f, this.getFieldOfTypeTimestamp(f) )
        }
        if(f.type.toLowerCase().startsWith("flag")){
            return this.wrapFieldHtml(f, this.getFieldOfTypeFlag(f) )
        }
        console.warn(`Update the code to manage the type ${f.type}`)
        return html`type "${f.type}" not yet managed.`
    }


    wrapFieldHtml(f, fieldHtml){
        var label = get("object."+this.objectName+".field."+f.key)
        if( get("object."+this.objectName+".field."+f.key) == "[object."+this.objectName+".field."+f.key+"]"){
            // Not translated
            if( f.references != undefined){
                // Update the key on 'column', not on 'f'
                // Use 'get' because there is string manipulation
                label = get("object."+f.references.object+".label") + ' (' +
                    get("object."+f.references.object+".field."+f.references.label)+')'
            }
        }


        return html`<div class="row mb-3">
                    <label for="${f.key}" class="col-2 col-form-label ${f.required ? 'required' : ''}">
                         ${ label }
                    </label>
                    <div class="col-10">
                        ${ fieldHtml }
                    </div>
                </div>`
    }

    getFieldAsHidden(f, value = ""){
        return html`<input type="hidden" name="${f.key}" id="${f.key}" value="${value}">`
    }

    getFieldOfTypeText(f){
        return html`<input class="form-control" type="text" name="${f.key}" 
                        id="${f.key}" value="" ${f.required ? 'required' : ''}>`
    }

    getFieldOfTypeDate(f){
        return html`<div class="input-group mb-3">
            <input class="form-control input-date" type="text" name="${f.key}" 
                id="${f.key}" value="" ${f.required ? 'required' : ''}>
            <button class="btn btn-primary btn-sm" @click="${this.dateToNow}" data-input="${f.key}">Aujourd'hui</button>
        </div>`
    }

    getFieldOfTypeWysiwyg(f){
        return html`<textarea id="${f.key}" class="wysiwyg-editor"></textarea>`
    }

    getFieldOfTypeFile(f){
        return html`<input class="form-control d-inline" id="${f.key}_file" 
                name="${f.key}_file" type="file" @change=${this.onFileSelected} 
                data-target="${f.key}" style="width: 50%" />
                <span id="${f.key}_status" class="loading-status"></span>
			<input type="hidden" name="${f.key}" id="${f.key}"/>
            <img class="preview d-none" src="" data-target="${f.key}">
            <button class="btn btn-danger btn-xs ms-4 d-none" data-target="${f.key}" 
                @click=${this.onRemoveFile} >${translate('action.delete')}</button>`
    }

    getFieldOfTypePassword(f){
        return html`
            <div class="row g-3 align-items-center">
                <div class="col-auto">
                    <input id="${f.key}" name="${f.key}" 
                        class="form-control" type="password" />
                </div>
                <div class="col-auto mt-0">
                    <span class="form-text">
                        ${ translate("message.password-update") }
                    </span>
                </div>
            </div>`
    }

    getFieldOfTypeEnum(f){
        const optionsHtml = f.type.substring(f.type.indexOf('(')+1, f.type.indexOf(')')).
            split(',').map((key_value)=> {
                const [key, value] = key_value.split(':').map((a) => a.substring(1, a.length-1) )
                return html`<option value="${key}">${value}</option>`
            })
            if(!f.required){
                // Add the empty choice at start
                optionsHtml.unshift( html`<option value="" selected></option>` )
            }
            return html`<select class="form-control" name="${f.key}" id="${f.key}">
                    ${optionsHtml}
                </select>`
    }

    getFieldOfTypeTimestamp(f){
        return html`<input class="form-control" type="number" name="${f.key}" 
                        id="${f.key}" value="" ${f.required ? 'required' : ''}>`
    }

    getFieldOfTypeFlag(f){
        var labelTranslated = get('object.' + this.objectName + '.checked.' + f.key)
        return html`<input class="form-check-input" type="checkbox" 
                value="1" id="${f.key}" name="${f.key}"> 
             <label class="form-check-label" for="${f.key}">${labelTranslated}</label>`
    }

    dateToNow(event){
        const elt = this.querySelector('#'+event.target.dataset.input)
        elt.value = new Date().toLocaleDateString('fr')
    }

    /**
     * Put values to input fields
     * 
     * @param {Dictionnary} parameters 
     */
    beforeModalOpens(parameters){
        this.querySelectorAll('input.input-date').forEach((dateElement) => {
            new Datepicker(dateElement, {
                // https://mymth.github.io/vanillajs-datepicker/#/options
                buttonClass: 'btn',
                language: 'fr'
            });
        })

        this.querySelectorAll('textarea.wysiwyg-editor').forEach((textareaElement) => {
            Jodit.make(this.modalSelector + ' #' + textareaElement.getAttribute('id'), {
                // https://xdan.github.io/jodit/
                theme: document.getElementsByTagName('html')[0].dataset.bsTheme 
            })
        })
    }
    
    getFieldForReference(f){
        if(f.references.access == "ajax"){
            return html`
                <input type="hidden" name="${f.key}" id="${f.key}" value="">
                <input class="form-control" type="text" value="" name="${f.key + this.LABEL_SUFFIX}" 
                    id="${f.key + this.LABEL_SUFFIX}" data-key="${f.key}"
                    @keyup=${this.onRequestAjax} autocomplete="off" list="${f.key}_autocompleteList"
                    @blur=${this.onBlurAjax} data-previous="">
                <div class="autocomplete d-none" id="${f.key}_autocompleteList"></div>`
        }else{
            const optionsHtml = this.foreignData[f.references.object].map((d)=> {
                return html`<option value="${d[f.references.key]}">${d[f.references.label]}</option>`
            })
            if(!f.required){
                // Add the empty choice at start
                optionsHtml.unshift( html`<option value="" selected></option>` )
            }
            return html`<select class="form-control" name="${f.key}" id="${f.key}">
                    ${optionsHtml}
                </select>`
        }
    }

    onFileSelected(event){
        const localFile = event.target.files[0]
        const targetElt = this.querySelector('#'+event.target.dataset.target)
        const statusElt = this.querySelector('#'+event.target.dataset.target+'_status')
        statusElt.classList.remove("loaded")
        statusElt.classList.add("loading")
        statusElt.setAttribute('title', get('message.loading'))
        let reader = new FileReader()
        reader.onloadend = function() {
            targetElt.value = reader.result
            statusElt.classList.remove("loading")
            statusElt.classList.add("loaded")
            statusElt.setAttribute('title', get('message.loaded'))
        }
        reader.readAsDataURL(localFile)

    }
    onRemoveFile(event){
        // Nothing to do here
    }

    onRequestAjax(event){
        // 'event.target' is the <input type="text"> element
        const searchedValue = event.target.value
        const field = this.metadata.fields.filter((f) => f.key == event.target.dataset.key )[0]
        const listId = event.target.getAttribute("list")
        if(event.target.dataset.previous == searchedValue){
            return
        }
        event.target.dataset.previous = searchedValue
        this.querySelector('#'+event.target.dataset.key).value = ""

        const datalistElt = this.querySelector('#'+listId)
        call(this.urlOfExternalData(field.references.object, field.references.label, searchedValue), 'GET').then((responseOk, responseFailure) => {
            // wait for response to purge the content
            datalistElt.innerHTML = '' 
            if(responseOk && responseOk.data){
                // And fill with data
                for(let object of responseOk.data) {
                    const optionElt = document.createElement('div')
                    optionElt.classList.add('autocomplete-item')
                    optionElt.setAttribute("data-value", object[field.references.key])
                    optionElt.setAttribute("data-target", field.key)
                    optionElt.innerHTML = object[field.references.label]
                    optionElt.onclick = this.onAutocompleteItemSelected.bind(this)
                    datalistElt.appendChild(optionElt)
                }
                datalistElt.classList.remove('d-none')
            }
        })
    }

    onBlurAjax(event){
        // 'event.target' is the <input type="text"> element
        setTimeout(() => {
            // Wait that the 'onAutocompleteItemSelected()' method is finished
            const storedValue = this.querySelector('#'+event.target.dataset.key).value
            if(storedValue == ""){
                event.target.value = ""
            }
            // Do this at the end, to allow th click on the 'autocomplete-item' element
            event.target.parentElement.querySelector('div.autocomplete').classList.add('d-none')
        }, 200);
    }


    onAutocompleteItemSelected(event){
        const selectedValue = event.target.dataset.value
        const target = event.target.dataset.target
        const input = this.querySelector('#'+target)
        input.value = selectedValue
        this.querySelector('#'+ target+ this.LABEL_SUFFIX).value = event.target.innerHTML
        input.parentElement.querySelector('div.autocomplete').classList.add('d-none')
    }

    /**
     * Open the create modal, with pre-filled parameters
     * 
     * @param {Dict} parameters 
     */
    open(parameters){
        this.fillValues(parameters)

        //console.log("open", parameters)
        this.beforeModalOpens(parameters)
        Modal.getOrCreateInstance(this.modalSelector).show()
    }
    
    fillValues(parameters){
        if(parameters){
            for(let field of this.metadata.fields){
                this.fillValue(field.key, parameters[field.key], field)
            }
        }
    }

    /**
     * 
     * @param {String} id key of the field
     * @param {Object} value Data in the cell of the ListElement
     * @param {*} fieldDefinition metadata of the field
     * @returns 
     */
    fillValue(id, value, fieldDefinition){
        const element = this.querySelector('.modal-body #'+id)
        if(element == null){
            //console.warn("no key id=" + id)
            return
        }
        if(fieldDefinition.type.startsWith("password")){
            // Don't set the password in the input
            return
        }

        if(fieldDefinition.type.startsWith("flag")){
            element.checked = !!value
            return
        }

        if(['INPUT', 'SELECT'].includes(element.tagName.trim())){
            element.value = value
            if(fieldDefinition.type.startsWith("file")){
                const imgElt = element.parentElement.querySelector('img.preview')
                if(value){
                    imgElt.setAttribute('src', this.conf.server.host + this.conf.server.uploads + value)
                    imgElt.classList.remove('d-none')
                    element.parentElement.querySelector('button').classList.remove('d-none')
                }else{
                    imgElt.classList.add('d-none')
                    element.parentElement.querySelector('button').classList.add('d-none')
                }
                return
            }
            if(fieldDefinition.references && fieldDefinition.references.access == "ajax" && value){
                call('/api/v1/'+fieldDefinition.references.object+'s/'+value, 'GET').then((responseOk, responseFailure) => {
                    if(responseOk){
                        const textElement = this.querySelector('.modal-body #'+id + this.LABEL_SUFFIX)
                        if(textElement == null){
                            console.error("textElement not found: " + ('.modal-body #'+id + this.LABEL_SUFFIX))
                        }else{
                            textElement.value = responseOk[fieldDefinition.references.label]
                            textElement.dataset.previous = textElement.value
                        }
                    }
                })
                return
            }
            return
        }
        if(['TEXTAREA'].includes(element.tagName)){
            element.innerHTML = value
            return
        }
        console.log("not managed:", element.tagName, fieldDefinition, value)
    }



    /**
     * Display the toast with a message
     * 
     * @param {*} message 
     * @param {*} status String, one of danger | info | warning | success
     * @param {*} title 
     * @param {*} subtitle 
     */
    openToast(message, status = 'info', title= "", subtitle = ""){
        const toastElt = new Toast('#toast')
        toastElt.hide()
        toast.classList.remove('toast-danger', 'toast-info', 'toast-warning', 'toast-success')
        toast.classList.add('toast-'+status)
        toast.querySelector('.toast-title').innerHTML = title
        toast.querySelector('.toast-body').innerHTML = message
        toastElt.show()
    }
}