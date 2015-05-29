var redis       = require("redis");

var DEFAULT_MAP_NAME = "codeMapList";

function getCodeMap() {
    var client = redis.createClient();

    return function(done) {
        client.hgetall([DEFAULT_MAP_NAME], done);

        client.quit();
    }
}

exports = module.exports = function*() {
    var data = yield getCodeMap();

    var arr = [];
    for (var item in data) {
        arr.push({code: item, message: data[item]});
    }
    
    return JSON.stringify(arr);
}