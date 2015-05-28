var redis       = require("redis");
var event       = require('../lib/event');
var timeKey     = require('../lib/timeKey');
var map         = require("../lib/codeMap");
var countData   = require("./countData");


function analyse() {
    evt.on('CodeInited', function(){
        console.log('CodeInited');
        var times = timeKey.getDateTimeKey();

        var codeMap = map.getCodeMap();

        countData(codeMap, times);
    })

}

exports = module.exports = analyse;