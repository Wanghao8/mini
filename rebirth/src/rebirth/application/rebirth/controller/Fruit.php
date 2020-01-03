<?php


namespace app\rebirth\controller;


class Fruit
{
    public function index(){
        $t=time()%60;
        if($t<30){
            return 1;
        }

    }

}