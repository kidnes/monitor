var ldapjs      = require('ldapjs');

var config      = require('../config/ldap');
var client      = require("../controller/redis").getClient();

var tip = '<span style="color:#f00;">用户名或密码错误</span>';

function* checkUser(username) {

    var userList = yield function(done) {
        client.lrange(['user', 0, -1], done);
    }

    for (var i = 0; i < userList.length; i++) {
        if (userList[i] === username) return true;
    }

    return false;
}

// function* checkLogin(username, password) {
//     var isLdap = yield ldap(username, password);

//     if (!isLdap) return false;

//     var base64 = require('../lib/base64').encode(username+':'+(new Date().getTime()));

//     var key = 'session:'+base64;
//     client.set([key, 1]);
//     client.expire([key, 86400]);

//     return true;
// }

function* checkUserAuth(username) {
    var userList = yield function(done) {
        client.lrange(['user', 0, -1], done);
    }

    if (!userList || userList.length <= 0) return false;

    for (var i = 0; i < userList.length; i++) {
        if (username == userList[i]) return true;
    }

    return false;
}

function* login(username, password) {
    // username = 'liubin1';
    // password = 'Lb@8412512';

    var isAuth = yield checkUserAuth(username);

    if (!isAuth) return false;

    var isLogin = yield ldap(username, password);

    return isLogin;
}

function loginSuccess(username) {
    var base64 = require('../lib/base64');

    var key = base64.encode(username+':'+(new Date().getTime()));

    client.set([key, 1], function(){});
    client.expire([key, 86400], function(){});

    var opt = {
        expires: new Date(new Date().getTime() + 86400000),
        signed: true,
        httpOnly: true
    };
    this.cookies.set('ASNMS', key, opt)
}


function* ldap(username, password) {
    var client = ldapjs.createClient({
        url: 'ldap://'+config.host+':'+config.port+'/'
    });

    var result = yield function(done) {
        client.bind('letv\\'+username, password, function(err,res){
            var data = err ? 0 : (res.status == 0 ? 1 : 0);
            done(null, data);
        });
    }

    return result ? true : false;
}


exports.getLogin = function*() {
    yield this.render('login');
}

exports.checkLogin = function* () {

    var body = this.request.body;

    if (!body || !body.username || !body.password) {
        yield this.render('login');
        
    } else {
        var isLogin = yield login(body.username, body.password);

        if (isLogin) {
            loginSuccess.call(this, body.username);

            this.redirect('/');
        } else {
            yield this.render('login', {msgTip: tip});
        }
    }
    
}