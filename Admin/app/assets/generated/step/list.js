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
    }

    /** Override if needed
    urlOfList(){
        var sortQuery = ""
        if(this.orderBy != undefined){
            sortQuery = `&sort_by=${this.orderBy}&order=${this.asc?'asc':'desc'}`
        }
        return `/api/v2/steps/?page=${this.currentPage}${sortQuery}`
    }*/

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


}

window.customElements.define('app-step-list', StepListElement);