var views = require('co-views');

// setup views mapping .html
// to the swig template engine

module.exports = views(__dirname + '/../html', {
  map: { html: 'swig' }
});