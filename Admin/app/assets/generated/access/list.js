import GenericListElement from '../list-generic.js'
import { html } from 'lit';

import AccessEditElement from './edit.js'
import AccessCreateElement from './create.js'


export default class AccessListElement extends GenericListElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "access"
    }

    /** Override if needed
    urlOfList(){
        var sortQuery = ""
        if(this.orderBy != undefined){
            sortQuery = `&sort_by=${this.orderBy}&order=${this.asc?'asc':'desc'}`
        }
        return `/api/v2/accesss/?page=${this.currentPage}${sortQuery}`
    }*/

    getEditorHtml(){
        return html`<app-access-edit id="editor" 
                .metadata=${ this.metadata }
                .user="${ this.user }">
            </app-access-edit>`
    }

    getCreatorHtml(){
        return html`<app-access-create id="creator"
                .metadata=${ this.metadata }
                .user="${ this.user }">
            </app-access-create>`
    }


}

window.customElements.define('app-access-list', AccessListElement);