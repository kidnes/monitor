exports.connect = {
   user:    "liubin1", 
   host:    "mail.letv.com",
   port:    25,
   domain:  "letv.com",
   timeout: 10000,
   tls: {ciphers: "SSLv3"}
}

exports.client = {
    from : "liubin1@letv.com",
    to : "liubin1@letv.com",
    subject : "【前端监控预警系统】错误码 {{code}} 异常"
}