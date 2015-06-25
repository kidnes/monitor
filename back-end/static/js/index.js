webpackJsonp([4,7],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(8);


/***/ },

/***/ 8:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9);

	$(function(){
	    le.addTab({title:'分钟统计', url:'./minute.html'});
	})

/***/ },

/***/ 9:
/***/ function(module, exports, __webpack_require__) {

	window.le = {
	    //添加新Tab页
	    addTab : function(data) {
	        var content = '<iframe scrolling="auto" frameborder="0"  src="' + data.url + '" style="width:100%;height:99%;"></iframe>';
	        if ($('#homePageTabs').tabs('exists', data.title)) {
	            // 选中当前Tab
	            $('#homePageTabs').tabs('select', data.title);

	            // 重新加载已经存在的Tab内容
	            var currTab = $('#homePageTabs').tabs('getTab', data.title);
	            $('#homePageTabs').tabs('update', {
	                tab : currTab,
	                options : {
	                    content : content,
	                    closable : true
	                }
	            });
	        } else {
	            $('#homePageTabs').tabs('add', {
	                title : data.title,
	                content : content,
	                closable : true
	            });
	        }
	    },
	    //关闭指定Tab
	    closeTab : function(title) {
	        var titles = [];
	        if(typeof title === 'string'){
	            titles.push(title);
	        } else {
	            titles = title;
	        }
	        for(var i = 0, len = titles.length; i < len; i++){
	            if ($('#homePageTabs').tabs('exists', titles[i])) {
	                $('#homePageTabs').tabs('close', titles[i]);
	            }
	        }
	    },
	    //刷新指定Tab的内容
	    refreshTab : function(title, url) {
	        if ($('#homePageTabs').tabs('exists', title)) {
	            var currTab = $('#homePageTabs').tabs('getTab', title), 
	                iframe = $(currTab.panel('options').content), 
	                content = '<iframe scrolling="auto" frameborder="0"  src="' + (url?url:iframe.attr('src')) + '" style="width:100%;height:99%;"></iframe>';
	            $('#homePageTabs').tabs('update', {
	                tab : currTab,
	                options : {
	                    content : content,
	                    closable : true
	                }
	            });
	            $('#homePageTabs').tabs('select', title);
	        }
	    }
	};

/***/ }

});