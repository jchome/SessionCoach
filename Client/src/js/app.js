import { LitElement, html } from 'lit'
import { until } from 'lit/directives/until.js'

import SessionCardElement from './session-card.js';
import SessionPopupElement from './session-popup.js';


export default class MainApp extends LitElement {

    static properties = { };
    static get styles() { };

    constructor() {
        super();
        this.sessions = undefined

        this.isMobile = false
        // Hide navigation bar + every 3 seconds
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            this.isMobile = true
        }

        this.addEventListener('open-session', this.openSession)

    }

    /**
     * Don't use the shadow-root node. The "styles" property will not be used.
     * @returns 
     */
    createRenderRoot() {
        return this;
    }


    render() {
        return until(this.loadData().then( () => {
            return html`
            <div class="d-flex justify-content-center">
            ${this.sessions.map( session => {
                return html`<session-card .session=${session}></session-card>`
            })}
            </div>
            <session-popup></session-popup>
            `
        }), html`
        <div class="fullscreen">
            <img src="./assets/img/logo.jpg" class="img-splash">
            <p class="mt-5">Chargement...</p>
            <div class="loader spinner-border" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
        </div>` )
    }

    loadData(){
        return new Promise((resolve) => {
            call('/api/v2/sessions', 'GET').then((responseOk) => {
                this.sessions = responseOk.data
                resolve()
            })
        })
    }

    openSession(event){
        const sessionPopupElt = this.querySelector('session-popup')
        sessionPopupElt.open(event.detail)
    }


}

window.customElements.define('app-main', MainApp);
