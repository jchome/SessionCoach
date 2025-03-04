import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { translate } from 'lit-translate'


export default class TableElement extends LitElement {
    static properties = {
        items: { type: Array },
        columns: { type: Array },
        actions: { type: Array }, // Array of {code: 'run', label: 'Run !', cssClass: 'btn btn-sm btn-primary'}
        'sort-column': {type: String},
        'sort-order': {type: Boolean},
        'label-suffix': {type: String},
    }
    static get styles() { }

    constructor() {
        super();
        this.items = [] // [{a: 1, b: 2, c: "test"}, {a: 10, b: 20, c: "test-2"}]
        this.columns = [] // ["a", "b", "c"]
        this.actions = [] // [{code: 'run', label: 'Run !', cssClass: 'btn btn-sm btn-primary'}];
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
        var actionsHeader = html``
        var actionsBody = html``
        //console.log()
        if(this.actions && this.actions.length > 0){
            actionsHeader = html`<th>Actions</th>`
            actionsBody = html`<td>${ this.actions.map(action => html`<button 
                class="${action.cssClass}" @click=${this.onAction} data-action="${action.code}"
                >${translate( "action."+action.code) }</button>`) }</td>`
        }
        const tabeHeaders = this.columns.map((column, index) => {
            var orderClass = ""
            if(this['sort-column'] == column.key){
                orderClass = this['sort-order'] ? 'order-asc' : 'order-desc'
            }
            return html`<th 
                class="table-cell-header ${orderClass}"
                @click=${this.onColumnHeaderClicked} 
                data-index="${index}">${ column.label }</th>`
            })

	    return html`
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        ${ tabeHeaders }
                        ${ actionsHeader }
                    </tr>
                </thead>
                <tbody>
                    ${this.items.map((item, index) => html`
                    <tr data-index="${index}">
                        ${this.columns.map(column => {
                            if(item[column.key+this['label-suffix']]){
                                return html`<td>${item[column.key+this['label-suffix']]}</td>`
                            }else{
                                return html`<td>${item[column.key]}</td>`
                            }
                        })}
                        ${ actionsBody }
                    </tr>
                    `)}
                </tbody>
            </table>`
            
    }

    /**
     * Raised when the button a clicked in a button of the "actions" column
     * Dispatch an event with detail = { item: Object, index: number }
     * 
     * @param {Event} event 
     */
    onAction(event){
        const eventCode = event.target.getAttribute("data-action")
        const index = event.target.closest('TR').getAttribute("data-index")
        this.dispatchEvent(new CustomEvent(eventCode, {
            detail: {
                item: this.items[index],
                index,
            },
            bubbles: true
        }))
    }

    /**
     * Raised when a column header cell is clicked
     * Dispatch an event with detail = { column: String, index: number }
     * 
     * @param {Event} event 
     */
    onColumnHeaderClicked(event){
        const index = event.target.getAttribute("data-index")
        this.dispatchEvent(new CustomEvent('columnClicked', {
            detail: {
                column: this.columns[index],
                index,
            },
            bubbles: true
        }))
        
    }

	
}

// Register component
customElements.define('app-table', TableElement);
