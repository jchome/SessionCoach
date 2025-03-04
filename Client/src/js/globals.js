
console.log("SERVER_URL", SERVER_URL)

/**
 * Call an URL to the server, and use cache if possible
 * 
 * @param {String} url 
 * @param {String} method 
 * @param {Dict} data 
 * @returns 
 */
window.call = function(url, method = "GET", data = {}, headers = undefined){
    const newHeaders = headers || {
        'X-App': KEY_APP,
        'X-Requested-With': 'XMLHttpRequest',
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