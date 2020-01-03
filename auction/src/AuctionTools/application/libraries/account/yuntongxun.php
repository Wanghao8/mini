<?php
//云通讯短信账号密码及配置
//主帐号,对应开官网发者主账号下的 ACCOUNT SID
    $accountSid= 'aaf98f894ee35d30014ef6bd199b14fc';

    //主帐号令牌,对应官网开发者主账号下的 AUTH TOKEN
    $accountToken= 'e30f6555cfe64d89afffda4b2b17c649';

    //应用Id，在官网应用列表中点击应用，对应应用详情中的APP ID
    //在开发调试的时候，可以使用官网自动为您分配的测试Demo的APP ID
    $appId='8a48b5514f3a7d0b014f3fea6d960d5d';

    //请求地址
    //沙盒环境（用于应用开发调试）：sandboxapp.cloopen.com
    //生产环境（用户应用上线使用）：app.cloopen.com
    $serverIP='app.cloopen.com';


    //请求端口，生产环境和沙盒环境一致
    $serverPort='8883';

    //REST版本号，在官网文档REST介绍中获得。
    $softVersion='2013-12-26';
    