import GenericEditElement from '../edit-generic.js';
import { html } from 'lit';


export default class StepEditElement extends GenericEditElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "step"
    }

    /** Override if needed
    urlOfSave(id){
        return `/api/v2/steps/${id}`
    }*/


}

window.customElements.define('app-step-edit', StepEditElement);