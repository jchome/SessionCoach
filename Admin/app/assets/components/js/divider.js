import { LitElement, html } from 'lit'


export default class DividerElement extends LitElement {
    static properties = {
        disposition: {type: String},
    }
    static get styles() { };

    constructor() {
        super();

        this.previousPos = undefined
        this.prevSizeOfPrevSibling = undefined
        this.prevSizeOfNextSibling = undefined
        // Prepare drag event of this element
        window.addEventListener('mousedown', (e) => {
            if(e.target != this && e.target.parentNode != this){
                this.active = false
                return
            }
            this.active = e.buttons == 1;
            if(this.disposition == 'horizontal'){
                this.previousPos = e.clientX
                this.prevSizeOfPrevSibling = this.previousElementSibling.getBoundingClientRect().width
                this.prevSizeOfNextSibling = this.nextElementSibling.getBoundingClientRect().width
            }else{
                this.previousPos = e.clientY
                this.prevSizeOfPrevSibling = this.previousElementSibling.getBoundingClientRect().height
                this.prevSizeOfNextSibling = this.nextElementSibling.getBoundingClientRect().height
            }
            // Don't bubble up this event
            e.stopPropagation()
            e.preventDefault()
        })
        window.addEventListener('mousemove', (e) => {
            if(this.active){
                this.updatePosition(e);
            }
        })
        window.addEventListener('mouseup', (e) => {
            if(this.active){
                this.dispatchEvent(new CustomEvent('dividerEndedMove', {
                    detail:{
                        divider: this,
                    },
                    bubbles: true
                }))
                this.active = false;
            }
        })
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
	    return html``
    }


    /**
     * Called when the user moves the Divider.
     * 
     * @param {MouseEvent} event 
     */
    updatePosition(event){
        if( this.previousElementSibling.style.flex != 'none'){
             this.previousElementSibling.style.flex = 'none'
        }

        var delta = event.clientY - this.previousPos
        if(this.disposition == 'horizontal'){
            delta = event.clientX - this.previousPos
        }

        // Raise the event to the parent container, and update panels around the Divider
        this.dispatchEvent(new CustomEvent('dividerMoved', {
            detail:{
                delta: delta,
                divider: this,
            },
            bubbles: true
        }))
    }
	
}


// Register component
customElements.define('app-divider', DividerElement);