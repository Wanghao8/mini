<?php
/**
 * Created by PhpStorm.
 * User: my
 * Date: 2019/2/13
 * Time: 16:10
 */

namespace app\rebirth\controller;


use think\Controller;

class UserBase extends Base
{
    protected $uid;
    public function _initialize() {
        $uid=input('uid');
        if(!$uid){
            return m_error('用户未登陆',300);
        }else{
            $this->uid=$uid;
        }
    }

}