var email       = require("emailjs");
var config      = require('../config/mail');
var server      = email.server.connect(config.connect);

exports.sendMail = function* (option) {
    

    var message = {
        from:    option.from, 
        to:      option.to,
        subject: option.subject,
        attachment: 
        [
          {data: option.text, alternative:true}
        ]
    }

    var res = yield function(done) {
        server.send(message, function(err, res) {
            console.log(err || res);
            done(null, res || err);
        });
    }

    console.log("res::"+res);
    
}