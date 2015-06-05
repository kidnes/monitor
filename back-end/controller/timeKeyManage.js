var redis       = require("redis");
var map         = require('../lib/codeMap');
var timeKey     = require('../lib/timeKey');

var codeMap, curTimeKey, lastTimeKey;

function init() {
    lastTimeKey = timeKey.getMinTimeKey(new Date(new Date().getTime() - 300000));
    curTimeKey = timeKey.getMinTimeKey(new Date());

    startTime();
}

function startTime() {
    var d = new Date(),
        cur = d.getTime(),
        d1 = new Date(cur - 300000),
        year = d1.getFullYear(),
        month = d1.getMonth()+1,
        date = d1.getDate(),
        hour = d1.getHours(),
        min = Math.floor(d1.getMinutes()/5)*5,
        d2 = new Date(year+'-'+month+'-'+hour+' '+hour+':'+min+':0'),
        delay = cur - d2.getTime();

    setTimeout(function(){
        setInterval(update, 300000);
    }, delay)
}

function update() {
    console.log('update:'+new Date());
    map.getCodeMapPromise().then(function(data){
        codeMap = data;

        updateKey(curTimeKey);

        lastTimeKey = curTimeKey;
        curTimeKey = timeKey.getMinTimeKey(new Date());
    })

}

function updateKey(key) {
    var client = redis.createClient();
    for (var item in codeMap) {
        var code = 'code:' + item;
        client.hget([code, key], function(err, replise) {
            if (replise) {
                client.hincrby([code, key.slice(0, -2), Number(replise)], redis.print)  //更新小时数据

                client.hincrby([code, key.slice(0, -4), Number(replise)], redis.print)  //更新当天数据
            }
        })
        
    }
}

init();


exports.getCurTimeKey = function() {
    return curTimeKey;
}

exports.getLastTimeKey = function() {
    return lastTimeKey;
}