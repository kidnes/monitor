var redis       = require("redis");

var DEFAULT_MAP_NAME = "codeMapList";

function getCodeMap() {
    var client = redis.createClient();

    return function(done) {
        client.hgetall([DEFAULT_MAP_NAME], done);

        client.quit();
    }
}

function updateCodeMap(cmd) {
    var client = redis.createClient();

    return function(done) {
        client.hmset(cmd, done);

        client.quit();
    }
}

function delCodeMap(cmd) {
    var client = redis.createClient();

    return function(done) {
        client.hdel(cmd, done);

        client.quit();
    }
}

exports.getCodeMapPromise = function() {
    return new Promise(function(resolve, reject) {
        var client = redis.createClient();

        client.hgetall([DEFAULT_MAP_NAME], function(err, replies){
            if (replies) resolve(replies);

            client.quit();
        });
        
    });
}

exports.getCodeMapGen = function*() {
    var codeMap = yield getCodeMap();
    var item, obj = {};
    for (var key in codeMap) {
        item = key.split(':');
        if (item.length == 2) {
            if (typeof obj[item[0]] == 'undefined') obj[item[0]] = {};
            obj[item[0]][item[1]] = codeMap[key];
        }
    }

    return obj;
}

exports.getCodeMapAPI = function*() {
    var data = yield getCodeMap();

    var arr = [];
    for (var item in data) {
        arr.push({code: item, message: data[item]});
    }
    
    return JSON.stringify(arr);
}

exports.updateCodeMap = function *(body) {
    var cmd = [DEFAULT_MAP_NAME],
        result, key,
        updated = body.updated || [],
        deleted = body.deleted || [];

    if (updated.length > 0) {
        for (var i=0; i < updated.length; i++) {
            cmd.push(updated[i].code+':message');
            cmd.push(updated[i].message);
            cmd.push(updated[i].code+':owner');
            cmd.push(updated[i].owner);
            cmd.push(updated[i].code+':email');
            cmd.push(updated[i].email);
        }

        result = yield updateCodeMap(cmd);
    }

    if (deleted.length > 0) {
        cmd = [DEFAULT_MAP_NAME];

        for (var i=0; i < deleted.length; i++) {
            cmd.push(deleted[i].code+':message');
            cmd.push(deleted[i].code+':owner');
            cmd.push(deleted[i].code+':email');
        }

        result = yield delCodeMap(cmd);
    }

    return result;
}


