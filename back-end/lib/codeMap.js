var client      = require("../controller/redis").getClient();

var DEFAULT_MAP_NAME = "codeMapList";

function getCodeMap() {

    return function(done) {
        client.hgetall([DEFAULT_MAP_NAME], done);
    }
}


function updateCodeMap(cmd) {

    return function(done) {
        client.hmset(cmd, done);
    }
}

function delCodeMap(cmd) {

    return function(done) {
        client.hdel(cmd, done);
    }
}

function* getRangeCount(code, st, et) {
    var count = 0, temp;

    var allkeys = yield function(done) {
        client.keys('code:'+code+':*', done);
    }

    keys = [];
    for (var i = 0; i < allkeys.length; i++) {
        temp = Number(allkeys[i].replace('code:'+code+':', ''));
        if (temp >= st && temp <= et) keys.push(allkeys[i]);
    }

    for (var i = 0; i < keys.length; i++) {
        temp = yield function(done) {
            client.get(keys[i], done);
        }
        count += Number(temp);
    }

    return count;
}

exports.getCodeMapPromise = function() {
    return new Promise(function(resolve, reject) {

        client.hgetall([DEFAULT_MAP_NAME], function(err, replies){
            if (replies) resolve(replies);

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

exports.getRangeCount = getRangeCount;

exports.getTimeRangeCount = function*(st, et) {
    if (typeof et === 'undefined') et = (new Date().getTime())/1000>>0;

    var codeMap = yield exports.getCodeMapGen();    

    for (var item in codeMap) {
        var count = yield getRangeCount(item, st, et);
        codeMap[item].code = item;
        codeMap[item].count = Number(count);
    }

    return codeMap;
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


