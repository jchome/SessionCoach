import GenericEditElement from '../edit-generic.js';
import { html } from 'lit';


export default class ModuleEditElement extends GenericEditElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "module"
    }

    /** Override if needed
    urlOfSave(id){
        return `/api/v2/modules/${id}`
    }*/


}

window.customElements.define('app-module-edit', ModuleEditElement);