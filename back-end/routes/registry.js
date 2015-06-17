var koaBody     = require('koa-body')();
var show        = require('../controller/show');
var api         = require('../controller/api');
var record      = require('../controller/record');


function routes(app) {
    app.get('/dc.gif',           record.emptyGif)
    app.get('/',                 show.index)
    app.get('/editCode.html',    show.editCode)
    app.get('/minute.html',      show.minute)
    app.get('/hour.html',        show.hour)
    app.get('/day.html',         show.day)
    app.get('/query.html',       show.query)

    app.get('/getHourRangeData',         api.getHourRangeData)
    app.get('/getErrRangeData',          api.getErrRangeData)
    
    app.post('/updateCodeMap',   koaBody, record.updateCodeMap)
    
}

module.exports = routes;