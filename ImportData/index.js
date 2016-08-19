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
const limit = 10000;

let todo = 0;

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
            todo = files.length;
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
        let allLines = [];
        let lineNum = 0;
        rl.on('line', (line) => {
            let toPush = [];
            toPush.push('rpush');
            toPush.push(fileName);
            toPush.push(utils.strifyLine(line));
            allLines.push(toPush);
            lineNum += 1;
            if (lineNum === limit) {
                redis.multi(allLines).exec(() => {
                    console.log(fileName, 'imported:', limit, 'lines.');
                });
                allLines = [];
                lineNum = 0;
            }
        });
        rl.on('close', () => {
            if (allLines.length > 0) {
                redis.multi(allLines).exec(() => {
                    console.log(fileName, 'imported:', lineNum, 'lines.');
                    allLines = [];
                    lineNum = 0;
                    ee.emit('readfile', files);
                });
            }
            else {
                ee.emit('readfile', files);
            }
        });
    }
    else {
        process.exit();
    }
});

ee.emit('start');
