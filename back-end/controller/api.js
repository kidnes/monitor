var url         = require("url");
var redis       = require("redis");
var map         = require('../lib/codeMap');

//type=1时为分钟，0为小时
function formatTime(time, type) {
    var date = new Date(time*1000);
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var h = date.getHours();
    var min = Math.floor(date.getMinutes()/5)*5;

    m = m < 10 ? '0'+m : m;
    d = d < 10 ? '0'+d : d;
    h = h < 10 ? '0'+h : h;
    min = min < 10 ? '0'+min : min;

    return y+m+d+' - '+h+':'+(type==1 ? min : '00');
}

exports.getHourRangeData = function* () {
    var params = url.parse(this.req.url, true).query;

    this.body = yield map.getTimeRangeCount(Number(params.st), Number(params.et));

}

exports.getErrRangeData = function* () {
    var params = url.parse(this.req.url, true).query;

    var code = params.code;
    var step = params.type == 1 ? 5*60 : 60*60; 
    var st = Number(params.st) - step;
    var et = Number(params.et);

    var timeArr = [];
    for (var i = st; i <= et; i = i+step) {
        timeArr.push(i);
    }

    var result = [];
    for (var i = 0; i < timeArr.length - 1; i++) {
        var time = formatTime(timeArr[i], params.type);
        var count = yield map.getRangeCount(code, timeArr[i], timeArr[i+1]);
        result.push({time: time, count: count});
    }

    this.body = JSON.stringify(result);

}