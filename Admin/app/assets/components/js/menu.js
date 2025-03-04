import { LitElement, html } from 'lit'


export default class MenuElement extends LitElement {
    static properties = { }
    static get styles() { };

    constructor() {
        super();
        this.addEventListener('menuClicked', this.menuClicked)
        document.addEventListener('resized', (event) => { 
            for(let parentItem of event.detail){
                if(parentItem.id && this.closest('#' + parentItem.id)){
                    this.onResized(parentItem)
                }
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
	
    render() {
        return html``
    }

    menuClicked(event){
        event.detail.item.setActive(true)
    }

    updated(){
        this.onResized(this.parentNode)
    }

    onResized(parentItem){
        if(parentItem.getBoundingClientRect().width > 200){
            this.setAttribute("data-width", "large")
        }else if(parentItem.getBoundingClientRect().width > 100){
            this.setAttribute("data-width", "medium")
        }else if(parentItem.getBoundingClientRect().width > 50){
            this.setAttribute("data-width", "small")
        }else if(parentItem.getBoundingClientRect().width > 10){
            this.setAttribute("data-width", "extra-small")
        }else{
            this.setAttribute("data-width", "collapsed")
        }
    }
	
}

// Register component
customElements.define('app-menu', MenuElement);