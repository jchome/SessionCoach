import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

import { Tooltip } from 'bootstrap'


export default class PanelFloatingElement extends LitElement {
    static properties = {
        'title': {type: String},
        'minimized': {type: Boolean},
        'movable': {type: Boolean},
    }
    static get styles() { };

    constructor() {
        super();
        this.childrenHTML = undefined
        this.tooltip = undefined
        
        // Drag-n-drop feature
        /*
        this.addEventListener('dragstart', (event)=> {
            event.dataTransfer.setData("text", event.target.id);
            event.dataTransfer.setDragImage(event.target, window.outerWidth, window.outerHeight); // hide shadow image of the element
            this.classList.add("dragging")
            event.target.classList.add('dragging');
        })
        this.addEventListener('dragend', (event)=> {
            this.classList.remove("dragging")
        })
        this.addEventListener('drag', (event)=> {
            const viewportOffset = this.parentElement.getBoundingClientRect()
            var x = event.pageX - viewportOffset.left - 16
            var y = event.pageY - viewportOffset.top - 16
            if(x < 0){x=0} if(x > viewportOffset.width){x=viewportOffset.width} 
            if(y < 0){y=0} if(y > viewportOffset.height){y=viewportOffset.height} 
            this.moveTo(x, y)
        })
        this.addEventListener('dragover', (event)=> {
            event.preventDefault()
        })*/
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
        if(this.childrenHTML){
            return
        }
        this.childrenHTML = unsafeHTML(this.innerHTML)
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
        var titleHtml = ""

        if(this.movable){
            if(this.minimized){
                titleHtml = html`<span class="move"><i class="bi bi-grip-vertical"></i></span>`
            }else{
                titleHtml = html`<div class="panel-title">
                    <span class="move"></span>
                    ${ this.title }
                    ${ this.getMenuHtml() }
                </div>`
            }
        }else{
            // ! this.movable
            if(this.minimized){
                titleHtml = html`` // No title at all
            }else{
                // ! this.movable && ! this.minimized
                titleHtml = html`<div class="panel-title">
                ${ this.title }
                ${ this.getMenuHtml() }
            </div>`
            }
        }

	    return html`
            ${ titleHtml }
            <div class="panel-content">
                ${ this.childrenHTML }
            </div>
        </div>`
    }

    firstUpdated(){
        if(this.movable){
            
            this.ondragstart = function() {
                // Disable the default "drag" feature, to use a custom dragging (to change visibility of items)
                return false;
            };
            const that = this
            function _move(event){
                that.moveToEvent(event)
            }
            
            const dragger = this.querySelector(".move")
            dragger.onmousedown = function(event) {
                event.preventDefault()
                that.classList.add('dragging')
                that.getOrCreateTooltip().classList.add("show")

                that.moveToEvent(event)
                document.addEventListener('mousemove', _move )
                dragger.onmouseup = function(event) {
                    document.removeEventListener('mousemove', _move)
                    dragger.onmouseup = null
                    this.onmouseup
                    that.drop(event)
                };
                that.onmouseup = dragger.onmouseup
            }
        }
    }

    getOrCreateTooltip(){
        if(!this.tooltip){
            this.tooltip = document.querySelector("#" + this.id + "_tooltip")
        }
        if(!this.tooltip){
            this.tooltip = document.createElement("div")
            this.tooltip.classList.add("tooltip")
            
            this.tooltip.setAttribute("id", this.id + "_tooltip")
            document.body.appendChild(this.tooltip);
        }
        this.tooltip.innerHTML = "Drag to anchor"
        return this.tooltip
    }

    getMenuHtml(){
        return html`<div class="dropdown">
            <a class="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-list" ></i></a>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click=${this.onUpdateAnchor} data-anchor="top-left">Anchor to left</a></li>
                <li><a class="dropdown-item" href="#" @click=${this.onUpdateAnchor} data-anchor="top-right">Anchor to right</a></li>
            </ul>
        </div>`
    }

    onUpdateAnchor(event){
        // This line will update the CSS.
        this.setAnchor( event.target.getAttribute("data-anchor") )
    }

    setAnchor(anchorName){
        this.setAttribute("anchor", anchorName)
        this.style.top = "";
        this.style.left = "";
    }

    getEventPosition(event){
        const viewportOffset = this.parentElement.getBoundingClientRect()
        var x = event.pageX - viewportOffset.left - 24
        var y = event.pageY - viewportOffset.top - 24
        if(x < 0){x=0} if(x > viewportOffset.width){x=viewportOffset.width} 
        if(y < 0){y=0} if(y > viewportOffset.height){y=viewportOffset.height}
        return {x: x, y: y}
    }

    moveToEvent(event){
        const position = this.getEventPosition(event)
        this.moveTo(position.x, position.y)
        
        const anchor = this.detectAnchor(position.x, position.y)
        if(anchor != ""){
            this.tooltip.innerHTML = "Anchor to " + anchor
        }else{
            this.tooltip.innerHTML = "Drop here"
        }
        this.moveTooltip()
    }

    moveTooltip(){
        const boundingBox = this.getBoundingClientRect()
        const tooltipBoundingBox = this.tooltip.getBoundingClientRect()
        var x = boundingBox.left + boundingBox.width/2 - tooltipBoundingBox.width/2
        var y = boundingBox.top - tooltipBoundingBox.height - 2
        this.tooltip.style.top = y + "px";
        this.tooltip.style.left = x + "px";
    }

    detectAnchor(x, y){
        const viewportOffset = this.parentElement.getBoundingClientRect()
        const eltOffset = this.getBoundingClientRect()
        var xAnchor = "free"
        if(viewportOffset.width - x - eltOffset.width < 100){
            xAnchor = "right"
        }else if(x < 100){
            xAnchor = "left"
        }else if (x + eltOffset.width/2 > (viewportOffset.width / 2 - 100) && x + eltOffset.width/2 < (viewportOffset.width / 2 + 100)){
            xAnchor = "center"
        }
        var yAnchor = "free"
        if(viewportOffset.height - y - eltOffset.height < 100){
            yAnchor = "bottom"
        }else if(y < 100){
            yAnchor = "top"
        }else if (y + eltOffset.height/2 > (viewportOffset.height / 2 - 100) && y + eltOffset.height/2 < (viewportOffset.height / 2 + 100)){
            yAnchor = "center"
        }

        if(xAnchor == "free" || yAnchor == "free" || (xAnchor =="center" && yAnchor == "center")){
            return ""
        }else{
            return yAnchor + "-" + xAnchor
        }
    }

    moveTo(x, y){
        this.removeAttribute("anchor")
        this.style.top = y + "px";
        this.style.left = x + "px";
    }

    drop(event){
        const position = this.getEventPosition(event)
        const anchor = this.detectAnchor(position.x, position.y)
        
        if(anchor == ""){
            this.moveTo(position.x, position.y)
        }else{
            this.setAnchor(anchor)
        }
        this.classList.remove('dragging');
        this.tooltip.classList.remove("show")
    }


}

// Register component
customElements.define('app-panel-floating', PanelFloatingElement);