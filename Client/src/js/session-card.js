import { LitElement, html } from 'lit'


export default class SessionCardElement extends LitElement {

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
        var imageBg = ''
        if(this.session.visual){
            imageBg = `--bg-image: url('${SERVER_URL + PUBLIC_PATH + this.session.visual}')`
        }

        const totalDuration = this.computeTotalDuration()
        return html`
        <div class="card session" style="${imageBg}" @click=${this.openSession}>
            <div class="card-body">
                <h5 class="card-title">${this.session.name}</h5>
                <div class="card-text">
                    <span>${ this.session.modules.length } modules</span>
                    <span>${ this.secondsToMs(totalDuration) }</span>
                </div>
            </div>
        </div>`
    }
    
    computeTotalDuration(){
        var totalDuration = 0
        this.session.modules.forEach(module => {
            module.steps.forEach(step => {
                totalDuration += this.msToSeconds(step.duration)
            })
        });
        return totalDuration
    }

    /**
     * Convert String duration to number of seconds
     * @param {String} msDuration as "mm:ss.xxx"
     * @returns Nomber nb of seconds
     */
    msToSeconds(msDuration){
        const [mins, seconds] = msDuration.split(':')
        return parseInt(mins) * 60 + parseFloat(seconds)
    }

    /**
     * Convert number of seconds to mm:ss
     * 
     * @param {Number} nbSeconds 
     * @returns String
     */
    secondsToMs(nbSeconds){
        const minutes = Math.trunc(nbSeconds / 60)
        const seconds = nbSeconds % 60
        return `${(minutes<10)?("0"):("")}${minutes}:${(seconds<10)?("0"):("")}${seconds}`
    }

    openSession(event){
        this.dispatchEvent(new CustomEvent('open-session', {
            detail: this.session,
            bubbles: true
        }))
    }
}

window.customElements.define('session-card', SessionCardElement);