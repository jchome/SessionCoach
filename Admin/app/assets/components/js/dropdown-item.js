import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'


export default class DropdownItemElement extends LitElement {
    static properties = {
        'click-event': {type: String},
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
     * Invoked when the component is added to the document's DOM.
     * 
     * In connectedCallback() you should setup tasks that should only 
     * occur when the element is connected to the document. The most common
     * of these is adding event listeners to nodes external to the element, 
     * like a keydown event handler added to the window. Typically, anything
     * done in connectedCallback() should be undone when the element is 
     * disconnected — for example, removing event listeners on window to 
     * prevent memory leaks.
     */
    connectedCallback() {
        super.connectedCallback()
    }


    /**
     * Invoked when a component is removed from the document's DOM.
     * 
     * This callback is the main signal to the element that it may no 
     * longer be used; as such, disconnectedCallback() should ensure 
     * that nothing is holding a reference to the element (such as event 
     * listeners added to nodes external to the element), so that it is 
     * free to be garbage collected. Because elements may be re-connected 
     * after being disconnected, as in the case of an element moving in 
     * the DOM or caching, any such references or listeners may need to 
     * be re-established via connectedCallback() so that the element continues 
     * functioning as expected in these scenarios. For example, remove event 
     * listeners to nodes external to the element, like a keydown event 
     * handler added to the window.
     */
    disconnectedCallback(){
        super.disconnectedCallback()
    }

    // Lifecycle of component:
    // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle
    /** Pre-Update:
      * Constructor()
      *   -> requestUpdate()
      */
  
    /**
     * Update:
     *  -> performUpdate()
     *  -> shouldUpdate(changedProperties): boolean
     *  -> willUpdate()
     *  -> update()
     *    -> render(): html
     */
  
    /** Post-Update:
      * -> firstUpdated()
      * -> updated()
      * -> updateComplete()
      * The updateComplete promise resolves when the element has finished updating. Use updateComplete 
      *   to wait for an update. The resolved value is a boolean indicating if the element has finished 
      *   updating. It will be true if there are no pending updates after the update cycle has finished.
      *  Usage: this.updateComplete.then( () => { "do somthing..." })
      */

    /**
     * Called to determine whether an update cycle is required.
     *
     * Updates     No. Property changes inside this method do not trigger an element update.
     * Call super? Not necessary.
     * 
     * @param {Dictionary} changedProperties 
     * @returns Boolean
     * /
    shouldUpdate(changedProperties) {
        return true;
    }*/
	
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
     * Called to update the component's DOM.
     *
     * Updates?    No. Property changes inside this method do not trigger an element update.
     * Call super? Yes. Without a super call, the element’s attributes and template will not update.
     * 
     * @param {Dictionary} changedProperties 
     * @returns Boolean
     * /
    update(changedProperties){
	    super.update(changedProperties)
    }*/
	
	
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
	    return html`<li><a class="dropdown-item" @click=${this.onclick}> ${ unsafeHTML(this.content) }</a></li>`
    }

    
    /**
     * Called after the component's DOM has been updated the first time, 
     * immediately before updated() is called.
     * 
     * Updates?	Yes. Property changes inside this method schedule a new update cycle.
     * Call super?	Not necessary.
     * 
     * @param {Map} changedProperties keys are the names of changed properties and values that are the corresponding previous values.
     * /
    firstUpdated(changedProperties) {
    }*/

    /**
     * Called whenever the component’s update finishes and the element's DOM has been 
     * updated and rendered.
     *
     * Updates?    Yes. Property changes inside this method trigger an element update.
     * Call super? Not necessary.
     * 
     * @param {Map} changedProperties keys are the names of changed properties and values that are the corresponding previous values.
     * @returns 
     * /
    updated(changedProperties){
        
    }*/

    onclick(event){
        if(this['click-event']){
            this.dispatchEvent(new CustomEvent(this['click-event'], {
                detail: this,
                bubbles: true,
            }))
        }else if(this.hasAttribute("href")){
            document.location.href = this.getAttribute("href")
        }else{
            this.dispatchEvent(new CustomEvent('drop-down-click', {
                detail: this,
                bubbles: true,
            }))
        }
    }

	
}

// Register component
customElements.define('app-dropdown-item', DropdownItemElement);