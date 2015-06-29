var map         = require('../lib/codeMap');

exports.getHourData = function*() {
    var codeMap = yield map.getCodeMapGen();
    var code = [], item, obj = {};

    var result = [];
    for (var key in codeMap) {
        codeMap[key]['code'] = key;
        result.push(codeMap[key]);
    }

    return result;
}