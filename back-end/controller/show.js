var redis       = require("redis");
var map         = require('../lib/codeMap');
var time        = require('./timeKeyManage');


function* renderMintue () {
    var codeMap = yield map.getCodeMapGen();
    var timeKey = time.getLastTimeKey();

    var code = [],
        count = 0;

    var client = redis.createClient();
    for (var item in codeMap) {
        count = yield function(done) {
            client.get('code:'+item+':'+timeKey, done);
        }

        code.push({code: item, message: codeMap[item], count: Number(count)});
    }

    code.sort(function(item1, item2) {
        return item1.count > item2.count;
    })

    var item, categories = [], errCount =[] ;
    for (var i = 0; i < code.length; i++) {
        item = code[i];
        categories.push(item.code);
        errCount.push(item.count);
    }

    var opt = {};
    opt.codeMap = "var codeMap = " + JSON.stringify(code);
    opt.categories = categories;
    opt.errCount = errCount;
    opt.timePeriods = formatTime(timeKey) || timeKey;
    return opt;
}

function formatTime(str) {
    if (str.length !== 12) return;

    var arr = str.match(/(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)/);
    var year = arr.slice(1, 4).join('-');
    var time = arr.slice(4).join(':');
    var date1 = new Date(year+' '+time);
    var date2 = new Date(date1.getTime() + 300000);
    var hour = date2.getHours(),
        min = date2.getMinutes();
    
    hour    = hour < 10 ? '0'+hour : hour;
    min     = min < 10 ? '0'+min : min;

    return year+' '+time+' - '+hour+':'+min;

}


exports.index = function* () {
    yield this.render('index');
}

exports.editCode = function* () {
    var codeMap = yield map.getCodeMapGen();
    var code = [], item, obj = {};

    // for (var key in codeMap) {
    //     item = key.split(':');
    //     if (item.length == 2) {
    //         if (typeof obj[item[0]] === 'undefined') obj[item[0]] = {};
    //         obj[item[0]][item[1]] = codeMap[key];
    //     }
    // }

    var result = [];
    for (var key in codeMap) {
        codeMap[key]['code'] = key;
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
    yield this.render('day', opt);
}
