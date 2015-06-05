var app         = require('koa')();
var router      = require('koa-router')();
var render      = require('koa-swig');
var staticCache = require('koa-static-cache');

var config      = require('./config')(__dirname);

global._        = require('lodash');
global.Promise  = require('bluebird');
global.debug    = require('debug')('monitor');

require('./routes/registry')(router);


app.context.render = render({
    root: config.view,
    autoescape: false,
    // cache: 'memory', // disable, set to false
    cache: false, // disable, set to false
    ext: 'html',
    //locals: locals,
    //filters: filters,
    //tags: tags,
    //extensions: extensions
})


app.use(staticCache(config.static, {
   maxAge: 860000000,
   gzip:true
}));


app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(config.port);


console.log('Server running at http://127.0.0.1:' + config.port);


