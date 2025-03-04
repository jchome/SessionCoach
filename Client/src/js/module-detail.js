import {LitElement, html} from 'lit'

import StepDetailElement from './step-detail.js';

export default class ModuleDetailElement extends LitElement {
    static properties = { 
        module: {type: Object},
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
        const stepsHtml = this.module.steps.map(step => {
            return html`
                <step-detail .step=${step}></step-detail>`
        })
        return html`
        <div class="module-header">
            ${ this.module.name }
        </div>
        <div class="steps">
            ${ stepsHtml }
        </div>
        `
    }
}

// Register component
customElements.define('module-detail', ModuleDetailElement)
