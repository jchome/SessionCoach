import {LitElement, html} from 'lit'

import ModuleDetailElement from './module-detail.js';

export default class SessionDetailElement extends LitElement {
    static properties = { 
        session: {type: Object},
    };
    static get styles() { };

    constructor() {
        super();

        this.addEventListener('gotoNextModule', this.gotoNextModule)
    }
    
    /**
     * Don't use the shadow-root node. The "styles" property will not be used.
     * @returns 
     */
    createRenderRoot() {
        return this;
    }

    render() {
        if(this.session == undefined){
            return html``
        }
        return this.session.modules.map(module => {
            return html`<module-detail .module=${module}></module-detail>`
        })
    }

    gotoNextModule(event){
        const currentModule = event.detail
        var nextModule = undefined
        for(let module of this.session.modules){
            if(module.order > currentModule.order){
                nextModule = module
                break
            }
        }
        if(nextModule == undefined){
            this.dispatchEvent(new CustomEvent('closePopup', {
                bubbles: true
            }))
        }else{
            this.dispatchEvent(new CustomEvent('scrollToElement', {
                detail: 'module_' + nextModule.id,
                bubbles: true
            }))
        }
    }
}

// Register component
customElements.define('session-detail', SessionDetailElement)
