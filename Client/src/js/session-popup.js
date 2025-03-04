import {LitElement, html} from 'lit'
import { Modal } from 'bootstrap';

import SessionDetailElement from './session-detail.js';

export default class SessionPopupElement extends LitElement {
    static properties = { };
    static get styles() { };

    constructor() {
        super();
    }

    /**
     * Don't use the shadow-root node. The "styles" property will not be used.
     * @returns 
     */
    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div id="sessionModal" class="modal fade" tabindex="-1" aria-hidden="true" 
                data-bs-theme="dark">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 id="title">--</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row m-0 h-100">
                                <session-detail></session-detail>
                            </div>
                        </div><!-- .modal-body -->
                    </div><!-- .modal-content -->
                </div><!-- .modal-dialog -->
            </div> <!-- .modal -->`
    }
    
    open(session){
        // Set the title of the modal
        this.querySelector('#sessionModal #title').innerHTML = session.name
        const detailElt = this.querySelector('session-detail')
        detailElt.session = session

        const modal = Modal.getOrCreateInstance('session-popup #sessionModal', {})
        /*const modalElt = this.querySelector('#sessionModal')
        modalElt.addEventListener('hide.bs.modal', () =>{
            
        })*/
        modal.show()
    }

}

// Register component
customElements.define('session-popup', SessionPopupElement)
