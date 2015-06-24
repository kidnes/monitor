var client      = require("../controller/redis").getClient();

var DEFAULT_MAP_NAME = "codeMap";



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

exports.getCodeMapGen = function*() {
    var codeMap = yield function(done) {
        client.hgetall(DEFAULT_MAP_NAME, done);
    }

    for (var code in codeMap) {
        codeMap[code] = JSON.parse(codeMap[code]);
    }

    return codeMap;
}

exports.getRangeCount = getRangeCount;

exports.getTimeRangeCount = function*(st, et) {
    if (typeof et === 'undefined') et = (new Date().getTime())/1000>>0;

    var codeMap = yield exports.getCodeMapGen();    

    for (var item in codeMap) {
        var count = yield getRangeCount(item, st, et);
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
            cmd.push(updated[i].code, JSON.stringify(updated[i]))
        }

        result = yield updateCodeMap(cmd);
    }

    if (deleted.length > 0) {
        cmd = [DEFAULT_MAP_NAME];

        for (var i=0; i < deleted.length; i++) {

            cmd.push(deleted[i].code);
        }

        result = yield delCodeMap(cmd);
    }

    return result;
}


