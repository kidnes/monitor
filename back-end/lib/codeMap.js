var redis       = require("redis");
var timeKey     = require('./timeKey');

var DEFAULT_MAP_NAME = "codeMapList";
var codeMap = {};

function init() {
    
    initDBCode();

}

function initDBCode() {
    var client = redis.createClient();

    client.hgetall([DEFAULT_MAP_NAME], function(err, replies){
        if (replies) {
            codeMap = replies;
            
            evt.fire('CodeInited', codeMap);
        }
    })

    client.quit();
}

exports.getCodeMap = function() {
    return codeMap;
}

init();