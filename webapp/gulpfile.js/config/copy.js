var config = require('./')

module.exports = {
  root: config.sourceDirectory,
  src: config.sourceDirectory + '{css,easyui,images}/**/*',
  dest: config.publicDirectory
}