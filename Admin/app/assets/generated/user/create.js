import GenericCreateElement from '../create-generic.js';
import { html } from 'lit';


export default class UserCreateElement extends GenericCreateElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "user"
    }

    /** Override if needed
    urlOfSave(){
        return `/api/v1/users/`
    }*/


}

window.customElements.define('app-user-create', UserCreateElement);