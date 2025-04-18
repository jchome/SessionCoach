import { LitElement, html } from 'lit';
import { until } from 'lit/directives/until.js'
import { use, translate, get } from 'lit-translate'
import { Preferences } from '@capacitor/preferences';

import ModuleListElement from './list.js';


export default class MainModuleElement extends LitElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
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
                        <app-module-list
                            .user="${this.user}">
                        </app-module-list>
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

}

customElements.define('app-main-module', MainModuleElement);