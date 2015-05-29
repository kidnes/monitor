var config = require('./');

module.exports = {
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [
    // {
    //   entries: config.sourceDirectory + '/js/global.coffee',
    //   dest: config.publicDirectory,
    //   outputName: 'global.js',
    //   // Additional file extentions to make optional
    //   extensions: ['.js', '.coffee', '.hbs'],
    //   // list of modules to make require-able externally
    //   require: ['jquery', 'backbone/node_modules/underscore']
    //   // See https://github.com/greypants/gulp-starter/issues/87 for note about
    //   // why this is 'backbone/node_modules/underscore' and not 'underscore'
    // }, 
    {
      entries: config.sourceDirectory + '/js/main/page1.js',
      dest: config.publicDirectory + '/js/',
      outputName: 'page1.js',
      require: ['jquery']
      // list of externally available modules to exclude from the bundle
      // external: ['jquery', 'underscore']
    }]
}