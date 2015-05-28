var redis       = require("redis");
var output      = require('../lib/output');

var codeCount = {};
var codeKey;

function countData(codeMap, times) {
    codeKey = times.shift();

    var client = redis.createClient();
    var count = 0;

    for (var code in codeMap) {
        codeCount[code] = 0;
        for (var i = 0; i < times.length; i++) {
            (function(code, time){
                console.log('hget', 'code_'+code, time);
                client.hget(['code_'+code, time], function(err, replies){
                    if (replies) {
                        codeCount[code] += Number(replies);
                    }

                    if (++count === times.length) {
                        output(codeCount);

                        client.quit();

                        updateDBData();
                    }
                })
            })(code, times[i]);
            
        }
        
    }
}

function updateDBData() {
    var client = redis.createClient();

    for (var code in codeCount) {
        client.hset(['code_'+code, codeKey, codeCount[code]], function(err, replies) {

        })
    }
    client.quit();

    evt.fire('CountFinish');

}

exports = module.exports = countData;