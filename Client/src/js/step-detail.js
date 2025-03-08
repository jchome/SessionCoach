import {LitElement, html} from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export default class StepDetailElement extends LitElement {
    static properties = { 
        step: {type: Object},
    };
    static get styles() { };

    constructor() {
        super();
        this.currentTimer = 0
        this.timerInterval = undefined
    }
    
    /**
     * Don't use the shadow-root node. The "styles" property will not be used.
     * @returns 
     */
    createRenderRoot() {
        return this;
    }

    render() {
        var imgSrc = ""
        if(this.step.visual){
            imgSrc = SERVER_URL + PUBLIC_PATH + this.step.visual
        }
        this.maxDuration = msToSeconds(this.step.duration)
        return html`
         <div class="step-header" @click=${this.alignScroll}>
            <i class="bi bi-caret-right"></i> ${this.step.name}
         </div>
         <div class="step-content pause">
            <div class="text-center mx-5 my-2" @click=${this.startTimer}>
                <div class="indicator-icon"></div>
                <img src="${imgSrc}" class="img-fluid">
            </div>
            <div class="description mx-2">
                ${ unsafeHTML(this.step.description) }
            </div>
         </div>
         <div class="step-footer">
            <div class="text-end mx-2">
                <span class="timer">${ secondsToMs(this.currentTimer) }</span> / ${this.step.duration}
            </div>
            <div class="progress mx-2 mb-2" role="progressbar">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
            <button class="next-btn" @click=${this.gotoNextStep}>
                <i class="bi bi-chevron-double-down"></i>
            </button>
         </div>
         `
    }

    gotoNextStep(event){
        this.stopTimer()
        this.dispatchEvent(new CustomEvent('nextStep', {
            detail: this.step,
            bubbles: true
        }))
    }

    startTimer(){
        if(this.querySelector('.step-content').classList.contains('play')){
            // Currently playing
            this.stopTimer()
            return
        }
        this.timerInterval = setInterval( this.updateProgress.bind(this), 1000)
        this.querySelector('.step-content').classList.remove('pause')
        this.querySelector('.step-content').classList.add('play')
    }

    stopTimer(){
        this.querySelector('.step-content').classList.remove('play')
        this.querySelector('.step-content').classList.add('pause')
        clearInterval(this.timerInterval)
    }

    updateProgress(){
        this.currentTimer += 1
        if(this.currentTimer >= this.maxDuration){
          this.stopTimer()
          this.gotoNextStep()
          this.stopTimer()
        }
        const ratio = this.currentTimer / this.maxDuration
        this.querySelector(".progress-bar").style.width = (ratio * 100) + "%"
        this.querySelector(".timer").innerHTML = secondsToMs(this.currentTimer)
    }

    alignScroll(event){
        this.dispatchEvent(new CustomEvent('scrollToElement', {
            detail: 'step_' + this.step.id,
            bubbles: true
        }))
    }
}

// Register component
customElements.define('step-detail', StepDetailElement)
