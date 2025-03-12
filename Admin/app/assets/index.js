/** Translations **/
import { registerTranslateConfig } from "lit-translate";

registerTranslateConfig({
    loader: lang => fetch(window.BASE_HREF+`/assets/i18n/${lang}.json`).then(res => res.json())
})

import { Preferences } from '@capacitor/preferences';



window.KEY_CONFIG = APP_CODE+'-app-config'
window.KEY_USER = APP_CODE+'-app-user'
window.KEY_USER_TOKEN = APP_CODE+'-user-token'

/**
 * Call an URL to the server, and use cache if possible
 * 
 * @param {String} url 
 * @param {String} method 
 * @param {Dict} data 
 * @returns 
 */
window.call = async function(url, method = "GET", data = undefined){
    const confPref = await Preferences.get({ key: KEY_CONFIG })
    const conf = JSON.parse(confPref.value)

    var userToken = undefined
    const userTokenPref = await Preferences.get({ key: KEY_USER_TOKEN })
    if(userTokenPref != null){
        userToken = JSON.parse(userTokenPref.value)
    }else{
        console.warn("No token for url", url)
    }
    
    const headers = {
        'X-App': conf.server.auth.app,
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + (userToken ? userToken : ""),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    var options = {
        method: method,
        mode: 'cors',
        headers: headers,
        dataType: "json",
    }
    if(data){
       options.body = JSON.stringify(data)
    }
    
    return new Promise((resolve, reject) => {
        try {
            fetch(conf.server.host + url, options).then(
                response => response.json()
            ).then((result) => {
                resolve(result)
            })
        } catch (error) {
            console.error("Error:", error);
            reject(error)
        }
    })
  
}

window.dateSqlToHuman = function(dateYMD){
    if(dateYMD && dateYMD.includes('-')){
        return dateYMD.split('-').reverse().join('/')
    }else{
        return dateYMD
    }
}

// Add these imports for Webpack

import './css/index.css'
import * as components from './components/index.js' // import bootstrap too
import MainElement from './js/main.js'
import LoginPage from './js/login.js'

import 'vanillajs-datepicker/css/datepicker-bs5.css'

// Jodit Editor is an excellent WYSIWYG editor written in pure TypeScript without the use of additional libraries. It includes a file editor and image editor.
import '../../node_modules/jodit/es2021/jodit.min.css'

// import generated components
import * as generated from './generated/index.js'

