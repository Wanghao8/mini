<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/4/3 0003
 * Time: 下午 3:21
 */
namespace app\index\controller;
use think\Controller;

class Index extends Controller
{
    public function index(){

        return $this->fetch();
    }

    public function about(){
        return $this->fetch();
    }

    public function cards(){
        return $this->fetch();
    }

    public function coach_full(){
        return $this->fetch();
    }

    public function coaches(){
        return $this->fetch();
    }

    public function contact(){
        return $this->fetch();
    }

    public function gallery(){
        return $this->fetch();
    }

    public function test(){
        return $this->fetch();
    }



}