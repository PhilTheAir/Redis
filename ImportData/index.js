// <TICKER>,<DTYYYYMMDD>,<TIME>,<OPEN>,<HIGH>,<LOW>,<CLOSE>,<VOL>
// AUDUSD,20010102,230100,0.5617,0.5617,0.5617,0.5617,4

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
        let rl = readline.createInterface({
            input: fs.createReadStream(value)
        });
        rl.on('line', (line) => {
            console.log('Line from file:', line);
        });
    });
    process.exit();
});

ee.emit('start');