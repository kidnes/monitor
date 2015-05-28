function getMinTimeKey(cur) {
    var year = cur.getFullYear(),
        month = cur.getMonth()+1,
        date = cur.getDate(),
        hour = cur.getHours(),
        min = Math.floor(cur.getMinutes()/5)*5;

    month   = month < 10 ? '0'+month : month;
    date    = date < 10 ? '0'+date : date;
    hour    = hour < 10 ? '0'+hour : hour;
    min     = min < 10 ? '0'+min : min;

    
    return [year, month, date, hour, min].join('');
}

function getHourTimeKey() {
    var cur = new Date(new Date().getTime() - 3600000),
        year = cur.getFullYear(),
        month = cur.getMonth()+1,
        date = cur.getDate(),
        hour = cur.getHours();

    month   = month < 10 ? '0'+month : month;
    date    = date < 10 ? '0'+date : date;
    hour    = hour < 10 ? '0'+hour : hour;

    var prefix = [year, month, date, hour].join('');
    var result = [prefix];

    for (var min = 0; min < 60; min=min + 5) {
        result.push(prefix+(min<10 ? '0'+min : min));
    }

    return result;
}

function getDateTimeKey() {
    var cur = new Date(new Date().getTime() - 86400000),
        year = cur.getFullYear(),
        month = cur.getMonth()+1,
        date = cur.getDate();

    month   = month < 10 ? '0'+month : month;
    date    = date < 10 ? '0'+date : date;

    var prefix = [year, month, date].join('');
    var result = [prefix];

    for (var hour = 0; hour < 24; hour++) {
        result.push(prefix+(hour<10 ? '0'+hour : hour));
    }

    return result;
}

exports.getMinTimeKey   = getMinTimeKey;
exports.getHourTimeKey  = getHourTimeKey;
exports.getDateTimeKey  = getDateTimeKey;
