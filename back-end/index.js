var app         = require('koa')();
var router      = require('koa-router')();
var record      = require('./server/recordRedis');
var getCodeMap  = require('./modules/getCodeMap');

router
    .get('/', function*(next) {
        
        this.body = 'Hello World!';

    }).get('/dc.gif', function*(next) {
        this.body = '';

        record(this.req, this.res);
    }).get('/api/getCodeMap', function*(next) {

        var data = yield getCodeMap();

        this.body = data.toString();
    })


app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000);


console.log('Server running at http://127.0.0.1:3000/');
