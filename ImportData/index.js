const events = require('events');
const fs = require('fs');
const readline = require('readline');
const Redis = require('ioredis');

const ee = new events.EventEmitter();
const redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    db: 0
});

const dir = './data/';
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
    if (files.length > 0) {
        let value = files.shift();
        let filePath = dir + value;
        let fileName = value.split(dot)[0];
        let rl = readline.createInterface({
            input: fs.createReadStream(filePath)
        });
        rl.on('line', (line) => {
            ee.emit('redis', line, fileName);
        });
        rl.on('close', () => {
            ee.emit('readfile', files);
        });
    }
    else {
        console.log('All data imported !!');
        process.exit();
    }
});

ee.on('redis', (line, fileName) => {
    // AUDUSD,20010102,230100,0.5617,0.5617,0.5617,0.5617,4
    let arr = line.split(comma);
    let [ yyyy, mm, dd ] = [ parseInt(arr[1].substr(0, 4)), parseInt(arr[1].substr(4, 2)), parseInt(arr[1].substr(6, 2)) ];
    let [ hh, mi, ss ] = [ parseInt(arr[2].substr(0, 2)), parseInt(arr[2].substr(2, 2)), parseInt(arr[2].substr(4, 2)) ];
    let tick = (new Date(yyyy, mm - 1, dd, hh, mi, ss)).getTime();
    let j = {
        tick: tick,
        open: arr[5],
        high: arr[6],
        low: arr[7],
        close: arr[8],
        volume: arr[9],
    }
    redis.rpush(fileName, JSON.stringify(j));
    console.log('redis imported', fileName);
});

ee.emit('start');