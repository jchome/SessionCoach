import GenericCreateElement from '../create-generic.js';
import { html } from 'lit';


export default class StepCreateElement extends GenericCreateElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "step"

        const urlParams = new URLSearchParams(window.location.search)
        this.module_id = urlParams.get("module_id")
    }

    /** Override if needed
    urlOfSave(){
        return `/api/v1/steps/`
    }*/
    getField(field){
        if(this.module_id && field.key == "module_id"){
            return super.getFieldAsHidden(field, this.module_id)
        }else{
            return super.getField(field)
        }
    }


}

window.customElements.define('app-step-create', StepCreateElement);