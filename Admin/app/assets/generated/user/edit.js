import GenericEditElement from '../edit-generic.js';
import { html } from 'lit';


export default class UserEditElement extends GenericEditElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "user"
    }

    /** Override if needed
    urlOfSave(id){
        return `/api/v2/users/${id}`
    }*/


}

window.customElements.define('app-user-edit', UserEditElement);