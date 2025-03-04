// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// Compile the "bootstrap.css", merging bootstrap CSS
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css'

//import NavBarElement from './js/sample-navbar.js'
import DropdownButtonElement from './js/dropdown.js'
import DropdownItemElement from './js/dropdown-item.js'
import DropdownDividerElement from './js/dropdown-divider.js'
import PanelElement from './js/panel.js'
import PanelFloatingElement from './js/panel-floating.js'
import ContainerElement from './js/container.js'
import DividerElement from './js/divider.js'
import TabsElement from './js/tabs.js'
import TabItemsElement from './js/tab-items.js'
import TabItemElement from './js/tab-item.js'
import TabPanelsElement from './js/tab-panels.js'
import FileLoaderElement from './js/file-loader.js'
import DropZoneElement from './js/dropzone.js'
import TreeElement from './js/tree.js'
import TableElement from './js/table.js'
import TablePaginationElement from './js/table-pagination.js'
import ModalElement from './js/modal.js'

// For webpack and vite.js: include also this CSS
import './css/index.css'

export { /*NavBarElement, */DropdownButtonElement, DropdownItemElement, DropdownDividerElement,
    PanelElement, PanelFloatingElement, ContainerElement, DividerElement, TabsElement,
    TabItemsElement, TabItemElement, TabPanelsElement, FileLoaderElement, DropZoneElement,
    TableElement, TablePaginationElement, ModalElement }