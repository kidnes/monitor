var redis       = require("redis");

var config      = require("../config/redis");

var client      = redis.createClient(config.port, config.host);

exports.getClient = function() {
    return client;
}