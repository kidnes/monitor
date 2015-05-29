var config = require('./')

module.exports = {
  src: config.publicDirectory + '/**/*.html',
  dest: config.publicDirectory,
  option: {
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyCSS: true,
    minifyJS: true
  }
}