import { Preferences } from '@capacitor/preferences';

window.KEY_USER_TOKEN = "SessionCoach-App-user-token"

/**
 * Call an URL to the server, and use cache if possible
 * 
 * @param {String} url 
 * @param {String} method 
 * @param {Dict} data 
 * @returns 
 */
window.call = async function(url, method = "GET", data = {}, headers = undefined){
    const userToken = await Preferences.get({ key: KEY_USER_TOKEN })
    //console.log("CALL ", url, userToken.value)
    const newHeaders = headers || {
        'X-App': KEY_APP,
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + JSON.parse(userToken.value),
    }
    var options = {
        method: method,
        mode: 'cors',
        headers: newHeaders,
        dataType: "json",
    }
    if(data && Object.keys(data).length > 0){
       options.body = JSON.stringify(data)
    }
    return new Promise((resolve, reject) => {
        fetch(SERVER_URL + url, options).then(
            response => {
                //console.log(response)
                if(response.ok){
                    resolve(response.json())
                }else{
                    reject( {status: response.status, message: response.statusText} )
                }
            }
        )/*.then((result) => {
            resolve(result)
        })*/.catch(error => {
            reject(error)
        });
    })
}

/**
* Convert String duration to number of seconds
* @param {String} msDuration as "mm:ss.xxx"
* @returns Nomber nb of seconds
*/
window.msToSeconds = function(msDuration){
   const [mins, seconds] = msDuration.split(':')
   return parseInt(mins) * 60 + parseFloat(seconds)
}

/**
* Convert number of seconds to mm:ss
* 
* @param {Number} nbSeconds 
* @returns String
*/
window.secondsToMs = function(nbSeconds){
   const minutes = Math.trunc(nbSeconds / 60)
   const seconds = nbSeconds % 60
   return `${(minutes<10)?("0"):("")}${minutes}:${(seconds<10)?("0"):("")}${seconds}`
}