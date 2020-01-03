<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/4/10 0010
 * Time: 下午 2:20
 */

namespace app\rebirth\controller;


class Test
{
    public function index($date='1992-08-10'){
        $start=strtotime($date);
        $end=$start+(10000*24*60*60);
        $res=date('Y-m-d',$end);
        echo '你来到这个世界上的10000天的日子是【'.$res.'】';
    }

}