const events = require('events');
const fs = require('fs');
const Redis = require('ioredis');
const utils = require('./utils');
const eventStream = require('event-stream');

const ee = new events.EventEmitter();
const redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    db: 0
});

const dir = './data/';
const dot = '.';
const limit = 100;  // 700 for any dir with sole file
let todo = 0;
let done = 0;

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
            if (todo === 0) {
                console.log('nothing to insert into Redis ... ');
                process.exit();
            }
            else {
                ee.emit('readfile', files);
            }
        }
    });
});

ee.on('readfile', (files) => {
    while (files.length > 0) {
        let value = files.shift().toLowerCase();
        let filePath = dir + value;
        let fileName = value.split(dot)[0];
        
        let lineNum = 0;
        let allLines = [];

        console.time(fileName, 'concatenation');

        let _stream = fs.createReadStream(filePath)
            .pipe(eventStream.split())
            .pipe(eventStream.mapSync((line) => {
                if (line.trim() !== '') {
                    lineNum += 1;
                    allLines.push([['rpush'], [fileName], [utils.strifyLine(line)]]);
                    if (lineNum === limit) {
                        _stream.pause();
                        redis.multi(allLines).exec(() => {
                            console.log('imported', lineNum, 'lines to Redis from', fileName);
                            lineNum = 0;
                            allLines = [];
                            _stream.resume();
                        });
                    }
                }
            })
            .on('end', () => {
                let l = allLines.length;
                if (l > 0) {
                    redis.multi(allLines).exec(() => {
                        console.log('imported the last', l, 'lines to Redis from', fileName);
                        ee.emit('watch', fileName);
                    });
                }
                else {
                    ee.emit('watch', fileName);
                }
            })
            .on('error', (err) => {
                console.log(err);
            })
        );
    }
});

ee.on('watch', (fileName) => {
    console.log('imported the entire', fileName, 'to Redis.');
    console.timeEnd(fileName, 'concatenation');
    done += 1;
    if (done === todo) {
        redis.set('imda', 'updated', () => {
            console.log('All data have been inserted into Redis ... ');
            process.exit();
        });   
    }
});

ee.emit('start');
