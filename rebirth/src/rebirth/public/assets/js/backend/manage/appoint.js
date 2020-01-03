define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'manage/appoint/index',
                    add_url: 'manage/appoint/add',
                    edit_url: 'manage/appoint/edit',
                    del_url: 'manage/appoint/del',
                    multi_url: 'manage/appoint/multi',
                    table: 'manage_appoint',
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
                        {field: 'member_id', title: __('Member_id')},
                        {field: 'store_id', title: __('Store_id')},
                        {field: 'year', title: __('Year')},
                        {field: 'month', title: __('Month')},
                        {field: 'day', title: __('Day')},
                        {field: 'hour', title: __('Hour')},
                        {field: 'section', title: __('Section')},
                        {field: 'create_time', title: __('Create_time'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'update_time', title: __('Update_time'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'status', title: __('Status')},
                        {field: 'visit', title: __('Visit')},
                        {field: 'appoint_time', title: __('Appoint_time'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
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