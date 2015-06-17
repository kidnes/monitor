require('../lib/highcharts');
require('../lib/exporting');

$('#search').on('click', renderCharts);

function init() {
    initTime();

    renderCharts();
}

function initTime() {
    var et = new Date(),
        st = new Date(et.getTime() - 3600000);

    $('#start-time').datetimebox('setValue', formatTime(st));
    $('#end-time').datetimebox('setValue', formatTime(et));
}

function renderCharts() {
    var st = $('#start-time').datetimebox('getValue');
    var et = $('#end-time').datetimebox('getValue');

    var sts = (new Date(st).getTime())/1000>>0;
    var ets = (new Date(et).getTime())/1000>>0;
    var url = './getHourRangeData?st='+ sts+'&et='+ets;

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(json) {
            window.codeMapCount = json;

            var code = [];

            for (var item in json) {
                code.push(json[item]);
            }

            code.sort(function(item1, item2){
                return item1.count < item2.count;
            })

            var opt = { categories: [], errCount:[] };
            for (var i = 0; i < code.length; i++) {
                opt.categories.push(code[i].code);
                opt.errCount.push(code[i].count);
            }

            var st = $('#start-time').datetimebox('getValue');
            var et = $('#end-time').datetimebox('getValue');

            opt.timePeriods = st+' - '+et;

            showCharts(opt);
        }
    })
}

function showCharts(opt) {
    $('#container').highcharts({
        chart: {
            type: 'column',
            margin: [ 50, 20, 100, 70]
        },
        title: {
            text: '时间段：' + opt.timePeriods
        },
        xAxis: {
            categories: opt.categories,
            labels: {
                enabled: true,
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '10px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '每五分钟的错误条数'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                return '错误码：'+this.x+'<b><br/>错误信息：'+ codeMapCount[this.x].message +'</b><br/>'+ '对应条数: '+ Highcharts.numberFormat(this.y,0);
            }
        },
        credits: {
            enabled: false
        },
        exporting:{ 
            enabled:false //用来设置是否显示‘打印’,'导出'等功能按钮，不设置时默认为显示 
        },
        series: [{
            name: '错误码',
            data: opt.errCount,
            dataLabels: {
                enabled: false,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }]
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
