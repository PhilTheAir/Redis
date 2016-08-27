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
    files.forEach((value) => {
        let fileName = value.split(dot)[0].toLowerCase();
        redis.del(fileName, () => {
            todo -= 1;
            console.log(fileName, 'deleted.');
            if (todo === 0) {
                // console.log('All data deleted.');
                process.exit();
            }
        });
    });
});

ee.emit('start');
