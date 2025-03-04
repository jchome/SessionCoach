import { html } from 'lit';
import { Modal } from 'bootstrap';
import { translate } from 'lit-translate'
import { Datepicker } from 'vanillajs-datepicker'
import fr from 'vanillajs-datepicker/locales/fr';
Object.assign(Datepicker.locales, fr);

import GenericObjectElement from './object-generic.js'

export default class GenericCreateElement extends GenericObjectElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.modalSelector = '#createModal'
    }

    renderModal() {
        return html`
            <div class="modal fade" id="createModal" tabindex="-1" 
                data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            ${translate("object."+this.objectName+".title-create")}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" 
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${ this.getFields() }

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" 
                            data-bs-dismiss="modal">
                            ${ translate("action.cancel") }
                            </button>
                        <button type="button" class="btn btn-primary" @click=${this.onApply}>
                            ${ translate("action.apply") }
                        </button>
                    </div>
                    </div>
                </div>
            </div>
            
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
    }


    urlOfSave(){
        return `/api/v1/${this.objectName}s/`
    }


    onApply(event){
        const data = {}
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
        });

        // Call the server to store data
        var url = this.urlOfSave()
        call(url, 'POST', data).then((responseOk, responseFailure) => {
            //console.log(responseOk, responseFailure)
            if(responseOk){
                Modal.getOrCreateInstance("#createModal").hide()
                // Raise an event to reload the list
                this.dispatchEvent(new CustomEvent('updateList', {
                    bubbles: true
                }))
            }else{
                console.log(responseOk, responseFailure)
                //const errors = Object.entries(responseOk.messages).map(([k, v]) => v).join("<br>")
                this.openToast(errors, "danger", "Error")
            }
        })

    }


}
window.customElements.define('app-object-create', GenericCreateElement);