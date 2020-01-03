<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/5/11 0011
 * Time: 上午 10:24
 */

namespace app\rebirth\controller;


use think\Controller;
use think\response\Json;

class Wx extends Controller
{
    public function template(){
        $url='https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='.GetAccessToken::get();
        $data=array(
            'template_id' => 'KdcKu1kEp-2ac0rjokEHev6CS_LLuRZWhPkMxs8wAKg',
            'touser' => 'o_vEB5WnzT2SN7mXIKUXkom3_myg',
            'form_id' => '1',
        );
        $data=json_encode($data);
        $res=myCurl($url,1,$data);
        return $res;

    }

    public function acctoken(){
        $res=myCurl('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.config('rebirth.wx_appid').'&secret='.config('rebirth.wx_appsecret'));
        $res=json_decode($res,true);

        return $res['access_token'];
    }

    public function news($page=1){
        $offset=10*($page-1);
        $accesstoken=$this->acctoken();
        $data=array(
            'type'=>'news',
            'offset'=>$offset,
            'count'=>10,
        );
        $data=json_encode($data);

        $res=myCurl('https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token='.$accesstoken,1,$data);
        return $res;
    }

}