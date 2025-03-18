import GenericListElement from '../list-generic.js'
import { html } from 'lit';

import StepEditElement from './edit.js'
import StepCreateElement from './create.js'


export default class StepListElement extends GenericListElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "step"

        const urlParams = new URLSearchParams(window.location.search)
        this.module_id = urlParams.get("module_id")
        this.session_id = urlParams.get("session_id")
    }

    urlOfList(){
        if(this.module_id){
            return `/api/v1/${this.objectName}s/?limit=999&sort_by=order&search_on=module_id&search_value=${this.module_id}`
        }else{
            return super.urlOfList()
        }
    }

    getEditorHtml(){
        return html`<app-step-edit id="editor" 
                .metadata=${ this.metadata }
                .user="${ this.user }">
            </app-step-edit>`
    }

    getCreatorHtml(){
        return html`<app-step-create id="creator"
                .metadata=${ this.metadata }
                .user="${ this.user }">
            </app-step-create>`
    }

    getTopRightHtml(){
        return html`<button class="btn btn-sm btn-primary" @click=${this.backToModule}>Retour</button>`
    }

    backToModule(event){
        document.location.href = window.BASE_HREF + '/pages/module.html?session_id='+this.session_id
    }


}

window.customElements.define('app-step-list', StepListElement);