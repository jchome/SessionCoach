import GenericEditElement from '../edit-generic.js';
import { html } from 'lit';


export default class SessionEditElement extends GenericEditElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "session"
    }

    /** Override if needed
    urlOfSave(id){
        return `/api/v2/sessions/${id}`
    }*/


}

window.customElements.define('app-session-edit', SessionEditElement);