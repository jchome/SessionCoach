import GenericCreateElement from '../create-generic.js';
import { html } from 'lit';


export default class StepCreateElement extends GenericCreateElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "step"
    }

    /** Override if needed
    urlOfSave(){
        return `/api/v1/steps/`
    }*/


}

window.customElements.define('app-step-create', StepCreateElement);