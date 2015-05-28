var redis       = require("redis");
var timeKey     = require('./timeKey');

var DEFAULT_MAP_NAME = "codeMapList";
var codeMap = {};

function init() {

    
    initDBCode();

    // setInterval(checkDBCode, 300000);   //5分钟检测一次code
}

function initDBCode() {
    var client = redis.createClient();

    client.lrange([DEFAULT_MAP_NAME, 0, -1], function(err, replies){
        if (replies && replies.length > 0) {
            console.log(replies);

            for (var i = 0; i < replies.length; i++) {
                codeMap[replies[i]] = true;
            }
            
            evt.fire('CodeInited');
        }
    })

    client.quit();
}

//每隔5分钟检测一次code
function checkDBCode() {
    var client = redis.createClient();

    var time = timeKey.getMinTimeKey(new Date(new Date().getTime() - 300000));

    for (var i = 100; i < 1000; i++) {
        if (codeMap[i]) continue;

        client.hexists(['code_'+i, time], function(err, replies) {
            if (replies) {
                codeMap[i] = true;

                updateDBCode(i);
            }
        });
    }

    client.quit();
}

function updateDBCode(code){
    var client = redis.createClient();

    client.lpush([DEFAULT_MAP_NAME, code.toString()], redis.print);

    client.quit();
}

exports.getCodeMap = function() {
    return codeMap;
}

init();