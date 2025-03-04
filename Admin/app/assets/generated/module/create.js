import GenericCreateElement from '../create-generic.js';
import { html } from 'lit';


export default class ModuleCreateElement extends GenericCreateElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "module"
    }

    /** Override if needed
    urlOfSave(){
        return `/api/v1/modules/`
    }*/


}

window.customElements.define('app-module-create', ModuleCreateElement);