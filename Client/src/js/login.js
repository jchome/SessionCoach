import {LitElement, html} from 'lit';
import { Toast } from 'bootstrap';
import { until } from 'lit/directives/until.js';


export default class LoginElement extends LitElement {

    static properties = { };
    static get styles() { };

    constructor() {
        super();
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
        return until(this.loadData().then((data)=> {
            var connextionHtml = html`<div class="error">
                    Connexion impossible...
                </div>`
            if(data && data.name && data.hash){
                this.csrf = data;
                connextionHtml = html`
                <form action="" onsubmit="return false">
                    <!--button class="gsi-material-button" @click=${this.connectWithGoogle}>
                        <div class="gsi-material-button-state"></div>
                        <div class="gsi-material-button-content-wrapper">
                            <div class="gsi-material-button-icon">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                            </div>
                            <span class="gsi-material-button-contents">Se connecter avec Google</span>
                        </div>
                    </button -->

                    <div class="inputs">
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="bi bi-person"></i>
                            </span>
                            <input name="email" id="loginInput" type="text" class="form-control">
                        </div>
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="bi bi-key"></i>
                            </span>
                            <input name="password" id="passwordInput" type="password" class="form-control">
                        </div>
                    </div>

                    <div class="button-container" style="z-index: 0;">
                        <button class="button" id="loginBtn" @click=${ this.login }>
                            <span class="sign-in">
                                Me connecter
                            </span>
                            <div class="loader spinner-border" role="status">
                                <span class="visually-hidden">Chargement...</span>
                            </div>
                        </button>
                    </div>
                    </form>
                    <!--a href="#" @click=${ this.forgotPassword } class="forgot-password">
                        Mot de passe oublié
                    </a>
                    <br>
                    <youdance-forgot-password></youdance-forgot-password -->`
            }
            return html`<div class="login">
                <img src="./assets/img/logo.jpg" class="img-splash">
                <p class="font-text version">v ${APP_VERSION}</p>
                ${connextionHtml}
                <div class="circle" class="d-none"></div>
            </div>

            <!-- ********************** TOAST ********************* -->
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                    <div id="liveToast" class="toast align-items-center bg-danger text-light" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                                Une erreur est survenue
                            </div>
                            <button type="submit" class="btn-close me-2 m-auto text-light" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            </div>`
        }), html`
            <div class="fullscreen">
                <img src="./assets/img/logo.jpg" class="img-splash">
                <p class="mt-5">Chargement...</p>
                <div class="loader spinner-border" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
            </div>`)
    }

    loadData(){
        return new Promise((resolve, reject) => {
            call('/Security/csrf', 'GET').then((responseOk) => {
                if(responseOk){
                    resolve(responseOk.data)
                }else{
                    // Don't allow to connect
                    console.error("Cannot connect...")
                    reject()
                }
            })
        })
    }

    connectWithGoogle(event){
        const referer = document.location.origin + document.location.pathname
        call('/Security/getGoogleAuthUrl?redirect='+referer, undefined, 'GET-no-cache').then((responseOk) => {
            document.location.href = responseOk.data
        })
    }

    login(event){
        // Start login process
        const circle = this.querySelector('.circle')
        const button = this.querySelector('.button')
        circle.style.left = button.getBoundingClientRect().left + (button.getBoundingClientRect().width / 2) + circle.getBoundingClientRect().width / 2 + "px"
        circle.style.top = button.getBoundingClientRect().top + (button.getBoundingClientRect().height / 2) + circle.getBoundingClientRect().height / 2 + "px"

        // Start the request
        const data = {
            'login': loginInput.value.trim().toLowerCase(),
            'password': passwordInput.value.trim(),
            'formSend': true,
        }
        data[this.csrf.name] = this.csrf.value

        // Before send
        button.classList.add('animate');
        this.querySelector('.sign-in').classList.add('animate')
        this.querySelector('.loader').classList.add('animate')

        call('/Security/sign_in', 'POST', data).then(
            (responseOk) => {
                if(responseOk && responseOk.status === 'ok'){
                    circle.classList.remove('d-none');
                    circle.classList.add('grow');
                    this.manageTokenAfterLogin(responseOk.data.token)
                }else{
                    circle.classList.add('d-none');
                    button.classList.remove('animate');
                    this.querySelector('.sign-in').classList.remove('animate')
                    this.querySelector('.loader').classList.remove('animate')
                    this.querySelector('#liveToast .toast-body').innerHTML = responseOk.data;
                    const toastBootstrap = Toast.getOrCreateInstance('#liveToast');
                    toastBootstrap.show();
                }
            },
            (responseFailure) => {
                circle.classList.add('d-none');
                button.classList.remove('animate');
                this.querySelector('.sign-in').classList.remove('animate')
                this.querySelector('.loader').classList.remove('animate')
                this.querySelector('#liveToast .toast-body').innerHTML = "Le serveur n'est pas accessible...";
                const toastBootstrap = Toast.getOrCreateInstance('#liveToast');
                toastBootstrap.show();
            }
        )
    }

    manageTokenAfterLogin(token){
        // Wait a little time before removing the form
        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('user-connected', {
                detail: token,
                bubbles: true,
            }))
            this.querySelectorAll('.button-container, .inputs, .img-splash, #forgotPasswordLink').forEach(elt => {
                elt.classList.add('d-none')
            })
        }, 1000);
    }

    forgotPassword(event){
        const forgotElt = this.querySelector('app-forgot-password')
        forgotElt.email = loginInput.value.trim()
        forgotElt.open()
    }
  
}

window.customElements.define('app-login', LoginElement);


