const { app, BrowserWindow, Menu } = require('electron')
const path = require('node:path')

const debugMode = process.argv.includes('--debugMode=true')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'app/preload.js')
      },
      icon: 'dist/favicon.png',
    })
  
    win.loadFile('dist/index.html', {
      query: {
        "debugMode": debugMode
      }
    })
    
    if(debugMode){
      // Open developper tools for debug
      win.webContents.openDevTools();
    }
    
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


if(!debugMode){
  // Disable the menu, and CRTL-R for reload
  const template = [];
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
