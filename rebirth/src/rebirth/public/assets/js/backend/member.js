define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'member/index',
                    add_url: 'member/add',
                    edit_url: 'member/edit',
                    del_url: 'member/del',
                    multi_url: 'member/multi',
                    table: 'member',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'pid', title: __('Pid')},
                        {field: 'openid', title: __('Openid')},
                        {field: 'unionid', title: __('Unionid')},
                        {field: 'ip', title: __('Ip')},
                        {field: 'phone', title: __('Phone')},
                        {field: 'nickName', title: __('Nickname')},
                        {field: 'avatarUrl', title: __('Avatarurl'), formatter: Table.api.formatter.url},
                        {field: 'proceeds', title: __('Proceeds')},
                        {field: 'card_no', title: __('Card_no')},
                        {field: 'share_ercode', title: __('Share_ercode')},
                        {field: 'loginnum', title: __('Loginnum')},
                        {field: 'visit_num', title: __('Visit_num')},
                        {field: 'end_time', title: __('End_time'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'login_time', title: __('Login_time'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'create_time', title: __('Create_time'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'status', title: __('Status')},
                        {field: 'new', title: __('New')},
                        {field: 'gift_end_time', title: __('Gift_end_time'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'total_amount', title: __('Total_amount')},
                        {field: 'children_total_amount', title: __('Children_total_amount')},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});