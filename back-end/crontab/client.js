var event       = require('../lib/event');

function getTime() {
    var t = new Date(),
        year = t.getFullYear(),
        month = t.getMonth()+1,
        date = t.getDate(),
        hour = t.getHours(),
        min = Math.floor(t.getMinutes()/5)*5;

    
    if (hour == 0 && min == 0) {
        require('./client/analyseDate')();
    } else if (min == 0) {
        require('./client/analyseHour')();
    }
}

getTime();