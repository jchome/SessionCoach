import { LitElement, html } from 'lit'

/**
 * To use it, copy this component into a new component registered as "app-navbar".
 * The CSS will be used with this tag name.
 */
export default class SampleNavBarElement extends LitElement {
    static properties = {
        title: {type: String},
        'icon-class': {type: String},
        'img-src': {type: String},
    }
    static get styles() { };

    constructor() {
        super();
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
	    return html`
            <nav class="navbar navbar-expand-lg fixed-top w-100">
                <div class="d-flex w-100">
                    <span class="mt-1">
                        ${ logo }
                        ${ this.title }
                    </span>
                    <span class="version">${ window.APP_VERSION }</span>
                    
                    <app-dropdown id="menu-1" class="ms-2" 
                        icon-class="bi bi-file-earmark" title="Fichier" show="icon, title">
                        <app-dropdown-item href="#">Nouveau</app-dropdown-item>
                        <app-dropdown-item click-event="onOpenFile">Ouvrir...</app-dropdown-item>
                        <app-dropdown-divider></app-dropdown-divider>
                        <app-dropdown-item click-event="onSaveFile">Enregistrer</app-dropdown-item>
                    </app-dropdown>

                    <button class="btn btn-sm">Go!</button>

                    <span class="separator-1">|</span>
                    <app-dropdown id="menu-1" icon-class="bi bi-balloon" title="Menu 2">
                        <app-dropdown-item href="#">Action</app-dropdown-item>
                        <app-dropdown-item href="#">Another action</app-dropdown-item>
                        <app-dropdown-item href="#">Something else here</app-dropdown-item>
                    </app-dropdown>
                    
                    <span class="separator-fill"></span>
                    <app-dropdown id="themeBtn" icon-class="bi bi-moon" 
                        title="Changer le thème" direction="bottom-left">
                        <app-dropdown-item click-event="onThemeChanged" data-theme="dark"><i class="bi bi-moon me-2"></i> Thème nocturne</app-dropdown-item>
                        <app-dropdown-item click-event="onThemeChanged" data-theme="light"><i class="bi bi-brightness-high me-2"></i> Thème journée</app-dropdown-item>
                    </app-dropdown>

                    <!-- a href="#" class="font-small mt-3">Message</a-->
                </div>
            </nav>`
    }

}

// Register component
customElements.define('app-sample-navbar', SampleNavBarElement);