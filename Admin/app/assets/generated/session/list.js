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
        this.actions.push( {
                code: 'manage', 
                cssClass: 'btn btn-sm btn-primary mx-2 action-manage'
            }
        )
        this.addEventListener('manage', this.onManage)
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

    onManage(event){
        document.location.href = window.BASE_HREF + '/pages/module.html?session_id='+event.detail.item.id
    }


}

window.customElements.define('app-session-list', SessionListElement);