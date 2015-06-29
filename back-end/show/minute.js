var map         = require('../lib/codeMap');
var time        = require('../controller/timeKeyManage');

function* renderMintue () {
    var timeKey = time.getCurTimeKey();
    // var timeKey = time.getLastTimeKey();
    var codeMap = yield map.getTimeRangeCount(timeKey),
        code = [];

    for (var item in codeMap) {
        code.push(codeMap[item]);
    }

    code.sort(function(item1, item2) {
        return item2.count - item1.count;
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

exports.getMinuteDate = function*() {
    return yield renderMintue();
}