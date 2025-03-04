const fs = require('fs');
const { resolve } = require('path');

const appName = require('./package.json').name;
const appVersion = require('./package.json').version;

const distFolder = 'dist/'

// Folder for final build
const buildFolder = 'build/'

console.log("Clean-up...")
fs.rmSync(distFolder, { recursive: true, force: true });
fs.rmSync(buildFolder, { recursive: true, force: true });

function prepareDistribution(){

    return new Promise((resolve) => {

        // Prepare "dist" folder
        if (! fs.existsSync(distFolder)){
            fs.mkdirSync(distFolder);
        }
        console.log("Packaging files...")
        // Run webpack. The "dist" folder is already set.
        const exec = require('child_process').exec
        var webpackCmd = './node_modules/.bin/webpack' // Linux
        if(process.platform == 'win32'){
            webpackCmd = '.\\node_modules\\.bin\\webpack.cmd' // Windows
        }
        exec(webpackCmd, function callback(error, stdout, stderr) {
            if(error){
                console.log(error);
                return false
            }
            console.log(stdout);
            console.log(stderr);

            console.log("Prepare app/assets/ folder...")
            // Prepare "assets" folder
            if (! fs.existsSync(distFolder+'assets')){
                fs.mkdirSync(distFolder+'assets');
            }

            for(const item of ['version.js', 'i18n', 'metadata', 'favicon.ico', 
                    '../index.html', '../pages']) {
                // Copy require assets
                console.log("Copying " + item + "...")
                fs.cpSync('app/assets/'+item, distFolder+'assets/'+item, {recursive: true})
            }

            // Copy index.html
            fs.cpSync('app/config-prod.json', distFolder+'config.json')

            // Create the version script
            var writeStream = fs.createWriteStream(distFolder+'assets/version.js');
            writeStream.write('window.APP_VERSION = "'+appVersion+'";\n')
            writeStream.write('window.BASE_HREF = "/SessionCoach/Admin";\n')
            writeStream.write('window.APP_CODE = "SessionCoach";\n')
            writeStream.end();

            return resolve(true)
        });
    })
    
}
/*
function prepareBuild(){
    console.log("Preparing Electron binaries...")

    if (! fs.existsSync(buildFolder)){
        fs.mkdirSync(buildFolder);
    }
    fs.cpSync('./node_modules/electron/dist/', buildFolder, {recursive: true})
    fs.renameSync(buildFolder + "electron.exe", buildFolder + appName + "-" + appVersion + ".exe")
    
    console.log("Removing default app from electron...")
    fs.rmSync(buildFolder + "resources/default_app.asar", { recursive: true, force: true })
    
    const appFiles = buildFolder + "resources/app/"
    if (! fs.existsSync(appFiles)){
        fs.mkdirSync(appFiles);
    }

    // Copy electron files
    fs.copyFile('./index.js', appFiles + "index.js", (err) => { if (err) throw err })
    fs.copyFile('./package.json', appFiles + "package.json", (err) => { if (err) throw err })
    fs.cpSync(distFolder, appFiles + "dist", {recursive: true})

    const distArchive = buildFolder + "resources/app.asar";
    console.log("Packaging app...")
    asar.createPackage(appFiles, distArchive).then(()=>{
        fs.rmSync(appFiles, { recursive: true, force: true });
        console.log("==> Finished - Folder " + buildFolder + " is ready.")
    });
}*/

prepareDistribution().then(() => {
    //prepareBuild()
})

