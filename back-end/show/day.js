var map         = require('../lib/codeMap');
var client      = require("../controller/redis").getClient();

var DEFAULT_CACHE = "cacheDay";

function* renderDay() {
    var arr = getDayArr();
    var rows = [], codeMap, temp;

    for (var i = 0; i < arr.length -1; i++) {
        codeMap = yield map.getTimeRangeCount(arr[i], arr[i+1]);
        temp = {'day': formatDay(arr[i])};
        
        for (var code in codeMap) {
            temp[code] = codeMap[code].count;
        }

        rows.push(temp);
    }

    return rows;
}

function getDayArr() {

    var cur = getToday(), lastCur;
    var arr = [];
    for (var i = 0; i < 8; i++) {
        lastCur = (new Date(cur - i*86400000).getTime())/1000>>0; //86400000=60*60*24*1000
        arr.unshift(lastCur);
    }
    return arr;
}

function formatDay(time) {
    var date = new Date(time*1000);
    var m = date.getMonth()+1;
    var d = date.getDate();

    m = m < 10 ? '0'+m : m;
    d = d < 10 ? '0'+d : d;
    
    return m+'-'+d;
}

function* getCacheDay() {
    var today = getToday();
    return yield function(done) {
        client.hget([DEFAULT_CACHE, 'day:'+today], done);
    }
}

function setCacheDay(data) {
    var today = getToday();
    client.hset([DEFAULT_CACHE, 'day:'+today, data], function(){});
}

function getToday() {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();

    return new Date(y+'/'+m+'/'+d+' 00:00:00').getTime();
}

exports.getDayData = function*() {
    var result = yield getCacheDay();

    if (!result) {
        result = yield renderDay();
        result = JSON.stringify(result);
        setCacheDay(result);
    }

    return result;
}
