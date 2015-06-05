module.exports = function(root) {
    return {
        //系统目录
        model: root + '/model/',
        view: root + '/view/',
        controller: root + '/controller/',
        static: root + '/static/',
        maxAge: 259200000,
        //端口设置
        port: 3000
    }

}