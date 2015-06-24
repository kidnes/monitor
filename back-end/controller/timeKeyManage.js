var client      = require("./redis").getClient();
var map         = require('../lib/codeMap');
var timeKey     = require('../lib/timeKey');
var mail        = require('./mail');
var co          = require('co');

var codeMap, curTimeKey, lastTimeKey;

function init() {
    lastTimeKey = timeKey.getMinTimeKey(new Date(new Date().getTime() - 300000));
    curTimeKey = timeKey.getMinTimeKey(new Date());

    startTime();
}

function startTime() {
    var d = new Date(),
        cur = d.getTime(),
        d1 = new Date(cur + 300000),
        year = d1.getFullYear(),
        month = d1.getMonth()+1,
        date = d1.getDate(),
        hour = d1.getHours(),
        min = Math.floor(d1.getMinutes()/5)*5,
        d2 = new Date(year+'-'+month+'-'+date+' '+hour+':'+min+':0'),
        delay = d2.getTime() - cur;

    setTimeout(function(){
        setInterval(update, 300000);
    }, delay)
}

function update() {

    co(function*(){
        codeMap = yield map.getCodeMapGen();

        var time = timeKey.getMinTimeKey(new Date());

        if (time == curTimeKey) return;

        yield asnms(lastTimeKey);

        lastTimeKey = curTimeKey;
        curTimeKey = time;
    })

}

function updateKey(key) {
    for (var item in codeMap) {
        var code = 'code:' + item;
        client.hget([code, key], function(err, replise) {
            if (replise) {
                client.hincrby([code, key.slice(0, -2), Number(replise)])  //更新小时数据

                client.hincrby([code, key.slice(0, -4), Number(replise)])  //更新当天数据
            }
        })
        
    }
}

function* asnms(key) {
    var lastKey = (new Date((key - 86400)*1000).getTime())/1000>>0;
    for (var item in codeMap) {
        var lastCount = yield function(done) {
            client.get('code:'+item+':'+lastKey, done);
        }

        var curCount = yield function(done) {
            client.get('code:'+item+':'+key, done);
        }
        
        if (lastCount > 100 && curCount > lastCount * 5) {
            var option = codeMap[item];
            option.count = curCount;
            option.time = key;
            yield sendMail(option);
        }
    }
}

function* sendMail(codeOption) {
    var config = require('../config/mail').client;

    var html = "<html><br/><br/><p style='font-size:18px; color:#336699;'>错误码: "+codeOption.code+" 在时间段：" + foramtTime(codeOption.time)+" 比昨日相同时间段高出5倍："+ codeOption.count + "</p>";

    var option = {
        from    : config.from,
        to      : config.to,
        subject : config.subject.replace(/{{code}}/, codeOption.code),
        text    : html
    }

    
    yield mail.sendMail(option);
    
}

function foramtTime(time) {
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

init();


exports.getCurTimeKey = function() {
    return curTimeKey;
}

exports.getLastTimeKey = function() {
    return lastTimeKey;
}