webpackJsonp([0,7],[function(t,a,n){t.exports=n(1)},function(t,a,n){function o(){var t=[];for(var a in dayCount[0])"day"==a?t.unshift({field:a,title:"日期",width:80}):t.push({field:a,title:a,align:"right",width:120,formatter:u.formatData});for(var n={},o=0;o<dayCount.length;o++){var a=dayCount[o];for(var d in a)n[d]=isNaN(n[d])?a[d]:n[d]+a[d]}n.day="总计",dayCount.push(n),i({columns:t,data:dayCount})}function i(t){$("#dg").datagrid({width:"auto",height:"auto",singleSelect:!0,fitColumns:!0,data:t.data,columns:[t.columns]})}var u=n(2);o()},function(t,a){function n(t,a){return(t+"").replace(/(\d)(?=(?:\d{3})+$)/g,"$1,")}a.formatData=n}]);