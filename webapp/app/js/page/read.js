
$('#search').on('click', getData);

function init() {
    initTime();

    // getData();
}


function initTime() {
    var date = new Date(new Date().getTime() - 300000);

    $('#j-date').datetimebox('setValue', formatTime(date));
}

function getData() {
    var date = $('#j-date').datetimebox('getValue');
    var timeLen = Number($('#j-timeLen').val());
    var code = $('#j-code').val();

    var time = new Date(date).getTime();
    var url = './readLog?time='+time+'&len='+(timeLen<60?timeLen:5)+'&code='+code;

    $('#dg').datagrid('loading');

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(json) {
            $('#dg').datagrid('loaded');

            var data = formatData(json);

            if (data.length == 0) {
                alert('未查到该时间段日志');
                return;
            }

            renderGrid(data);
        }
    })
}

function formatData(json) {
    var reg = /(\d+\.\d+\.\d+\.\d+).+\[(.+)\].+?".+?\s(.+?)\s.+?".+?"(.+?)"\s"(.+?)"/;

    var item, result = [];
    for (var i = 0; i < json.length && i < 500; i++) {
        item = json[i].match(reg);
        if (item && item.length >= 5) {
            result.push({
                'ip'    : item[1],
                'time'  : formatDate(item[2]),
                'logurl': decodeURIComponent(item[3]),
                'url'   : decodeURIComponent(item[4]),
                'ua'    : item[5]
            })
        }
    }

    return result;
}

function formatDate(str) {
    var arr = str.match(/.+?:(.+)\s/);
    return (arr && arr.length >=1) ? arr[1] : str;
}

function renderGrid(json) {
    $('#dg').datagrid({
        data: json
    });
}

function formatTime(date) {
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var h = date.getHours();
    var min = date.getMinutes();

    return m+'/'+d+'/'+y+' '+h+':'+min;
}

$(init);