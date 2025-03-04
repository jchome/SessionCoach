import { LitElement, html } from 'lit'
import { translate } from 'lit-translate'


export default class DropZoneElement extends LitElement {
    static properties = { 
      files: {type: Array},
      message: {type: String},
    }
    static get styles() { };

    constructor() {
        super();
        this.files = []
        this.message = "Drop files here"
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
     * /
    willUpdate(changedProperties){
        
    }*/
  
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
      const filesHtml = this.files.map((fileData, index) => {
        return html`
          <div class="file-info">
            <button class="btn btn-danger btn-xs ms-2" @click=${this.onRemoveFile}><i class="bi bi-x" data-index="${index}"></i></button>
            <span class="file-name">${fileData.name}</span>
            <span class="file-type">(${fileData.type})</span>
          </div>`
      })
      if(filesHtml.length == 1){
        filesHtml.push( html`<button type="button" class="btn btn-sm btn-primary mt-2 float-end" @click=${this.startUpload}>
            ${ translate("app-dropzone.UploadOneFile") }
        </button>` )
      }else if(filesHtml.length > 1){
        filesHtml.push( html`<button type="button" class="btn btn-sm btn-primary mt-2 float-end" @click=${this.startUpload}>
            ${ translate("app-dropzone.UploadManyFiles", {nb: filesHtml.length}) }
        </button>` )
      }
      return html`
        <div class="drop-container" @dragenter=${this.dragenter} @dragleave=${this.dragLeave} @dragover=${this.allowDrop} @drop=${this.drop}>
          ${ this.message }
        </div>
        <div class="gallery">${ filesHtml }</div>
      `
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

    drop(event){
        event.preventDefault();
        this.classList.remove('drag-enter');
        const dropZone = this;
        ([...event.dataTransfer.files]).forEach((file) => {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = function() {
                var type = file.type
                if(type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
                    type = "application/xlsx"
                }
                dropZone.manageFile(file.name, file.path, type, reader.result)
            }
        })

    }

    dragenter(event){
        this.classList.add('drag-enter')
    }
    dragLeave(event){
        this.classList.remove('drag-enter')
    }
    allowDrop(event){
        event.preventDefault();
    }

    manageFile(name, path, type, srcB64){
        this.files.push({
            name, path, type, srcB64
        })
        this.requestUpdate()
    }

    startUpload(event){
        this.dispatchEvent(new CustomEvent('onFileLoaded', {
            detail: this.files,
            bubbles: true,
        }))
        /*let img = document.createElement('img')
        img.src = srcB64
        gallery.appendChild(img)*/
        this.files = []
    }

    onRemoveFile(event){
      const indexToRemove = event.target.getAttribute("data-index")
      this.files.splice(indexToRemove, 1)
      this.requestUpdate()
    }
}

// Register component
customElements.define('app-dropzone', DropZoneElement);