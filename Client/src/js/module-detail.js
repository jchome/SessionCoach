import {LitElement, html} from 'lit'

import StepDetailElement from './step-detail.js';

export default class ModuleDetailElement extends LitElement {
    static properties = { 
        module: {type: Object},
    };
    static get styles() { };

    constructor() {
        super();

        this.addEventListener('nextStep', this.gotoNextStep)
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
                <step-detail .step=${step}  id="step_${step.id}"></step-detail>`
        })
        return html`
        <div class="module-header" id="module_${this.module.id}">
            <i class="bi bi-bookmark"></i> ${ this.module.name }
        </div>
        <div class="steps">
            ${ stepsHtml }
        </div>
        `
    }

    gotoNextStep(event){
        const currentStep = event.detail
        console.log("currentStep", currentStep)
        var nextStep = undefined
        for(let step of this.module.steps){
            if(step.order > currentStep.order){
                nextStep = step
                break
            }
        }
        console.log("nextStep", nextStep)
        if(nextStep == undefined){
            //console.log("Go to next module")
            this.dispatchEvent(new CustomEvent('gotoNextModule', {
                detail: this.module,
                bubbles: true
            }))
        }else{
            console.log("scrollToElement", nextStep.id)
            this.dispatchEvent(new CustomEvent('scrollToElement', {
                detail: 'step_' + nextStep.id,
                bubbles: true
            }))
            this.querySelector(`step-detail#step_${nextStep.id}`).startTimer()
        }
        return false
    }
}

// Register component
customElements.define('module-detail', ModuleDetailElement)
