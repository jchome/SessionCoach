import { LitElement, html } from 'lit'
import { translate, get } from 'lit-translate'
import { Preferences } from '@capacitor/preferences'

import DropdownItemElement from '../components/js/dropdown-item.js'

export default class NavBarElement extends LitElement {
    static properties = {
        title: {type: String},
        'icon-class': {type: String},
        'img-src': {type: String},
        user: {type: Object},
        activeItem: {type: String},
    }
    static get styles() { };

    constructor() {
        super();
        this.addEventListener('menu', this.onMenu )
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
     * Called by update() and should be implemented to return a renderable 
     *   result (such as a TemplateResult) used to render the component's DOM.
     *
     * Updates?    No. Property changes inside this method do not trigger an element update.
     * Call super? Not necessary.
     * 
     * @param {Dictionary} changedProperties 
     * @returns Boolean
     */
    render() {
        var logo = ""
        if(this['icon-class']){
            logo = html`<i class="${this['icon-class']}"></i>`
        }
        if(this['img-src']){
            logo = html`<img src="${this['img-src']}" class="img-fluid">`
        }
        // Use 'translate()' for direct access
        // Use 'get()' for access in another LitElement instance
	    return html`
            <nav class="navbar navbar-expand-lg fixed-top w-100">
                <div class="d-flex w-100">
                    <span class="mt-1">
                        ${ logo }
                        ${ translate("app-navbar.mainTitle") }
                    </span>
                    <span class="version">${ window.APP_VERSION }</span>
                    
                    <span class="separator-1 me-5"></span>
                    
                    <app-dropdown id="menu-parameters"
                        label="${ get('app-navbar.menu.parameters')}"
                        show="label">
                        <app-dropdown-item href="${window.BASE_HREF}/pages/user.html">
                            ${ get('object.user.label') }
                        </app-dropdown-item>
                        <app-dropdown-item href="${window.BASE_HREF}/pages/access.html">
                            ${ get('object.access.label') }
                        </app-dropdown-item>
                    </app-dropdown>

                    <a class="btn btn-sm btn-outline-light me-2" href="${window.BASE_HREF}/pages/session.html">
                        ${ get('object.session.label') }
                    </a>
                    
<!--
                    <app-dropdown id="menu-content"
                        label="${ get('app-navbar.menu.content')}"
                        show="label">
                        <app-dropdown-item href="${window.BASE_HREF}/pages/session.html">
                            ${ get('object.session.label') }
                        </app-dropdown-item>
                        <app-dropdown-item href="${window.BASE_HREF}/pages/module.html">
                            ${ get('object.module.label') }
                        </app-dropdown-item>
                        <app-dropdown-item href="${window.BASE_HREF}/pages/step.html">
                            ${ get('object.step.label') }
                        </app-dropdown-item>
                    </app-dropdown>
                    -->


                    <span class="separator-fill"></span>
                    
                    <button class="btn btn-sm btn-outline me-2" @click=${this.onLogout}
                        title="${ get('action.logout') }">
                        <i class="bi bi-person-fill"></i> 
                    </button>
                    
                    
                    <label class="form-check-label" for="switchDarkLightMode"><i class="bi bi-moon me-2"></i></label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="switchDarkLightMode" @change=${this.onThemeChanged}>
                        <label class="form-check-label" for="switchDarkLightMode"><i class="bi bi-brightness-high me-2"></i></label>
                    </div>

                    <!-- a href="#" class="font-small mt-3">Message</a-->
                    
                </div>
            </nav>`
    }

    onThemeChanged(event){
        this.dispatchEvent(new CustomEvent('switchTheme', {
            bubbles: true,
        }))
    }

    onLogout(event){
        if(!confirm( get("app-navbar.logout") )){
            return
        }
        Preferences.set({
            key: KEY_USER,
            value: null
        }).then(() => {
            this.user = undefined
        })
        document.location.href = window.BASE_HREF + "/pages/login.html"
    }

    onMenu(event){
        const item = event.target.getAttribute("data-menu")
        this.dispatchEvent(new CustomEvent('onMenu', {
            detail: {
                'menu': item
            },
            bubbles: true,
        }))
    }
    

}

// Register component
customElements.define('app-navbar', NavBarElement);