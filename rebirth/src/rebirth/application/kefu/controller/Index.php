<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/4/12 0012
 * Time: 下午 3:40
 */
namespace app\kefu\controller;
use think\Controller;
class Index extends Controller
{
    public function index(){
        return $this->fetch();
    }

}