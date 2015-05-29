var config = require('./')

module.exports = {
  watch: config.sourceDirectory + 'html/**/*.html',
  src: [config.sourceDirectory + 'html/**/*.html', '!**/{layouts,shared}/**'],
  dest: config.publicDirectory,
  swig: {
    defaults: { cache: false }
  }
}