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

function* ldap(username, password){
    var options = {
        url: 'ldaps://ldap.example.com:663',
    };
    var auth = new LdapAuth(options);
    return true;
}


exports.getLogin = function*() {
    yield this.render('login');
}

exports.checkLogin = function* () {
    if (this.request.body) {
        var body = this.request.body;
        var isCheckUser = yield checkUser(body.username);

        if (isCheckUser) {
            var isLogin = yield ldap(body.username, body.password);
            this.render('login');
        } else {
            this.render('login', {msgTip: tip});
        }
    } else {
        this.render('login');
    }
}