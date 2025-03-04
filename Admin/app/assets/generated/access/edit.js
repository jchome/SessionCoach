import GenericEditElement from '../edit-generic.js';
import { html } from 'lit';


export default class AccessEditElement extends GenericEditElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "access"
    }

    /** Override if needed
    urlOfSave(id){
        return `/api/v2/accesss/${id}`
    }*/


}

window.customElements.define('app-access-edit', AccessEditElement);