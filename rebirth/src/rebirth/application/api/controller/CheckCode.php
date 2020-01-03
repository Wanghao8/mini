<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/3/18 0018
 * Time: 下午 4:32
 */

namespace app\api\controller;


use think\Controller;

class CheckCode extends Controller
{
    public function index(){
        header('Content-Encoding: en');
        //$data=$GLOBALS['HTTP_RAW_POST_DATA'];
        $data=input('post.paramaters');
//        cache('test3',$data,7200);
        $data=json_decode($data,true);

        $str=$data['CodeVal'];
        $str=ds_decrypt($str);
        $str=unserialize($str);
        $open=array(
            'uid'=>$str['member_id'],
            'time'=>$str['time'],
            'sn'=>$data['SN'],
        );

        //验证码有效60秒
//        if((time()-$str['time'])>60){
//            echo '{"UID":"'.$data['UID'].'","Status":0}';exit;
//        }
        //cache($data['SN'],$open,60);

        //存入redis
        redis()->set($data['SN'],serialize($open),60);


        echo '{"UID":"'.$data['UID'].'","Status":1}';


    }


    public function show(){
        $data=cache('test3');
halt($data);

        $data=json_decode($data,true);


        $str=$data['CodeVal'];
        $str=ds_decrypt($str);
        $str=unserialize($str);


        $open=array(
            'uid'=>$str['member_id'],
            'time'=>$str['time'],
            'sn'=>$data['SN'],
        );


        cache($data['SN'],$open,60);


        halt($open);
    }

}