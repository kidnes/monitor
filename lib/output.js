function output(obj) {
    for (var item in obj) {
        console.log(item, obj[item]);
    }
}

exports = module.exports = output;