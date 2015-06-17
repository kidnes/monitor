function formatData(val, row){
    return (val+'').replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

exports.formatData = formatData;