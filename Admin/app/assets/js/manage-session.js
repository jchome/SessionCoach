import { LitElement, html } from 'lit';
import { until } from 'lit/directives/until.js'
import { use, translate, get } from 'lit-translate'
import { Preferences } from '@capacitor/preferences';



export default class ManageSessionElement extends LitElement {
    static properties = { 
    }
    static get styles() { }

    constructor() {
        super()
        this.user = undefined
        this.session = undefined
    }
    
    /**
     * Don't use the shadow-root node. The "styles" property will not be used.
     * @returns 
     */
     createRenderRoot() {
        return this;
    }
    

    render() {
        const promises = [Preferences.get({ key: window.KEY_USER }), use("fr"),
            this.loadSession()
        ]

        return until(Promise.all(promises).then( ([userPref, _]) => {
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
                <app-container>
                    <app-panel>
                        ${ this.session.name }
                    </app-panel>
                </app-container>
                    `
            }), 
            html`
                <div class="centered-loader">
                    <div class="loader spinner-border" role="status">
                        <span class="visually-hidden">
                            ${ translate("app-main.loading") }
                        </span>
                    </div>
                </div>
            `)
    }

    loadSession(){
        const urlParams = new URLSearchParams(window.location.search)
        const session_id = urlParams.get("id")
        return new Promise(resolve => {
            call('/api/v1/sessions/' + session_id, 'GET').then((responseOk, responseFailure) => {
                //console.log(responseOk)
                this.session = responseOk
                return resolve()
            })
        })
    }

}

customElements.define('app-manage-session', ManageSessionElement);