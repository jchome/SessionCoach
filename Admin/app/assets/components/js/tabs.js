import { LitElement, html } from 'lit'


export default class TabsElement extends LitElement {
    static properties = { 
    }
    static get styles() { };

    constructor() {
        super();
        this.childrenHTML = undefined
        this.panelsContainer = undefined

        this.addEventListener('tabSelected', (event) => {
            event.stopPropagation()
            this.querySelector('app-tab-items').selectedTab(event.detail.id)
            this.querySelector('app-tab-panels').showPanel(event.detail.panel)
        })
        this.addEventListener('tabClose', (event) => {
            event.stopPropagation()
            const tabToRemove = this.querySelector('app-tab-item#'+event.detail.id)
            if(tabToRemove.selected){
                // Select previous tab
                var tabToSelect = tabToRemove.previousElementSibling
                if(! tabToSelect){
                    tabToSelect = tabToRemove.nextElementSibling
                }
                if(tabToSelect){
                    // Activate the first tab
                    tabToSelect.activate()
                }
            }
            const dataInfo = tabToRemove.getAttribute("data-info")
            // Remove the tab
            tabToRemove.remove()
            // Remove the panel
            this.querySelector('app-panel#'+event.detail.panel).remove()
            this.dispatchEvent(new CustomEvent('tabClosed', {
                detail: { 
                    id: event.detail.id,
                    info: dataInfo,
                },
                bubbles: true
            }))
        })
    }

    /**
     * The default implementation of createRenderRoot creates an open shadow root 
     * and adds to it any styles set in the static styles class field.
     * To customize a component's render root, implement createRenderRoot and 
     * return the node you want the template to render into.
     * 
     * Don't use the shadow-root node. The "styles" property will not be used.
     * @returns 
     */
    createRenderRoot() {
        return this;
    }

    // Lifecycle of component:
    // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle
    /** Pre-Update:
      * Constructor()
      *   -> requestUpdate()
      */
  
    /**
     * Update:
     *  -> performUpdate()
     *  -> shouldUpdate(changedProperties): boolean
     *  -> willUpdate()
     *  -> update()
     *    -> render(): html
     */
  
    /** Post-Update:
      * -> firstUpdated()
      * -> updated()
      * -> updateComplete()
      * The updateComplete promise resolves when the element has finished updating. Use updateComplete 
      *   to wait for an update. The resolved value is a boolean indicating if the element has finished 
      *   updating. It will be true if there are no pending updates after the update cycle has finished.
      *  Usage: this.updateComplete.then( () => { "do somthing..." })
      */

    /**
     * Called to determine whether an update cycle is required.
     *
     * Updates     No. Property changes inside this method do not trigger an element update.
     * Call super? Not necessary.
     * 
     * @param {Dictionary} changedProperties 
     * @returns Boolean
     * /
    shouldUpdate(changedProperties) {
        return true;
    }*/
	
    /**
     * Called before update() to compute values needed during the update.
     *
     * Updates?	    No. Property changes inside this method do not trigger an element update.
     * Call super?  Not necessary.
     * 
     * @param {Dictionary} changedProperties 
     * @returns Boolean
     */
    willUpdate(changedProperties){
        const activeTab = this.querySelector('app-tab-items app-tab-item[selected]')
        if(!activeTab){
            return
        }
        const panelToShow = activeTab.getAttribute("panel")
        this.querySelector('app-tab-panels').showPanel(panelToShow)
        
    }
	
    /**
     * Called to update the component's DOM.
     *
     * Updates?    No. Property changes inside this method do not trigger an element update.
     * Call super? Yes. Without a super call, the element’s attributes and template will not update.
     * 
     * @param {Dictionary} changedProperties 
     * @returns Boolean
     * /
    update(changedProperties){
	    super.update(changedProperties)
    }*/
	
	
    /**
     * Called by update() and should be implemented to return a renderable 
     *   result (such as a TemplateResult) used to render the component's DOM.
     *
     * Updates?    No. Property changes inside this method do not trigger an element update.
     * Call super? Not necessary.
     * 
     * @param {Dictionary} changedProperties 
     * @returns Boolean
     */
    render() {
	    return html``
    }

    
    /**
     * Called after the component's DOM has been updated the first time, 
     * immediately before updated() is called.
     * 
     * Updates?	Yes. Property changes inside this method schedule a new update cycle.
     * Call super?	Not necessary.
     * 
     * @param {Map} changedProperties keys are the names of changed properties and values that are the corresponding previous values.
     * /
    firstUpdated(changedProperties) {
    }*/

    /**
     * Called whenever the component’s update finishes and the element's DOM has been 
     * updated and rendered.
     *
     * Updates?    Yes. Property changes inside this method trigger an element update.
     * Call super? Not necessary.
     * 
     * @param {Map} changedProperties keys are the names of changed properties and values that are the corresponding previous values.
     * @returns 
     * /
    updated(changedProperties){
        
    }*/

    createTab(title, tabId, panelContent, panelId, closable, info){
        return new Promise((resolve) => {

            const tabItems = this.querySelector('app-tab-items')
            const tabPanels = this.querySelector('app-tab-panels')
    
            tabItems.addTab(title, tabId, panelId, closable)
            tabPanels.addPanel(panelContent, panelId)
            tabItems.updateComplete.then(() => {
                const newTab = tabItems.querySelector("#"+tabId)
                if(info != undefined){
                    newTab.setAttribute("data-info", info)
                }
                newTab.activate()
                return resolve([newTab, tabPanels.querySelector("#"+panelId)])
            });
        })
    }

    contains(tabId){
        return this.querySelectorAll('app-tab-item#'+tabId).length > 0
    }

    activateTab(tabId){
        return new Promise(() => {
            const tabItem = this.querySelector('app-tab-item#'+tabId)
            if(tabItem){
                tabItem.activate()
            }
            const panelItem = this.querySelector('app-tab-panels app-panel#'+tabItem.panel)
            return resolve([tabItem, panelItem])
        })
    }

    getPanelId(pannelId){
        return this.querySelector('app-panel#'+pannelId)
    }
	
}

// Register component
customElements.define('app-tabs', TabsElement);