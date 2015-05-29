'use strict';

var fs = require('fs')
var path = require('path')
var mime = require('mime')

function Rewriter (rules, options) {
    options = options || {};

    var nop = function () {};
    if (options.silent) {
        this.log = {
            ok: nop,
            error: nop,
            verbose: nop
        };
    } else {
        this.log = {
            ok: console.log,
            error: console.error,
            verbose: options.verbose ? console.log : nop
        };
    }

    this.root = options.root || '';

    this.rules = [];
    (rules || []).forEach(this.registerRule, this);
}

Rewriter.prototype = {
    registerRule: function (rule) {
        var type = 'rewrite';

        rule = rule || {};

        if (this.isRuleValid(rule)) {
            if (rule.redirect) {
                rule.redirect = rule.redirect === 'permanent' ? 301 : 302;
                type = 'redirect ' + rule.redirect;
            }
            
            this.rules.push({
                from: new RegExp(rule.from),
                to: rule.to,
                redirect: rule.redirect
            });

            this.log.ok('Rewrite rule created for: [' + type.toUpperCase() + ': ' + rule.from + ' -> ' + rule.to + '].');
            return true;
        } else {
            this.log.error('Wrong rule given.');
            return false;
        }
    },

    isRuleValid: function (rule) {
        return rule.from && rule.to && typeof rule.from === 'string' && typeof rule.to === 'string';
    },

    resetRules: function () {
        this.rules = [];
    },

    getRules: function () {
        return this.rules;
    },

    dispatcher: function (req, res, next) {
        var logger = this.log.verbose;
        var root = this.root;
        return function (rule) {
            var toUrl,
                fromUrl = req.url;

            if (rule.from.test(req.url)) {

                var result = req.url.match(rule.from);
                toUrl = root + result[0].replace(rule.from, rule.to);

                
                if (fs.existsSync(toUrl)) {

                    res.writeHead(200, {
                        'Content-Type': mime.lookup(toUrl) || 'unknown'
                    })

                    fs.createReadStream(toUrl).pipe(res);

                } else {
                    res.writeHead(404);
                    res.end('404: Not found:'+toUrl+'');
                }

                logger(
                    (rule.redirect ? 'redirect ' + rule.redirect : 'rewrite').toUpperCase() + ' > ' +
                    fromUrl + ' -> ' + toUrl + ' | By [' + rule.from + ' : ' + rule.to + ']'
                );
                return true;
            }
        };
    },

    getMiddleware: function () {
        return function (req, res, next) {
            if (!this.rules.length || !this.rules.some(this.dispatcher(req, res, next))) {
                next();
            }
        }.bind(this);
    }
};

module.exports.getMiddleware = function (rules, options) {
    return (new Rewriter(rules, options)).getMiddleware();
};

module.exports.Rewriter = Rewriter;
