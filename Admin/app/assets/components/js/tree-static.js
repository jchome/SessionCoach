import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'


export default class StaticTreeElement extends LitElement {
    static properties = {
        root: {type: Object},
    }
    static get styles() { };

    constructor() {
        super();

        this.root = {
            id: 0,
            label: "Giant planets",
            children: [
                {
                    id: 1,
                    label: "Gas giants",
                    children: [
                        {
                            id: 11,
                            label: "Jupiter",
                        }, {
                            id: 12,
                            label: "Saturn",
                        }
                    ]
                },
                {
                    id: 2,
                    label: "Ice giants",
                    children: [
                        {
                            id: 21,
                            label: "Uranus",
                        }, {
                            id: 22,
                            label: "Neptune",
                            link: "#",
                        }
                    ]
                },
                {
                    id: 3,
                    label: "Others",
                    children: [
                        {
                            id: 31,
                            label: "Mercure",
                            prefixHtml: '<i class="bi bi-bank"></i> '
                        }, {
                            id: 32,
                            label: "Venus",
                            cssClass: "bg-primary"
                        }, {
                            id: 33,
                            label: "Earth",
                            innerCssClass: "bg-primary"
                        }, {
                            id: 34,
                            label: "Mars",
                        }
                    ]
                }
            ]
        }
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
     * /
    willUpdate(changedProperties){
    }*/
    
	
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
	    return html`
        <ul class="tree">
            ${ this.getNodeHtml(this.root) }
        </ul>`
    }


    getNodeHtml(node){
        var textHtml = html`${ node.label }`
        if(node.link){
            textHtml = html`<a href="${ node.link }">${ node.label }</a>`
        }
        var prefixHTml = html``
        if(node.prefixHtml){
            prefixHTml = unsafeHTML(node.prefixHtml)
        }
        var cssClass = ""
        if(node.cssClass){
            cssClass = node.cssClass
        }
        var innerCssClass = "tree-item"
        if(node.innerCssClass){
            innerCssClass += " " + node.innerCssClass
        }
        if(node.children != undefined && node.children.length > 0){
            const allChildrenHtml = []
            for(let child of node.children){
                allChildrenHtml.push( this.getNodeHtml(child) )
            }
            return html`<li class=${ cssClass }>
                <span @click=${this.onItemClick} class="${innerCssClass}" data-id="${node.id}">${prefixHTml}${ textHtml }</span>
                    <ul>
                        ${ allChildrenHtml }
                    </ul>
                </span>
            </li>`
        }else{
            return html`<li class=${ cssClass }>
                <span class="${innerCssClass}" @click=${this.onItemClick} data-id="${node.id}">${prefixHTml}${ textHtml }</span>
            </li>`
        }
    }

    /**
     * Find the first node having the condition "node.id == needle"
     * 
     * @param {String | Number} needle The id to search
     * @param {Dictionary} node Optional root node to search in
     * @returns a node | null
     */
    findNodeById(needle, node){
        if(node == null || node == undefined){
            node = this.root
        }
        if(node.id == needle){
            return node
        }
        if(node.children != undefined && node.children.length > 0){
            for(let child of node.children){
                var result = this.findNodeById(needle, child)
                if(result != null){
                    return result
                }
            }
        }
        return null
    }

    onItemClick(event){
        const node = this.findNodeById( event.target.getAttribute("data-id") )
        this.dispatchEvent(new CustomEvent('treeNodeClicked', {
            detail: {node},
            bubbles: true
        }))
    }
	
}

// Register component
customElements.define('app-tree-static', StaticTreeElement);
