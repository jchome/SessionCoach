import {LitElement, html} from 'lit'

export default class StepDetailElement extends LitElement {
    static properties = { 
        step: {type: Object},
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
        console.log(this.step)
         return html`
         <div class="step-header">
            ${this.step.name}
         </div>
         <div class="step-content">
         </div>
         <div class="step-footer">
            <button class="">NEXT</button>
         </div>
         `
        
    }
}

// Register component
customElements.define('step-detail', StepDetailElement)
