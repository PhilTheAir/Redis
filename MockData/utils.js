exports.dataGroup = (minute_5, minute_15, minute_30, hour_1, hour_4, day_1, week_1, month_1, ...value) => {
    let [ newYear, newMonth, newDay, newHour, newMinute, newOpen, newHigh, newLow, newClose, newVolume ] = value;
    let l = minute_5.length;
    if (l === 0) {
        minute_5.push(value);
    }
    else {
        if ((minute_5[l - 1][0] === newYear) && (minute_5[l - 1][1] === newMonth) && (minute_5[l - 1][2] === newDay) && (minute_5[l - 1][3] === newHour) && ((newMinute - minute_5[l - 1][4]) < 5)) {
            if (newHigh > minute_5[l - 1][6]) {
                minute_5[l - 1][6] = newHigh;    
            }
            if (newLow < minute_5[l - 1][7]) {
                minute_5[l - 1][7] = newLow;    
            }
            minute_5[l - 1][8] = newClose;    
            minute_5[l - 1][9] += newVolume;    
        }
        else {
            minute_5.push(value);
        }
    }

    l = minute_15.length;
    if (l === 0) {
        minute_15.push(value);
    }
    else {
        if ((minute_15[l - 1][0] === newYear) && (minute_15[l - 1][1] === newMonth) && (minute_15[l - 1][2] === newDay) && (minute_15[l - 1][3] === newHour) && ((newMinute - minute_15[l - 1][4]) < 15)) {
            if (newHigh > minute_15[l - 1][6]) {
                minute_15[l - 1][6] = newHigh;    
            }
            if (newLow < minute_15[l - 1][7]) {
                minute_15[l - 1][7] = newLow;    
            }
            minute_15[l - 1][8] = newClose;    
            minute_15[l - 1][9] += newVolume;    
        }
        else {
            minute_15.push(value);
        }
    }

    l = minute_30.length;
    if (l === 0) {
        minute_30.push(value);
    }
    else {
        if ((minute_30[l - 1][0] === newYear) && (minute_30[l - 1][1] === newMonth) && (minute_30[l - 1][2] === newDay) && (minute_30[l - 1][3] === newHour) && ((newMinute - minute_30[l - 1][4]) < 30)) {
            if (newHigh > minute_30[l - 1][6]) {
                minute_30[l - 1][6] = newHigh;    
            }
            if (newLow < minute_30[l - 1][7]) {
                minute_30[l - 1][7] = newLow;    
            }
            minute_30[l - 1][8] = newClose;    
            minute_30[l - 1][9] += newVolume;    
        }
        else {
            minute_30.push(value);
        }
    }
    
    l = hour_1.length;
    if (l === 0) {
        hour_1.push(value);
    }
    else {
        if ((hour_1[l - 1][0] === newYear) && (hour_1[l - 1][1] === newMonth) && (hour_1[l - 1][2] === newDay) && (hour_1[l - 1][3] === newHour)) {
            if (newHigh > hour_1[l - 1][6]) {
                hour_1[l - 1][6] = newHigh;    
            }
            if (newLow < hour_1[l - 1][7]) {
                hour_1[l - 1][7] = newLow;
            }
            hour_1[l - 1][8] = newClose;    
            hour_1[l - 1][9] += newVolume;    
        }
        else {
            hour_1.push(value);
        }
    }

    l = hour_4.length;
    if (l === 0) {
        hour_4.push(value);
    }
    else {
        if ((hour_4[l - 1][0] === newYear) && (hour_4[l - 1][1] === newMonth) && (hour_4[l - 1][2] === newDay) && ((newHour - hour_4[l - 1][3]) < 4)) {
            if (newHigh > hour_4[l - 1][6]) {
                hour_4[l - 1][6] = newHigh;    
            }
            if (newLow < hour_4[l - 1][7]) {
                hour_4[l - 1][7] = newLow;    
            }
            hour_4[l - 1][8] = newClose;    
            hour_4[l - 1][9] += newVolume;    
        }
        else {
            hour_4.push(value);
        }
    }

    l = day_1.length;
    if (l === 0) {
        day_1.push(value);
    }
    else {
        if ((day_1[l - 1][0] === newYear) && (day_1[l - 1][1] === newMonth) && (day_1[l - 1][2] === newDay)) {
            if (newHigh > day_1[l - 1][6]) {
                day_1[l - 1][6] = newHigh;    
            }
            if (newLow < day_1[l - 1][7]) {
                day_1[l - 1][7] = newLow;    
            }
            day_1[l - 1][8] = newClose;    
            day_1[l - 1][9] += newVolume;    
        }
        else {
            day_1.push(value);
        }
    }

    l = week_1.length;
    if (l === 0) {
        week_1.push(value);
    }
    else {
        if (isSameWeek(week_1[l - 1], value)) {
            if (newHigh > week_1[l - 1][6]) {
                week_1[l - 1][6] = newHigh;    
            }
            if (newLow < week_1[l - 1][7]) {
                week_1[l - 1][7] = newLow;    
            }
            week_1[l - 1][8] = newClose;    
            week_1[l - 1][9] += newVolume;    
        }
        else {
            week_1.push(value);
        }
    }

    l = month_1.length;
    if (l === 0) {
        month_1.push(value);
    }
    else {
        if ((month_1[l - 1][0] === newYear) && (month_1[l - 1][1] === newMonth)) {
            if (newHigh > month_1[l - 1][6]) {
                month_1[l - 1][6] = newHigh;    
            }
            if (newLow < month_1[l - 1][7]) {
                month_1[l - 1][7] = newLow;    
            }
            month_1[l - 1][8] = newClose;    
            month_1[l - 1][9] += newVolume;    
        }
        else {
            month_1.push(value);
        }
    }
};

function isSameWeek(lastDate, newDate) {
    let date1 = new Date(lastDate[0], lastDate[1], lastDate[2]);
    let date2 = new Date(newDate[0], newDate[1], newDate[2]);
    let gap = ((date2 - date1) / (60000 * 60 * 24));
    if ((gap < 7) && (date2.getDay() >= date1.getDay())) {
        return true;
    }
    else {
        return false;
    }
}