var config = require('./')

module.exports = {
    src: config.sourceDirectory + '/css/',
    dest: config.publicDirectory + '/css/',
    bundleConfigs: [{
        fileName: 'index.css'
    // }, {
    //     fileName: 'about.css'
    }]
  
}