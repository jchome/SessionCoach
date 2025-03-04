import GenericListElement from '../list-generic.js'
import { html } from 'lit';

import UserEditElement from './edit.js'
import UserCreateElement from './create.js'


export default class UserListElement extends GenericListElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "user"
    }

    /** Override if needed
    urlOfList(){
        var sortQuery = ""
        if(this.orderBy != undefined){
            sortQuery = `&sort_by=${this.orderBy}&order=${this.asc?'asc':'desc'}`
        }
        return `/api/v2/users/?page=${this.currentPage}${sortQuery}`
    }*/

    getEditorHtml(){
        return html`<app-user-edit id="editor" 
                .metadata=${ this.metadata }
                .user="${ this.user }">
            </app-user-edit>`
    }

    getCreatorHtml(){
        return html`<app-user-create id="creator"
                .metadata=${ this.metadata }
                .user="${ this.user }">
            </app-user-create>`
    }


}

window.customElements.define('app-user-list', UserListElement);