<?php

return [
    'Id'  =>  '主键',
    'Member_id'  =>  '用户ID,member表外键',
    'Relate_uid'  =>  '关联的uid(desc_type为1为子用户id,为2为二级子用户id)',
    'Type'  =>  '1:时长变化 2：余额变化',
    'Value'  =>  '变化值 1：单位秒 2单位分',
    'Order_no'  =>  '订单号',
    'Desc'  =>  '描述',
    'Desc_type'  =>  '描述区别 1：子用户充值加时间 2：二级子用户充值加余额 3：用户充值加余额；4：取消扣时间；5邀请子用户加时间',
    'Create_time'  =>  '创建时间'
];
