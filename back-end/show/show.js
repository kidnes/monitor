var map         = require('../lib/codeMap');
var day         = require('./day');
var hour        = require('./hour');
var minute      = require('./minute');

exports.index = function* () {
    yield this.render('index');
}

exports.editCode = function* () {
    var codeMap = yield map.getCodeMapGen();

    var result = [];
    for (var key in codeMap) {
        result.push(codeMap[key]);
    }

    yield this.render('editCode', {codeMap: "var codeMap = " + JSON.stringify(result)});
}

exports.minute = function* () {
    var opt = yield minute.getMinuteDate();
    yield this.render('minute', opt);
}

exports.hour = function* () {
    var result = yield hour.getHourData();

    yield this.render('hour', {codeMap: "var codeMap = " + JSON.stringify(result)});
}

exports.day = function* () {
    var dayCount = yield day.getDayData();
    
    yield this.render('day', {dayCount: dayCount});
}

exports.query = function* () {
    // var opt = yield renderMintue();
    yield this.render('query');
}

exports.read = function* () {
    // var opt = yield renderMintue();
    yield this.render('read');
}

