import { LitElement, html } from 'lit'


export default class FileLoaderElement extends LitElement {
    static properties = { 
        accept: {type: String},
    }
    static get styles() { };

    constructor() {
        super();
        this.accept = "*.*"
        this.reader = 'text'
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
	    return html`
            <!-- File selector for opening a new file-->
            <input id="fileSelector" type="file" value="" style="display:none;" @change=${ this.loadFile } 
                accept="${this.accept}"/>
        `
    }

    /**
     * Open the file selector
     */
     openTextFile(extensionsAccepted){
        this.reader = 'text'
        this.accept = extensionsAccepted
        this.updateComplete.then(() => {
            fileSelector.click()
        })
    }

    /**
     * Open the file selector
     */
     openBinaryFile(extensionsAccepted){
        this.reader = 'binary'
        this.accept = extensionsAccepted
        this.updateComplete.then(() => {
            fileSelector.click()
        })
    }

    /**
     * The file was chosen
     */
    loadFile(event){
        if(event.target.files.length == 0 || event.target.files[0] == ""){
            // No file
            return;
        }
        var file = event.target.files[0];
        if(!file){
            return;
        }

        // Reset the field, to allow to choose the same file the next time
        fileSelector.value = "" 

        var reader = new FileReader();
        const self = this;
        reader.onload = function(event) {
            self.dispatchEventFileSelected(file, event.target.result)
        }
        if(this.reader == 'text'){
            reader.readAsText(file)
        }else if (this.reader == 'binary'){
            reader.readAsBinaryString(file)
        }else{
            console.error(`Type of reader not managed: '${this.reader}'`)
        }
    }

    dispatchEventFileSelected(file, data){
        // Raise an event
        var type = file.type
        if(type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            type = "application/xlsx"
        }
        this.dispatchEvent(new CustomEvent('onFileLoaded', {
            detail: [
                {
                    path: file.path, 
                    name: file.name, 
                    type: type,
                    content: data,
                }
            ],
            bubbles: true,
        }))
    }
	
}

// Register component
customElements.define('app-file-loader', FileLoaderElement);