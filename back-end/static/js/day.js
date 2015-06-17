webpackJsonp([2,6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);


/***/ },

/***/ 3:
/***/ function(module, exports, __webpack_require__) {

	var lib = __webpack_require__(10);

	function init() {
	    var columns = [];
	    for (var item in dayCount[0]) {
	        if (item == 'day') columns.unshift({field: item, title: '日期', width: 80})
	        else columns.push({field: item, title: item, align:'right', width: 120, formatter:lib.formatData});
	    }

	    var total = {};
	    for (var i = 0; i < dayCount.length; i++) {
	        var item = dayCount[i];
	        for (var code in item) {
	            total[code] = !isNaN(total[code]) ? total[code] + item[code] : item[code];
	        }
	    }

	    total.day = '总计';
	    dayCount.push(total);

	    renderDagegrid({columns: columns, data: dayCount});
	}

	function renderDagegrid(opt) {
	    $('#dg').datagrid({
	        width: 'auto',
	        height: 'auto',
	        singleSelect: true,
	        fitColumns: true,
	        data: opt.data,
	        columns: [opt.columns],
	    });
	}

	init();

/***/ },

/***/ 10:
/***/ function(module, exports, __webpack_require__) {

	function formatData(val, row){
	    return (val+'').replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	}

	exports.formatData = formatData;

/***/ }

});