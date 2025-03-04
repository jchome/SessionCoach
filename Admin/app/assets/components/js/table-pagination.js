import { LitElement, html } from 'lit'
import { translate } from 'lit-translate'

export default class TablePaginationElement extends LitElement {
    static properties = {
        pager: {type: Object},
    }
    static get styles() { }

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
        if( this.pager.hasMore){
            // Add 'see more pages'
            // TODO
        }
        if(this.pager.currentPage > 1){
            // add 'less'
            // TODO
        }
        if(this.pager.total <= this.pager.perPage){
            return html``
        }
        const pageButtons = []
        for(let i=1;i<=this.pager.pageCount;i++){
            pageButtons.push(html`<li class="page-item ${(i==this.pager.currentPage)?'active':''}">
                <button class="page-link" @click=${this.onPageBtnClicked} data-page="${i}">${i}</button>
            </li>`)
        }
        return html`
            <nav aria-label="Pagination">
                <ul class="pagination">
                    ${pageButtons}
                </ul>
            </nav>
        `    
    }

    onPageBtnClicked(event){
        this.dispatchEvent(new CustomEvent('onPageChange', {
            detail: event.target.getAttribute('data-page'),
            bubbles: true,
        }))
    }

	
}

// Register component
customElements.define('app-table-pagination', TablePaginationElement);