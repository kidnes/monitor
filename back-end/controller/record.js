var url         = require("url");
var timeKey     = require('./timeKeyManage');
var map         = require('../lib/codeMap');
var client      = require("../controller/redis").getClient();

function pushToRedis(key) {

    client.incr(key);
}

exports.emptyGif = function* () {
    this.body = '';

    var params = url.parse(this.req.url, true).query,
        code = params.code || 999,
        time = timeKey.getCurTimeKey();

    debug('code:'+code);

    pushToRedis(['code', code, time].join(':'));
}

exports.updateCodeMap = function* () {
    if (this.request.body) {
        var result = yield map.updateCodeMap(this.request.body);
    } 

    if (result) this.body = {code: 200};
    else this.body = {code: 400};
}