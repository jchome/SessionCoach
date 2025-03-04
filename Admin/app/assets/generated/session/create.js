import GenericCreateElement from '../create-generic.js';
import { html } from 'lit';


export default class SessionCreateElement extends GenericCreateElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "session"
    }

    /** Override if needed
    urlOfSave(){
        return `/api/v1/sessions/`
    }*/


}

window.customElements.define('app-session-create', SessionCreateElement);