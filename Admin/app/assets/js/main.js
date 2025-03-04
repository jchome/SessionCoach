import {LitElement, html} from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { use, translate, get } from 'lit-translate'

import { until } from 'lit/directives/until.js'
import { Toast, Modal } from 'bootstrap'
import { Preferences } from '@capacitor/preferences';

import NavBarElement from './navbar.js';


export default class MainElement extends LitElement {
    static properties = { 
    };

    static get styles() { };

    constructor() {
        super();
        this.user = undefined
    }

    
    /**
     * Don't use the shadow-root node. The "styles" property will not be used.
     * @returns 
     */
     createRenderRoot() {
        return this;
    }
    
    render() {
        const promises = [Preferences.get({ key: window.KEY_USER }), use("fr")]
        
        return until( Promise.all(promises).then( ([userPref, _]) => {
            if(userPref != null && userPref.value != null){
                this.user = JSON.parse(userPref.value)
            }else{
                document.location.href = BASE_HREF + "/pages/login.html"
                return html``
            }
            return html`
                <app-navbar id="navbar"
                    icon-class="bi bi-key me-2"
                    .user="${this.user}">
                </app-navbar>
                <div class="centered-loader display-1">
                    ${ translate("app-main.welcome") }
                </div>`
        }), 
        html`
            <div class="centered-loader">
                <div class="loader spinner-border" role="status">
                    <span class="visually-hidden">
                        ${ translate("app-main.loading") }
                    </span>
                </div>
            </div>
        `
        )
        
    }

    

    /**
     * Open the toast to display a message
     * Use with: 
                <!-- TOAST -->
                <div id="toast" class="toast toast-top" role="alert" aria-live="assertive" 
                    aria-atomic="true" data-bs-delay="5000">
                    <div class="toast-header">
                        <i class="bi bi-info-circle-fill me-2 icon-info"></i>
                        <i class="bi bi-check-circle-fill me-2 icon-success"></i>
                        <i class="bi bi-exclamation-triangle-fill me-2 icon-warning"></i>
                        <i class="bi bi-bug-fill me-2 icon-danger"></i>
                        <strong class="me-auto toast-title">Information</strong>
                        <small class="toast-subtitle">11 mins ago</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        This is a toast message.
                    </div>
                </div>
     * 
     * @param {String} message 
     * @param {String} status can be 'info' | 'success' | 'warning' | 'danger'
     */
    toastMessage(message, status = 'info', title= "", subtitle = ""){
        const toastElt = (new Toast('#'+toast.id))
        toastElt.hide()
        toast.classList.remove('toast-danger', 'toast-info', 'toast-warning', 'toast-success')
        toast.classList.add('toast-'+status)
        toast.querySelector('.toast-title').innerHTML = title
        toast.querySelector('.toast-subtitle').innerHTML = subtitle
        toast.querySelector('.toast-body').innerHTML = message
        toastElt.show()
    }

}

customElements.define('app-main', MainElement);