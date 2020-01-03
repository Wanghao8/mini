<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/3/20 0020
 * Time: 上午 11:02
 */

namespace app\rebirth\controller;


class GetAccessToken
{
    /**
     * 获取access_token
     * @return \think\response\Json
     */
    public function index(){
        $acctoken=cache('rebirth_acctoken');

        if(!$acctoken){
            $appid=config('rebirth.appid');
            $appsecret=config('rebirth.appsecret');
            $url="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$appid."&secret=".$appsecret;
            $res=myCurl($url);
            $res=json_decode($res,true);
            $acctoken=$res['access_token'];
            cache('rebirth_acctoken',$acctoken,7000);
        }

        $arr=array(
            'access_token'=>$acctoken
        );
        return m_success($arr);
    }

    /**
     * 内部调用
     */
    public static function get(){
        $acctoken=cache('rebirth_acctoken');

        if(!$acctoken){
            $appid=config('rebirth.appid');
            $appsecret=config('rebirth.appsecret');
            $url="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$appid."&secret=".$appsecret;
            $res=myCurl($url);
            $res=json_decode($res,true);
            $acctoken=$res['access_token'];
            cache('rebirth_acctoken',$acctoken,7000);
        }

        $arr=array(
            'access_token'=>$acctoken
        );
        return $arr['access_token'];
    }



}