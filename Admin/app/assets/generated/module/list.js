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

        this.actions.push( {
                code: 'manage', 
                cssClass: 'btn btn-sm btn-primary mx-2 action-manage'
            }
        )
        this.addEventListener('manage', this.onManage)

        const urlParams = new URLSearchParams(window.location.search)
        this.session_id = urlParams.get("session_id")
        this.sessionName = undefined
    }

    urlOfList(){
        if(this.session_id){
            return `/api/v1/${this.objectName}s/?limit=999&sort_by=order&search_on=session_id&search_value=${this.session_id}`
        }else{
            return super.urlOfList()
        }
    }

    loadModel(){
        return new Promise((resolve, reject) => {
            super.loadModel().then((_) => {
                if(this.session_id){
                    // Remove the column session_id
                    const indexOfFK = this.columns.findIndex( col => col.key == "session_id")
                    const sessionObject = this.columns.splice(indexOfFK, 1)
                    this.loadForeignData(-99, sessionObject[0], this.session_id).then((sessionData) => {
                        this.sessionName = sessionData.label
                    })
                }
                resolve()
            })
        })
    }

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
    
    getTopRightHtml(){
        return html`<button class="btn btn-sm btn-secondary btn-back" @click=${this.backToSessions}>Retour</button>`
    }

    getSubHeaderHtml(){
        return html`Séance <i>${this.sessionName}</i>`
    }

    backToSessions(event){
        document.location.href = window.BASE_HREF + '/pages/session.html'
    }

    onManage(event){
        document.location.href = window.BASE_HREF + '/pages/step.html?module_id='+event.detail.item.id +
            '&session_id=' + this.session_id
    }

}

window.customElements.define('app-module-list', ModuleListElement);