import { LitElement, html } from 'lit'


export default class ContainerElement extends LitElement {
    static properties = {
        disposition: {type: String}, // stack | horizontal | vertical
        ratio: {type: String},
    }
    static get styles() { };

    constructor() {
        super();
        this.childrenHTML = []

        this.addEventListener('dividerMoved', this.onDividerMoved )
        this.addEventListener('dividerEndedMove', this.onDividerEndedMove )
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
        if(this.ratio == undefined){
            return
        }
        this.ratioArray = this.ratio.split(',')
        
        // Add a divider between 2 children + update the size
        for(let index = this.children.length-1; index > 0; index--){
            let item = this.children[index]
            item.setAttribute("data-index", index)
            // If the previous item is a fixed sized, don't put a divider
            let previousItem = item.previousElementSibling
            var addDivider = true
            if( this.disposition == 'vertical'){
                if(previousItem.style['min-height'] && previousItem.style['max-height'] ){
                    addDivider = false
                }
            }
            if( this.disposition == 'horizontal'){
                if(previousItem.style['min-width'] && previousItem.style['max-width'] ){
                    addDivider = false
                }
            }

            if(addDivider){
                const dividerNode = document.createElement("app-divider")
                dividerNode.setAttribute("disposition", this.disposition)
                this.insertBefore(dividerNode, item)
            }

            // Default size before moving the divider
            if(this.ratioArray[index]){
                var dimension = 'height'
                if(this.disposition == 'horizontal'){
                    dimension = 'width'
                }
                var value = this.ratioArray[index]
                if(index > 0){
                    value = "calc("+value+" - 30px)"
                }
                item.style[dimension] = value
            }
            
        }
        // Add this on the first child
        this.children[0].setAttribute("data-index", 0)
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
        return html``
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


    onDividerMoved(event){
        var mySize = this.getBoundingClientRect().width
        if( this.disposition == 'vertical'){
            mySize = this.getBoundingClientRect().height
        }

        const divider = event.detail.divider
        var delta = event.detail.delta
        const previousElt = divider.previousElementSibling
        const previousIndex = parseInt( previousElt.getAttribute("data-index") )
        
        // Previous element
        var valueForPreviousItem = this.ratioArray[previousIndex]
        if(isNaN(valueForPreviousItem) && valueForPreviousItem.endsWith("%")){
            if(this.disposition == 'horizontal'){
                valueForPreviousItem = previousElt.getBoundingClientRect().width + delta
            }else{
                valueForPreviousItem = previousElt.getBoundingClientRect().height + delta
            }
            this.ratioArray[previousIndex] = valueForPreviousItem
        }else{
            valueForPreviousItem += delta
        }
        
        if(this.disposition == 'horizontal' && previousElt.style['min-width']){
            const minWidth = parseFloat(previousElt.style['min-width'].substring(0, previousElt.style['min-width'].length -2))
            if(minWidth > valueForPreviousItem){
                delta = minWidth - this.ratioArray[previousIndex]
                valueForPreviousItem = minWidth
            }
        }else if(this.disposition == 'vertical' && previousElt.style['min-height']){
            const minHeight = parseFloat(previousElt.style['min-height'].substring(0, previousElt.style['min-height'].length -2))
            if(minHeight > valueForPreviousItem){
                delta = minHeight - this.ratioArray[previousIndex]
                valueForPreviousItem = minHeight
            }
        }

        if( this.disposition == 'horizontal'){
            previousElt.style.width = valueForPreviousItem + "px"
        }else{
            previousElt.style.height = valueForPreviousItem + "px"
        }

        // Next element
        const nextElt = divider.nextElementSibling
        var valueForNextItem = this.ratioArray[previousIndex+1]
        if(isNaN(valueForNextItem) && valueForNextItem.endsWith("%")){
            if(this.disposition == 'horizontal'){
                valueForNextItem = nextElt.getBoundingClientRect().width + delta
            }else{
                valueForNextItem = nextElt.getBoundingClientRect().height + delta
            }
            this.ratioArray[previousIndex+1] = valueForNextItem
        }else{
            valueForNextItem -= delta
        }
        
        if(this.disposition == 'horizontal' && nextElt.style['min-width']){
            const minWidth = parseFloat(nextElt.style['min-width'].substring(0, nextElt.style['min-width'].length -2))
            if(minWidth > valueForNextItem){
                valueForNextItem = minWidth
            }
        }else if(this.disposition == 'vertical' && nextElt.style['min-height']){
            const minHeight = parseFloat(nextElt.style['min-height'].substring(0, nextElt.style['min-height'].length -2))
            if(minHeight > valueForNextItem){
                valueForNextItem = minHeight
            }
        }
        valueForNextItem -= 4
        
        if( this.disposition == 'horizontal'){
            nextElt.style.width = valueForNextItem + "px"
        }else{
            nextElt.style.height = valueForNextItem + "px"
        }
        // Catch this event with " document.addEventListener('resized', (event) => { }) "
        document.dispatchEvent(new CustomEvent('resized', {
            detail: [previousElt, nextElt],
            bubbles: true
        }))
        
    }

    onDividerEndedMove(event){
        const divider = event.detail.divider
        const previousElt = divider.previousElementSibling
        const nextElt = divider.nextElementSibling
        const previousIndex = parseInt( previousElt.getAttribute("data-index") )

        if( this.disposition == 'horizontal'){
            this.ratioArray[previousIndex] = previousElt.getBoundingClientRect().width - 26
            this.ratioArray[previousIndex+1] = nextElt.getBoundingClientRect().width + 26 + 4
        }else{
            this.ratioArray[previousIndex] = previousElt.getBoundingClientRect().height - 26
            this.ratioArray[previousIndex+1] = nextElt.getBoundingClientRect().height + 26 + 4
        }

    }
	
}

// Register component
customElements.define('app-container', ContainerElement);