const events = require('events');
const fs = require('fs');
const readline = require('readline');
const Redis = require('ioredis');

const ee = new events.EventEmitter();
const redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    family: 4,  // 4(IPv4) or 6(IPv6)
    // password: 'luckyus',
    db: 0
});

const dir = './data/';
const _t = '_tick';
const _o = '_open';
const _h = '_high';
const _l = '_low';
const _c = '_close';
const _v = '_volume';
const dot = '.';
const comma = ',';
const bufferSize = 1024;

ee.on('start', () => {
    redis.get('imda', (err, result) => {
        if (result !== 'updated') {
            ee.emit('readdir');
        }
        else {
            console.log('updated ... ');
            process.exit();
        }
    });
});

ee.on('readdir', () => {
    fs.readdir(dir, (err, files) => { 
        if (err) {
            throw err; 
        }
        else {
            ee.emit('readfile', files);
        }
    });
});

ee.on('readfile', (files) => {
    files.forEach((value) => {
        let filePath = dir + value;
        let fileName = value.split(dot)[0];
        /*let rl = readline.createInterface({
            input: fs.createReadStream(filePath)
        });
        rl.on('line', (line) => {
            ee.emit('redis', line, fileName);
        });*/

        let fd = fs.openSync(filePath, 'r'); 
        let buffer = new Buffer(bufferSize);
        let leftOver = '';
        let read, line, idxStart, idx;
        while ((read = fs.readSync(fd, buffer, 0, bufferSize, null)) !== 0) {
            leftOver += buffer.toString('utf8', 0, read);
            idxStart = 0;
            while ((idx = leftOver.indexOf("\n", idxStart)) !== -1) {
                line = leftOver.substring(idxStart, idx);
                console.log("one line read: " + line);
                // ee.emit('redis', line, fileName);
                idxStart = idx + 1;
            }
            leftOver = leftOver.substring(idxStart);
        }
        if (leftOver !== '') {
            console.log("one line read: " + leftOver);
            // ee.emit('redis', leftOver, fileName);
        }
    });
});

ee.on('redis', (line, fileName) => {
    // <TICKER>,<DTYYYYMMDD>,<TIME>,<OPEN>,<HIGH>,<LOW>,<CLOSE>,<VOL>
    // AUDUSD,20010102,230100,0.5617,0.5617,0.5617,0.5617,4
    let arr = line.split(comma);
    let [ yyyy, mm, dd ] = [ parseInt(arr[1].substr(0, 4)), parseInt(arr[1].substr(4, 2)), parseInt(arr[1].substr(6, 2)) ];
    let [ hh, mi, ss ] = [ parseInt(arr[2].substr(0, 2)), parseInt(arr[2].substr(2, 2)), parseInt(arr[2].substr(4, 2)) ];
    let tick = (new Date(yyyy, mm - 1, dd, hh, mi, ss)).getTime();
    redis.rpush(fileName + _t, tick);
    redis.rpush(fileName + _o, arr[5]);
    redis.rpush(fileName + _h, arr[6]);
    redis.rpush(fileName + _l, arr[7]);
    redis.rpush(fileName + _c, arr[8]);
    redis.rpush(fileName + _v, arr[9]);
    console.log('redis imported', fileName);
});

ee.emit('start');