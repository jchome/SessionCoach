import GenericCreateElement from '../create-generic.js';
import { html } from 'lit';


export default class ModuleCreateElement extends GenericCreateElement {
    static properties = { }
    static get styles() { }

    constructor() {
        super()
        this.objectName = "module"

        const urlParams = new URLSearchParams(window.location.search)
        this.session_id = urlParams.get("session_id")
    }

    /** Override if needed
    urlOfSave(){
        return `/api/v1/modules/`
    }*/
   
    getField(field){
        if(this.session_id && field.key == "session_id"){
            return super.getFieldAsHidden(field, this.session_id)
        }else{
            return super.getField(field)
        }
    }


}

window.customElements.define('app-module-create', ModuleCreateElement);