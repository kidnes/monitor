var cache = require('lru-cache')({
    maxAge: 30000 // global max age
})

module.exports = function(app) {
    app.use(require('koa-cash')({
        get: function* (key, maxAge) {
            return cache.get(key)
        },
        set: function* (key, value) {
            cache.set(key, value)
        }
    }))

    app.use(function* (next) {

        if (yield* this.cashed()) return

        yield next;
    })
}