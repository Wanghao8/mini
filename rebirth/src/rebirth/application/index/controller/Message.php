<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/4/5 0005
 * Time: 上午 11:40
 */

namespace app\index\controller;


use think\Controller;
use think\Db;

class Message extends Controller
{
    public function index(){
        $name=input('name')?input('name'):'';
        $tel=input('tel')?input('tel'):'';
        $message=input('message')?input('message'):'';
        $ip=getIp();
        Db::name('message')->insert(['name'=>$name,'tel'=>$tel,'message'=>$message,'ip'=>$ip,'create_time'=>time()]);
        $this->redirect('index/index');
    }

}