import { LitElement, html } from 'lit'
import { until } from 'lit/directives/until.js'
import { Preferences } from '@capacitor/preferences';

import LoginElement from './login.js';
import SessionCardElement from './session-card.js';
import SessionPopupElement from './session-popup.js';


export default class MainApp extends LitElement {

    static properties = {
        token: {type: String},
     };
    static get styles() { };

    constructor() {
        super();
        this.sessions = undefined
        this.addEventListener('open-session', this.openSession)
        this.addEventListener('user-connected', this.userConnected)

    }

    /**
     * Don't use the shadow-root node. The "styles" property will not be used.
     * @returns 
     */
    createRenderRoot() {
        return this;
    }


    render() {
        return until(this.loadUser().then( () => {
            return html`
                <div class="row">
                ${this.sessions.map( session => {
                    return html`<session-card .session=${session} 
                        class="col-lg-3 col-md-6 col-sm-12"></session-card>`
                })}
                </div>
                <session-popup></session-popup>`
        }, () => {
            // Rejected on loadUser()
            return html`<app-login />`
        }), html`
        <div class="fullscreen pt-5">
            <img src="./assets/img/logo.jpg" class="img-splash mt-5">
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

    loadUser(){
        return new Promise((resolve, reject) => {
            if(this.token){
                this.loginWithToken(this.token).then(() => resolve())
            }
            const tokenAsParameter = (new URLSearchParams(window.location.search)).get("token");
            if(tokenAsParameter){
                this.userLogin(encodeURIComponent(tokenAsParameter)).then(() => {
                    return this.loginWithToken(tokenAsParameter).then(() => resolve())
                })
            }else{
                // Get the token in the local storage
                Preferences.get({ key: KEY_USER_TOKEN }).then((userTokenObj) => {
                    try {
                        const token = JSON.parse(userTokenObj.value)
                        if(token == null){
                            return reject()
                        }
                        return this.loginWithToken(token).then(() => resolve())
                    } catch (error) {
                        // If something goes wrong with storage, cleanup
                        console.error(error)
                        console.log("no token...")
                        Preferences.clear()
                        reject()
                    }
                })
            }
        })
    }

    loginWithToken(token){
        return new Promise((resolve, reject) => {
            if(!token){
                return reject()
            }
            call('/api/v2/auth', 'GET').then((responseOk) => {
                if(responseOk && responseOk.status === 'ok'){
                    const user = responseOk.user
                    this.loadData().then(() => { 
                        return resolve()
                    })
                }else{
                    // Purge parameters for clean reload
                    Preferences.clear()
                    reject()
                }
            },
            (responseFailure) => {
                //Preferences.clear()
                console.error("Erreur de réponse du serveur.")
                console.log(responseFailure)
                reject()
            })
        })
    }

    userConnected(event){
        Preferences.set({key: KEY_USER_TOKEN, value: JSON.stringify(event.detail)}).then( () => {
            this.token = event.detail
        })
    }

    openSession(event){
        const sessionPopupElt = this.querySelector('session-popup')
        sessionPopupElt.open(event.detail)
    }


}

window.customElements.define('app-main', MainApp);
