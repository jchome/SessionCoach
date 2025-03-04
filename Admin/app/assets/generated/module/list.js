import GenericListElement from '../list-generic.js'
import { html } from 'lit';

import ModuleEditElement from './edit.js'
import ModuleCreateElement from './create.js'


export default class ModuleListElement extends GenericListElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "module"
    }

    /** Override if needed
    urlOfList(){
        var sortQuery = ""
        if(this.orderBy != undefined){
            sortQuery = `&sort_by=${this.orderBy}&order=${this.asc?'asc':'desc'}`
        }
        return `/api/v2/modules/?page=${this.currentPage}${sortQuery}`
    }*/

    getEditorHtml(){
        return html`<app-module-edit id="editor" 
                .metadata=${ this.metadata }
                .user="${ this.user }">
            </app-module-edit>`
    }

    getCreatorHtml(){
        return html`<app-module-create id="creator"
                .metadata=${ this.metadata }
                .user="${ this.user }">
            </app-module-create>`
    }


}

window.customElements.define('app-module-list', ModuleListElement);