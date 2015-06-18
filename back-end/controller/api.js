var url         = require("url");
var map         = require('../lib/codeMap');
var config      = require('../config/nginx');
var child_process = require('child_process');

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

//格式：18\/Jun\/2015:10:03
function formatSedTime(date) {
    var arr = date.toString().split(' ');
    var time = arr[4].replace(/(\d+:\d+):\d+/, '$1');

    return arr[2] + '\\/' + arr[1] + '\\/' + arr[3] + ':' + time;
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

exports.readLog = function* () {
    var params = url.parse(this.req.url, true).query;
    var date = new Date(Number(params.time));
    var len = params.len;
    var code = params.code;

    var isToday = date.getDate() === (new Date().getDate());
    var file = (isToday?config.logPath:config.backLogPath) + '/' + config.logFileName;
    
    var date2 = new Date(date.getTime() + len * 60000);

    var time1 = formatSedTime(date);
    var time2 = formatSedTime(date2);

    var cmd = "cat "+file+ "| grep dc.gif\\?code="+code + "| sed -n '/{time1}/,/{time2}/'p"

    cmd = cmd.replace(/{time1}/, time1).replace(/{time2}/, time2);

    console.log(cmd);

    var option = {maxBuffer:1024*1024*100};

    var result = yield function(done) {
        child_process.exec(cmd, option, done);
    }
    
    // var child = child_process.exec(cmd, option);
    // child.stdout.on('data', function(data) {
    //     console.log(data);
    // });

    var data = result[0];

    this.body = data.split(/[\r\n]/g);
    // this.body = child.stdout;
}

