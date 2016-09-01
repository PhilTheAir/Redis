const comma = ',';

exports.strifyLine = (line) => {
    // AUDUSD,20010102,230100,0.5617,0.5617,0.5617,0.5617,4
    let arr = line.split(comma);
    let [ yyyy, mm, dd ] = [ parseInt(arr[1].substr(0, 4)), parseInt(arr[1].substr(4, 2)), parseInt(arr[1].substr(6, 2)) ];
    let [ hh, mi, ss ] = [ parseInt(arr[2].substr(0, 2)), parseInt(arr[2].substr(2, 2)), parseInt(arr[2].substr(4, 2)) ];
    let tick = (new Date(yyyy, mm - 1, dd, hh, mi, ss)).getTime();
    let j = {
        t: tick,
        o: arr[3],
        h: arr[4],
        l: arr[5],
        c: arr[6],
        v: arr[7],
    }
    return JSON.stringify(j);
}
