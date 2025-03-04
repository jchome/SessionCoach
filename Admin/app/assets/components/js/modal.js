import { LitElement, html } from 'lit'
import { Modal } from 'bootstrap';
import { translate } from 'lit-translate';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export default class ModalElement extends LitElement {
    static properties = {
        cssClasses: {type: Array},
        modalTitle: {type: String},
    }
    static get styles() { };
    
    constructor() {
        super();
        this.childrenHTML = undefined
    }


    /**
     * The default implementation of createRenderRoot creates an open shadow root 
     * and adds to it any styles set in the static styles class field.
     * To customize a component's render root, implement createRenderRoot and 
     * return the node you want the template to render into.
     * 
     * Don't use the shadow-root node. The "styles" property will not be used.
     * @returns 
     */
    createRenderRoot() {
        return this;
    }
	
    /**
     * Called before update() to compute values needed during the update.
     *
     * Updates?	    No. Property changes inside this method do not trigger an element update.
     * Call super?  Not necessary.
     * 
     * @param {Dictionary} changedProperties 
     * @returns Boolean
     */
    willUpdate(changedProperties){
        if(this.childrenHTML){
            return
        }
        this.childrenHTML = unsafeHTML(this.innerHTML)
        this.innerHTML = ""
    }
	
    render() {
        return html`
            <div class="modal fade" id="modalElement" tabindex="-1" 
                data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                ${ this.modalTitle }
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" 
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${ this.childrenHTML }
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" 
                                data-bs-dismiss="modal">
                                ${ translate("action.cancel") }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    
    open(){
        const modalElt = this.querySelector('#modalElement')
        
        // Before the modal is shown
        modalElt.addEventListener('show.bs.modal', () =>{
            
        });
        Modal.getOrCreateInstance("#modalElement").show()
    }
}
// Register component
customElements.define('app-modal', ModalElement);