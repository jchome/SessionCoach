import { html } from 'lit';
import { Modal } from 'bootstrap';
import { translate, get } from 'lit-translate'

import GenericObjectElement from './object-generic.js'


export default class GenericEditElement extends GenericObjectElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.item = undefined
        this.modalSelector = '#editModal'
    }

	
    renderModal() {
        return html`
            <div class="modal fade" id="editModal" tabindex="-1" 
                data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                ${translate("object."+this.objectName+".title-edit")}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" 
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${ this.getFields() }
                        </div>
                        <div class="modal-footer">
                            <span id="uniqueId"></span>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                ${ translate("action.cancel") }
                            </button>
                            <button type="button" class="btn btn-primary" @click=${this.onApply}>
                                ${ translate("action.apply") }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `
    }

    urlOfSave(id){
        return `/api/v1/${this.objectName}s/${id}`
    }

    collectData(data){
        var idOfObject
        // Get values
        this.metadata.fields.forEach(field => {
            const fieldElt = this.querySelector('.modal-body #'+field.key)
            if(fieldElt){
                if(field.type.toLowerCase().startsWith("flag")){
                    data[field.key] = (fieldElt.checked)?true:null
                }else{
                    data[field.key] = fieldElt.value
                }
            }else{
                data[field.key] = this.item[field.key]
            }
            if(field.primary){
                idOfObject = this.item[field.key]
            }
        });
        return idOfObject
    }

    onApply(event){
        const data = {}
        const idOfObject = this.collectData(data)

        // Call the server to store data
        var url = this.urlOfSave(idOfObject)
        call(url, 'PUT', data).then((responseOk, responseFailure) => {
            if(responseOk){
                Modal.getOrCreateInstance("#editModal").hide()
                // Raise an event to reload the list
                this.dispatchEvent(new CustomEvent('updateList', {
                    bubbles: true
                }))
            }else{
                console.log(responseOk, responseFailure)
                //const errors = Object.entries(responseOk.messages).map(([k, v]) => v).join("<br>")
                this.openToast(errors, "danger", "Erreur")
            }
        })

    }

    beforeModalOpens(parameters){
        this.item = parameters

        const pkField = this.metadata.fields.filter((f) => f.primary )[0]
        this.querySelector('#uniqueId').innerHTML = parameters[pkField.key]
        super.beforeModalOpens(parameters)
    }

    onRemoveFile(event){
        const targetInputId = event.target.dataset.target
        this.querySelector('#'+targetInputId).value = "DELETE"
        this.querySelector(`img.preview[data-target="${targetInputId}"]`).classList.add('d-none')
        this.querySelector(`button[data-target="${targetInputId}"]`).classList.add('d-none')
    }
}
window.customElements.define('app-object-edit', GenericEditElement);