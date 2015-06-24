var map         = require('../lib/codeMap');
var time        = require('./timeKeyManage');

function* renderMintue () {
    var timeKey = time.getCurTimeKey();
    // var timeKey = time.getLastTimeKey();
    var codeMap = yield map.getTimeRangeCount(timeKey),
        code = [];

    for (var item in codeMap) {
        code.push(codeMap[item]);
    }

    code.sort(function(item1, item2) {
        return item1.count < item2.count;
    })

    var item, categories = [], errCount =[] ;
    for (var i = 0; i < code.length; i++) {
        item = code[i];
        categories.push(item.code);
        errCount.push(item.count);
    }

    var opt = {};
    opt.codeMap = "var codeMap = " + JSON.stringify(codeMap);
    opt.categories = categories;
    opt.errCount = errCount;
    opt.timePeriods = formatTime(timeKey) || timeKey;
    return opt;
}

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
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();

    var cur = new Date(y+'/'+m+'/'+d+' 00:00:00').getTime(), lastCur;
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

function formatTime(time) {
    var date = new Date(time*1000);
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var h = date.getHours();
    var min = date.getMinutes();

    var date2 = new Date(date.getTime() - 300000);
    var h2 = date2.getHours();
    var min2 = date2.getMinutes();

    m = m < 10 ? '0'+m : m;
    d = d < 10 ? '0'+d : d;
    h = h < 10 ? '0'+h : h;
    min = min < 10 ? '0'+min : min;
    h2 = h2 < 10 ? '0'+h2 : h2;
    min2 = min2 < 10 ? '0'+min2 : min2;

    return y+'-'+m+'-'+d+' '+h2+':'+min2+' - '+h+':'+min;
}


exports.index = function* () {
    yield this.render('index');
}

exports.editCode = function* () {
    var codeMap = yield map.getCodeMapGen();

    var result = [];
    for (var key in codeMap) {
        result.push(codeMap[key]);
    }

    yield this.render('editCode', {codeMap: "var codeMap = " + JSON.stringify(result)});
}

exports.minute = function* () {
    var opt = yield renderMintue();
    yield this.render('minute', opt);
}

exports.hour = function* () {
    var codeMap = yield map.getCodeMapGen();
    var code = [], item, obj = {};

    var result = [];
    for (var key in codeMap) {
        codeMap[key]['code'] = key;
        result.push(codeMap[key]);
    }

    yield this.render('hour', {codeMap: "var codeMap = " + JSON.stringify(result)});
}

exports.day = function* () {
    var dayCount = yield renderDay();
    
    yield this.render('day', {dayCount: JSON.stringify(dayCount)});
}

exports.query = function* () {
    // var opt = yield renderMintue();
    yield this.render('query');
}

exports.read = function* () {
    // var opt = yield renderMintue();
    yield this.render('read');
}

