import GenericCreateElement from '../create-generic.js';
import { html } from 'lit';


export default class AccessCreateElement extends GenericCreateElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "access"
    }

    /** Override if needed
    urlOfSave(){
        return `/api/v1/accesss/`
    }*/


}

window.customElements.define('app-access-create', AccessCreateElement);