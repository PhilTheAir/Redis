const data = require('./data/tdata');
const utils = require('./utils')
const arr = data.fake;

let [minute_5, minute_15, minute_30, hour_1, hour_4, day_1, week_1, month_1] = [[], [], [], [], [], [], [], []];

arr.forEach((value, index) => {
    utils.dataGroup(minute_5, minute_15, minute_30, hour_1, hour_4, day_1, week_1, month_1, ...value);
});

exports.minute_5 = minute_5;
exports.minute_15 = minute_15;
exports.minute_30 = minute_30;
exports.hour_1 = hour_1;
exports.hour_4 = hour_4;
exports.day_1 = day_1;
exports.week_1 = week_1;
exports.month_1 = month_1;