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
        let fileName = value.split(dot)[0];
        let arr = [ fileName + _t, fileName + _o, fileName + _h, fileName + _l, fileName + _c, fileName + _v ];
        arr.forEach((e) => {
            redis.del(e);
            console.log(e, 'deleted.');
        });
    });
});

ee.emit('start');