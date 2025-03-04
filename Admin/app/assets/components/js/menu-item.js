import { LitElement, html } from 'lit'


export default class MenuItemElement extends LitElement {
    static properties = {
        iconCss: {type: String},
        label: {type: String},
        action: {type: String},
        active: {type: Boolean},
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
	
    render() {
        var icon = html``
        if(this.iconCss){
            icon = html`<i class="${this.iconCss}"></i>`
        }
        return html`<div class="menu-item ${this.active?'active':''}" @click=${this.onAction}><span class="menu-icon">${icon}</span><span class="menu-title">${this.label}</span></div>`
    }

    onAction(event){
        this.dispatchEvent(new CustomEvent('menuClicked',{
            detail: {
                item: this,
            },
            bubbles: true,
        }))
    }
	
}

// Register component
customElements.define('app-menu-item', MenuItemElement);