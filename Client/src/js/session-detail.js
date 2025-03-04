import {LitElement, html} from 'lit'

import ModuleDetailElement from './module-detail.js';

export default class SessionDetailElement extends LitElement {
    static properties = { 
        session: {type: Object},
    };
    static get styles() { };

    constructor() {
        super();
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
}

// Register component
customElements.define('session-detail', SessionDetailElement)
