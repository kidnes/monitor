webpackJsonp([1,6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);


/***/ },

/***/ 2:
/***/ function(module, exports, __webpack_require__) {

	var lib = __webpack_require__(10);


	$('#search').on('click', renderData);

	function init() {
	    initTime();

	    renderData();
	}


	function initTime() {
	    var et = new Date(),
	        st = new Date(et.getTime() - 3600000);

	    $('#start-time').datetimebox('setValue', formatTime(st));
	    $('#end-time').datetimebox('setValue', formatTime(et));
	}

	function renderData() {
	    var st = $('#start-time').datetimebox('getValue');
	    var et = $('#end-time').datetimebox('getValue');

	    var sts = (new Date(st).getTime())/1000>>0;
	    var ets = (new Date(et).getTime())/1000>>0;
	    var url = './getErrRangeData?st='+ sts+'&et='+ets+'&code='+$('#err-code').val()+'&type='+$('#query-type').val();

	    $.ajax({
	        url: url,
	        type: 'GET',
	        dataType: 'json',
	        success: function(json) {
	            console.log(json);
	            $('#dg').datagrid({
	                data: json
	            })
	        }
	    })
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

/***/ },

/***/ 10:
/***/ function(module, exports, __webpack_require__) {

	function formatData(val, row){
	    return (val+'').replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	}

/***/ }

});