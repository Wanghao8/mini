<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/4/12 0012
 * Time: 下午 12:38
 */

namespace app\admin\controller;


use app\common\controller\Backend;

class Custom extends Backend
{
    public function index(){
//       return $this->redirect('http://kefu.easemob.com');
        return $this->fetch();
    }

}