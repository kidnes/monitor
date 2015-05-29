var config = require('./')

module.exports = {
  autoprefixer: { browsers: ['last 2 version'] },
  // src: config.sourceDirectory + "/styles/base/*.sass",
  src: config.sourceDirectory + "/styles/**/*.{sass,scss,css}",
  dest: config.publicDirectory + '/css',
  settings: {
    indentedSyntax: true, // Enable .sass syntax!
    imagePath: 'images' // Used by the image-url helper
  }
}