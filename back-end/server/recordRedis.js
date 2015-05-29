var url         = require("url");
var redis       = require("redis");
var timeKey     = require('../lib/timeKey');

function pushToRedis(code, time) {
    var client = redis.createClient();

    client.hexists([code, time], function(err, replies){
        if (replies) {
            client.hincrby([code, time, 1], redis.print);
        } else {
            client.hset([code, time, 1], redis.print);
        }

        client.quit();

    })

    console.log(code+':'+time);

}

exports = module.exports = function(req, res){
    res.on('finish', function() {
        var params = url.parse(req.url, true).query,
            code = params.code || 999,
            time = timeKey.getMinTimeKey(new Date());


        pushToRedis('code_'+code, time);
    })
}