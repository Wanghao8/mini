<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/3/18 0018
 * Time: 下午 3:35
 */

namespace app\api\controller;


use think\Controller;

class QueryCmdPostData extends Controller
{
    public function index(){
        //$data=$GLOBALS['HTTP_RAW_POST_DATA'];
        $data=input('post.');
        $data=json_decode($data,true);
        cache('test5',$data,600);
    }

    public function show(){
        $data=cache('test5');
        halt($data);
    }

}