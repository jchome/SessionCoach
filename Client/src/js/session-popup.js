import {LitElement, html} from 'lit'
import { Modal } from 'bootstrap';

import SessionDetailElement from './session-detail.js';

export default class SessionPopupElement extends LitElement {
    static properties = { };
    static get styles() { };

    constructor() {
        super();

        this.addEventListener('scrollToElement', this.scrollToElement)
        this.addEventListener('closePopup', this.close)
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
            <video loop="true" autoplay="true" class="shutdown-blocker" onloadstart="this.volume=0.2">
                <source type="video/mp4" src="assets/noop.mp4" />
            </video>
            <div id="sessionModal" class="modal fade" tabindex="-1" aria-hidden="true" 
                data-bs-theme="dark">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content p-md-4">
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
        const modalElt = this.querySelector('#sessionModal')
        modalElt.addEventListener('hide.bs.modal', () =>{
            this.querySelector('video').pause();
        })
        this.querySelector('video').play();
        modal.show()
    }

    close(event){
        const modal = Modal.getOrCreateInstance('session-popup #sessionModal', {})
        modal.hide()
    }

    scrollToElement(event){
        const targetId = event.detail
        const modal = this.querySelector('#sessionModal .modal-body')
        var top = modal.scrollTop
            + this.querySelector('#'+targetId).getBoundingClientRect().top
            - this.querySelector('#sessionModal .modal-header').getBoundingClientRect().height
        modal.scrollTo({top: top, behavior: 'smooth'});
    }

}

// Register component
customElements.define('session-popup', SessionPopupElement)
