var client      = require("../controller/redis").getClient();

var sessionName = "ASNMS";

function* checkClientSession(key) {
    var result = yield function(done) {
        client.get(key, done);
    } 

    return result ? true : false;
}


module.exports = function *(next) {

    if (/\.html$/.test(this.req.url) || this.req.url === "/") {

        var cookie = this.cookies.get('ASNMS');

        if (cookie) {
            var check = yield checkClientSession(cookie);
            if (!check) this.redirect('/login');

        } else {
            
            this.redirect('/login');
        }

    }

    yield next;
}


