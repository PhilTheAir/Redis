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
    //password: 'luckyus',
    db: 0,
});

const dir = './data/';

ee.on('start', () => {
    redis.get('imda', function (err, result) {
        if ((result !== 'updated'), () => {
            ee.on('import');
        });
    });
});

ee.on('import', () => {
    fs.readdir(dir, (err, files) => { 
        if (!err) 
            console.log(files);
        else
            throw err; 
    });
});

ee.emit('start');


/*
let rl = readline.createInterface({
  input: fs.createReadStream('file.in')
});

rl.on('line', function (line) {
  console.log('Line from file:', line);
});

*/