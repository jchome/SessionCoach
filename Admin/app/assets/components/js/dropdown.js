import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'


export default class DropdownButtonElement extends LitElement {
    static properties = {
        label: {type: String},
        'icon-class': {type: String},
        'img-src': {type: String},
        'direction': {type: String}, // start | end | top | center | bottom-left | bottom-right
        'show': {type: String}, // String separated by "," with "icon", "label"
    }
    static get styles() { };

    constructor() {
        super();
        this.show = "icon" // default: show the icon only
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
        //console.log(unsafeHTML(this.content))
	    return html`
            <div class="dropdown ${ this.getDropDirection() }">
                <button class="btn btn-sm" type="button" aria-haspopup="true" 
                    data-bs-toggle="dropdown" aria-expanded="false">
                    ${ this.getLogo() }
                </button>
                <ul class="dropdown-menu">
                    ${ unsafeHTML(this.content) }
                </ul>
            </div>`
    }


    getLogo(){
        const parts = []
        const codes = this.show.split(',').map((i, n) => {return [n, i.trim()]})
        for(const [index, partName] of codes ){
            let marginClass = ""
            if(index - 1 < codes.length){
                marginClass = "me-1"
            }
            if(partName == 'icon'){
                if(this['icon-class']){
                    parts.push( html`<i class="${this['icon-class']} ${marginClass}"></i>` )
                }
                if(this['img-src']){
                    parts.push( html`<img src="${this['img-src']}" class="img-fluid ${marginClass}">` )
                }
            }else if(partName == 'label'){
                parts.push( html`<span class="${marginClass}">${ this.label }</span>` )
            }else {
                console.warn(`The 'show' property should be a string composed of 'label' and 'icon'. The text '${partName.trim()}' will be ignored.`)
            }
        }
        return parts
    }
    
    getDropDirection(){
        // start | end | up | up-left | up-center | up-right | 
        // bottom | bottom-center | bottom-right
        if(this.direction == 'start'){          return `dropstart` }
        if(this.direction == 'end'){            return `dropend`   }
        if(this.direction == 'up'){             return `dropup`}
        if(this.direction == 'up-left'){        return `dropup`    }
        if(this.direction == 'up-center'){      return `dropdown-center dropup`}
        if(this.direction == 'up-right'){       return `dropup drop-align-right`}
        if(this.direction == 'bottom-left'){    return `drop-align-right`}
        if(this.direction == 'bottom-center'){  return `dropdown-center`}
        if(this.direction == 'bottom-right'){   return ``}
        // Default: no class
        return ``
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

	
}

// Register component
customElements.define('app-dropdown', DropdownButtonElement);