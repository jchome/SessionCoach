import { LitElement, html } from 'lit';
import { until } from 'lit/directives/until.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { translate, get } from 'lit-translate'
import { Preferences } from '@capacitor/preferences';
import { Modal } from 'bootstrap';

import GenericEditElement from './edit-generic.js'
import GenericCreateElement from './create-generic.js'

const LABEL_SUFFIX = "_label"

export default class GenericListElement extends LitElement {
    static properties = {
        objectName: {type: String},
        currentPage: {type: Number},
        orderBy: {type: String}, // Orber by a column
        asc: {type: Boolean}, // True: asc, False: desc
        user: {type: Object},
        visible: {type: Boolean},
    }
    static get styles() { }

    constructor() {
        super()
        this.conf = undefined
        this.currentPage = 1 // Default first page
        this.foreignFields = []
        this.columns = []

        this.actions = [
            {
                code: 'edit', 
                cssClass: 'btn btn-sm btn-primary mx-2 action-edit'
            },
            {
                code: 'delete', 
                cssClass: 'btn btn-sm btn-danger mx-2 action-delete'
            }
        ]

        this.addEventListener('edit', this.onEdit)
        this.addEventListener('delete', this.onDelete)
        this.addEventListener('onPageChange', this.onPageChange)
        this.addEventListener('columnClicked', this.onColumnClicked)
        this.addEventListener('cellClicked', this.onCellClicked)
        this.addEventListener('updateList', () => this.requestUpdate() )

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
        if(!this.objectName){
            return html``
        }
        const promises = [
            Preferences.get({ key: window.KEY_CONFIG }),
            this.loadModel(),
            this.loadData()
        ]

        return until(Promise.all(promises).then( ([confPref, _, result]) => {
            this.conf = JSON.parse(confPref.value)
            this.items = this.convertData(result.data)
            return html`
                <h1 class="m-2">${translate("object."+this.objectName+".title-list")}</h1>
                ${ this.getTopRightHtml() }
                <app-table 
                    .items=${ this.items }
                    .columns=${ this.columns }
                    .actions=${ this.actions }
                    .sort-column=${this.orderBy}
                    .sort-order=${this.asc}
                    .label-suffix=${LABEL_SUFFIX}
                ></app-table>
                <div class="d-flex flex-row justify-content-around">
                    <app-table-pagination .pager=${result.pager}></app-table-pagination>
                    <div>
                        <button class="btn btn-primary m-2"
                            @click=${ this.onCreate }>
                            ${ translate("action.add") }
                        </button>
                    </div>
                </div>
                ${ this.getEditorHtml() }
                ${ this.getCreatorHtml() }
                ${ this.getImageZoomHtml() }
                `
            }), html`
            <div class="centered-loader flex-column">
                <div class="mb-2">
                    ${ translate("app-login.loading") }
                </div>
                <div class="loader spinner-border" role="status">
                    <span class="visually-hidden">
                    ${ translate("app-login.loading") }</span>
                </div>
            </div>`
        )
        
    }

    getTopRightHtml(){
        return html``
    }

    /**
     * Default editor html content
     * 
     * @returns Html
     */
    getEditorHtml(){
        return html`<app-object-edit id="editor"
                    .objectName=${ this.objectName }
                    .metadata=${ this.metadata } 
                    .conf=${ this.conf }>
            </app-object-edit>`
    }

    /**
     * Default creator html content
     * 
     * @returns Html
     */
    getCreatorHtml(){
        return html`<app-object-create id="creator"
                    .objectName=${ this.objectName } 
                    .metadata=${ this.metadata }
                    .conf=${ this.conf }>
                </app-object-create>`
    }

    getImageZoomHtml(){
        return html`<div class="modal" id="imgModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <img class="img-fluid" src="">
                        </div>
                    </div>
                </div>
            </div>`
    }


    /**
     * Convert data before the rendering
     * 
     * @param {Array} data 
     * @returns 
     */
    convertData(data){
        return data.map((item) => {
            this.metadata.fields.forEach(field => {
                if(field.type.startsWith("file") && item[field.key]){
                    item[field.key + LABEL_SUFFIX] = unsafeHTML(`<img src="${this.conf.server.host}${this.conf.server.uploads}${item[field.key]}" class="img-fluid" style="max-width: 42px;">`)
                }
                if(field.type.startsWith("date") && item[field.key]){
                    if(item[field.key] == "0000-00-00"){
                        item[field.key] = ""
                    }else{
                        item[field.key] = dateSqlToHuman(item[field.key])
                    }
                }
                if(field.type.startsWith("flag")){
                    if(item[field.key] == 1){
                        // 1 = checked
                        item[field.key] = html`<i class="bi bi-check2-square"></i>`
                    }else{
                        // 0 || null = not checked
                        item[field.key] = null // Don't set anything in the cell.
                        // The "Edit" modal would have no data for this field
                    }
                }
            });
            return item
        })
    }



    loadModel(){
        return new Promise((resolve, reject) => {
            fetch(BASE_HREF+'/assets/metadata/'+this.objectName+'-meta-data.json')
                .then((response) => response.json())
                .then((json) => {
                    this.metadata = json
                    this.foreignFields = this.metadata.fields.filter(f => f.references != undefined)
                    this.columns = this.metadata.fields.filter((f) => {
                        if(f.show.list == undefined){
                            return true
                        }
                        if(f.show.list == true){
                            return true
                        }
                    }).map((f) => {
                        let column = Object.assign({}, f) // Make a copy of 'f'
                        column.label = translate("object."+this.objectName+".field."+f.key)
                        if( get("object."+this.objectName+".field."+f.key) == "[object."+this.objectName+".field."+f.key+"]"){
                            // Not translated
                            if( f.references != undefined){
                                // Update the key on 'column', not on 'f'
                                // Use 'get' because there is string manipulation
                                column.label = get("object."+f.references.object+".label") + ' (' +
                                    get("object."+f.references.object+".field."+f.references.label)+')'
                            }
                        }
                        return column
                    })
                    resolve()
                })
            })
    }

    loadData(page){
        var url = this.urlOfList()
        return new Promise((resolve, reject) => {
            call(this.urlOfList(), 'GET').then((responseOk, responseFailure) => {
                //console.log(responseOk)
                if(responseOk){
                    this.loadAllForeignData(responseOk.data).then(() => {
                        resolve(responseOk)
                    })
                }else{
                    reject(responseFailure)
                }
            })
        })
    }

    urlOfList(){
        var sortQuery = ""
        if(this.orderBy != undefined){
            sortQuery = `&sort_by=${this.orderBy}&order=${this.asc?'asc':'desc'}`
        }
        return `/api/v1/${this.objectName}s/?page=${this.currentPage}${sortQuery}`
    }


    loadAllForeignData(data){
        return new Promise((resolve, reject) => {
            let promises = [] 
            for(let foreignField of this.foreignFields){
                for(let index in data){
                    let rawValue = data[index][foreignField.key]
                    if(rawValue != undefined){
                        promises.push(this.loadForeignData(index, foreignField, rawValue))
                    }
                }
            }
            Promise.all(promises).then((result) => {
                for(let res of result){
                    //console.log("index=", res.index, " label=", res.label)
                    data[res.index][res.field.key+LABEL_SUFFIX] = res.label
                }
                resolve()
            })
        })
    }


    loadForeignData(index, field, value){
        return new Promise((resolve, reject) => {
            call('/api/v1/'+field.references.object+'s/'+value, 'GET').then((responseOk, responseFailure) => {
                if(responseOk){
                    let result = {field, index, label: responseOk[field.references.label]}
                    resolve(result)
                }else{
                    reject(responseFailure)
                }
            })
        })
    }


    onEdit(event){
        const item = event.detail.item
        this.querySelector("#editor").open(item)
    }


    onCreate(event){
        this.querySelector("#creator").open()
    }


    onDelete(event){
        const item = event.detail.item
        const keyField = this.metadata.fields.filter((f) => f.primary )[0]
        if(!confirm(get("message.delete-confirm"))){
            return
        }

        call(`/api/v1/${this.objectName}s/${item[keyField.key]}`, 'DELETE').then(() => {
            this.requestUpdate()
        })
    }


    onPageChange(event){
        this.currentPage = event.detail
    }


    onColumnClicked(event){
        const newOrderBy = event.detail.column.key
        if(this.orderBy == newOrderBy){
            this.asc = ! this.asc
            return
        }
        this.orderBy = newOrderBy
        this.asc = true
    }


    onCellClicked(event){
        const target = event.detail.target
        console.log(target)
        if(target.tagName != 'IMG'){
            return
        }
        const modal = this.querySelector('#imgModal')
        modal.querySelector('img').src = target.src
        modal.querySelector('.modal-title').innerHTML = get("object."+this.objectName+".field."+event.detail.column)
        Modal.getOrCreateInstance("#imgModal").show()
    }

}

window.customElements.define('app-object-list', GenericListElement);