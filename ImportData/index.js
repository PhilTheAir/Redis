const events = require('events');
const fs = require('fs');
const readline = require('readline');
const Redis = require('ioredis');
const utils = require('./utils');

const ee = new events.EventEmitter();
const redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    db: 0
});

const dir = './data/';
const dot = '.';
const limit = 20000;

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
        let value = files.shift().toLowerCase();
        let filePath = dir + value;
        let fileName = value.split(dot)[0];
        let rl = readline.createInterface({
            input: fs.createReadStream(filePath)
        });
        let allLines = [];
        rl.on('line', (line) => {
            let toPush = [];
            toPush.push('rpush');
            toPush.push(fileName);
            toPush.push(utils.strifyLine(line));
            allLines.push(toPush);
        });
        rl.on('close', () => {
            ee.emit('redis', allLines, fileName, files);
        });
    }
    else {
        redis.set('imda', 'updated', () => {
            process.exit();
        });
    }
});

ee.on('redis', (allLines, fileName, files) => {
    if (allLines.length > 0) {
        let l = (limit <= allLines.length) ? limit : allLines.length;
        let arr = allLines.splice(0, l);
        redis.multi(arr).exec(() => {
            console.log(fileName, 'imported:', l, 'lines.');
            ee.emit('redis', allLines, fileName, files);
        });
    }
    else {
        ee.emit('readfile', files);
    }
});

ee.emit('start');
