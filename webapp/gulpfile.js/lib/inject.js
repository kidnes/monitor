'use strict';

var fs = require('fs')
var path = require('path')
var mime = require('mime')

var log;

function Inject (options) {
    options = options || {};

    var nop = function () {};
    if (options.silent) {
        log = {
            ok: nop,
            error: nop,
            verbose: nop
        };
    } else {
        log = {
            ok: console.log,
            error: console.error,
            verbose: console.log
        };
    }

    this.isInject = this.checkInject(options);

    this.options = options;
}

Inject.prototype = {
    checkInject: function(options) {
        console.log('checkInject:'+options.injectTo+options.injectTo.length+Boolean(!options.injectTo || options.injectTo.length <= 0));
        if (!options.injectTo || options.injectTo.length <= 0 
            || !options.injectFiles || options.injectFiles.length <= 0) 
                return false;
        
        typeof options.injectTo === 'string' && (options.injectTo = [options.injectTo]);
        typeof options.injectFiles === 'string' && (options.injectFiles = [options.injectFiles]);

        options.injectTo = options.injectTo.map(function(item){
            if (!item instanceof RegExp) return new RegExp(item);
            return item;
        })
        return true;
    },
    getInjectFilesContent: function() {
        var options = this.options;

        var content = '';

        options.injectFiles.forEach(function(item) {
            var file = path.resolve(item);
            
            fs.existsSync(file) && (content += fs.readFileSync(file, 'utf8'));

            log.ok('InjectFile:'+path.resolve(item));
        })

        if (/{{HOST}}/.test(content)) {
            !options.host && (options.host = require('dev-ip')()); 
            !options.port && (options.port = 80);
            
            content = content.replace(/{{HOST}}/, options.host+':'+options.port);
        }

        return content;

    },
    dispatcher: function (req, res, next) {
        var me = this;
        this.options.injectTo.forEach(function(item){
            if (item.test(req.url)) {
                log.ok('InjectURL:'+req.url);
                
                var content = me.getInjectFilesContent();
                
                // res.writeHead(200, {
                //     'Content-Type': 'application/x-javascript'
                // })
                res.write(content);
                // res.end();
            }
        })
    },

    getMiddleware: function () {
        return function (req, res, next) {
            next();

            this.isInject && this.dispatcher(req, res, next);

        }.bind(this);
    }
};

module.exports.getMiddleware = function (options) {
    return (new Inject(options)).getMiddleware();
};

module.exports.Inject = Inject;
