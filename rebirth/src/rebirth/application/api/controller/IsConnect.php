<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/3/18 0018
 * Time: 下午 2:46
 */

namespace app\api\controller;


use think\Cache;
use think\Controller;

class IsConnect extends Controller
{
    public function index(){
        //$data=$GLOBALS['HTTP_RAW_POST_DATA'];
        $data=input('post.');
        
        $i=cache('i');
        if(!$i){
            $i=1;
            cache('i',$i,7200);
        }else{
            $i++;
            cache('i',$i,7200);
        }

        $time=date('Y-m-d H:i:s',time());
        echo '{"DateTime":"'.$time.'"}';

    }

    public function show(){


        $i=cache('i');

        halt($i);
    }

}