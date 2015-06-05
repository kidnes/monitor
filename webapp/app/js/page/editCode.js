$('#codeList').datagrid({
    title: 'code码编辑管理',
    iconCls: 'icon-search',
    toolbar: '#local_frag_tb',
    width: 'auto',
    height: 'auto',
    fit: true,
    border: false,
    singleSelect: true,
    data: codeMap,
    // url: '/api/getCodeMap',
    method: 'get',
    columns: [[{
        field: 'code',
        title: 'code码',
        width: 120
    },{
        field: 'message',
        title: '错误信息',
        width: 300
    },{
        field: 'opt',
        title: '操作',
        width: 300,
        align: 'center',
        formatter: function(value, row, index) {
            return '<a href="javascript:;" onclick="cms.editPublicFrag('+index+')" style="cursor: pointer">维护</a>&nbsp;&nbsp;'+
            '<a href="javascript:;" onclick="cms.editPublicFragContent('+index+')" style="cursor: pointer">内容</a>';
        }
    }]]
})