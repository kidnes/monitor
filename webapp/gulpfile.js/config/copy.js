var config = require('./')

module.exports = {
  root: config.sourceDirectory,
  src: config.sourceDirectory + '{{css,easyui,images}/**/*,favicon.ico}',
  dest: config.publicDirectory
}