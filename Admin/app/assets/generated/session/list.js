import GenericListElement from '../list-generic.js'
import { html } from 'lit';

import SessionEditElement from './edit.js'
import SessionCreateElement from './create.js'


export default class SessionListElement extends GenericListElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "session"
    }

    /** Override if needed
    urlOfList(){
        var sortQuery = ""
        if(this.orderBy != undefined){
            sortQuery = `&sort_by=${this.orderBy}&order=${this.asc?'asc':'desc'}`
        }
        return `/api/v2/sessions/?page=${this.currentPage}${sortQuery}`
    }*/

    getEditorHtml(){
        return html`<app-session-edit id="editor" 
                .metadata=${ this.metadata }
                .user="${ this.user }">
            </app-session-edit>`
    }

    getCreatorHtml(){
        return html`<app-session-create id="creator"
                .metadata=${ this.metadata }
                .user="${ this.user }">
            </app-session-create>`
    }


}

window.customElements.define('app-session-list', SessionListElement);