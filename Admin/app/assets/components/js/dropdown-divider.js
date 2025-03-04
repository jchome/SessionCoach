import { LitElement, html } from 'lit'


export default class DropdownDividerElement extends LitElement {
    static properties = { }
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
     * Called before update() to compute values needed during the update.
     *
     * Updates?	    No. Property changes inside this method do not trigger an element update.
     * Call super?  Not necessary.
     * 
     * @param {Dictionary} changedProperties 
     * @returns Boolean
     */
    willUpdate(changedProperties){
        this.content = this.innerHTML
        this.innerHTML = ""
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
	    return html`
            <li><hr class="dropdown-divider"></li>`
    }

	
}

// Register component
customElements.define('app-dropdown-divider', DropdownDividerElement);