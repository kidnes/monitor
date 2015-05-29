var config = require('./')

var rules = [
    {from: '(/(?:js|css)/[\\w-_\\d]+\\.(?:js|css)$)', to: '$1'}
]

module.exports = {
    rules: rules,
    publicDirectory: config.publicDirectory,

    server: {
        baseDir: config.publicDirectory
    },
    startPath: "/html",
    files: ['pubilc/**/*.html'],
    https: false,
    open: false,
    // proxy: {
    //     target: "http://10.154.252.73/"
    // },
    port: 80,
    logLevel: 'debug',
    minify: false,
    tunnel: true,
    socket: {
        // namespace: function (namespace) {
        //     return "localhost:80"  + namespace;
        // }
    }
    
    // open: "external"
}
