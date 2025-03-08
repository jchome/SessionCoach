import {LitElement, html} from 'lit';
import { until } from 'lit/directives/until.js'
import { use, translate } from 'lit-translate'
import { Preferences } from '@capacitor/preferences';

import { Toast } from 'bootstrap';

export default class LoginPage extends LitElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.csrf = undefined
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

        return until(
            Promise.all([this.loadData(), use("fr")]).then( ([data, _])=> {
                if(data && data.name && data.hash){
                    this.csrf = data;
                }
                return html`
                <section class="mt-5">
                    <div class="container">

                        <form @submit=${this.sendLogin}>
                            <div class="row justify-content-center">
                                <div class="card p-0 col-10 col-md-8 col-lg-6 col-xl-4" style0="width: 26rem;">
                                    <div class="card-header">
                                        <h5>${ translate("app-login.welcome") }</h5>
                                    </div>

                                    <div class="card-body">
                                        <input type="hidden" name="formSend" value="true" />
                                        <div class="form-group mb-3">
                                            <label class="label" for="login">
                                                ${ translate("app-login.login") }
                                            </label>
                                            <input type="text" class="form-control" 
                                                placeholder="" value="" id="login" name="login" required>
                                        </div>
                                        <div class="form-group mb-3">
                                            <label class="label" for="password">
                                                ${ translate("app-login.password") }
                                            </label>
                                            <input type="password" class="form-control" placeholder="" name="password" id="password" required>
                                        </div>
                                        <div class="text-center mt-5">
                                            <button class="btn btn-primary rounded submit px-3" @click=${this.sendLogin}>
                                            ${ translate("app-login.connect") }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
                <!-- ********************** TOAST ********************* -->
                <div class="toast-container p-3">
                        <div id="liveToast" class="toast align-items-center bg-danger text-light" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="d-flex">
                                <div class="toast-body">
                                    --
                                </div>
                                <button type="button" class="btn-close me-2 m-auto text-light" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                </div>`
            })
            , html`
                <div class="centered-loader flex-column">
                    <div class="mb-2">
                        ${ translate("app-login.server-check") }
                    </div>
                    <div class="loader spinner-border" role="status">
                        <span class="visually-hidden">
                        ${ translate("app-login.loading") }</span>
                    </div>
                </div>`
        )
    }

    loadData(){
        return new Promise((resolve, reject) => {
            // Load 'config.json' file
            fetch(window.BASE_HREF + "/config.json")
            .then( (response) => response.json())
            .then( async (currentConf) => {
                // Store config
                Preferences.set({
                    key: KEY_CONFIG,
                    value: JSON.stringify(currentConf)
                }).then( () => { 
                    // Call CSRF
                    call('/Security/csrf/', 'GET').then((responseOk, responseFailure) => {
                        if(responseOk){
                            resolve(responseOk.data)
                        }else{
                            // Don't allow to connect
                            console.error("Cannot connect...")
                            console.error(responseFailure)
                            reject()
                        }
                    })

                })
            })
        })
    }

    sendLogin(event){
        event.preventDefault() // Required if pressed ENTER on form
        const login = this.querySelector('#login').value.trim()
        const password = this.querySelector('#password').value.trim()
        const data = {
            'login': login ,
            'password': password,
            'formSend': true,
        }

        data[this.csrf.name] = this.csrf.hash

        call('/Security/sign_in', 'POST', data).then((responseOk, responseFailure) => {
            if(responseOk && responseOk.status === 'ok'){
                const user = responseOk.data
                Promise.all([
                    Preferences.set({key: KEY_USER_TOKEN, value: JSON.stringify(user.token)}),
                    Preferences.set({key: KEY_USER, value: JSON.stringify(user)}),
                ]).then( () => {
                    document.location.href = window.BASE_HREF
                })
            }else{
                var message = "Error"
                if(responseOk){
                    message = responseOk.data
                }
                if(responseFailure){
                    message = responseFailure
                }
                const toastBody = this.querySelector('#liveToast .toast-body')
                toastBody.innerHTML = message
                const toastBootstrap = Toast.getOrCreateInstance('#liveToast');
                toastBootstrap.show();
            }
        })
    }

}

window.customElements.define('app-login', LoginPage);