<?php
/**
 * 微信端授权登陆用户信息
 * 前台直接无参数调用，服务器生成微信签名包
 * last_author huangluan
 */
class Wxoauth
{
    public function __construct()
    {

    }
    //获取用户信息,这里是获取用户信息
    public function user_info($code)
    {
        //1. 判断来源 赋值appid
        include_once APPPATH . 'libraries/account/wechat.php';
        $appid=$appidm;
        $appsecret=$appsecretm;
        //2. 获取access_token 信息
        $url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" . $appid . "&secret=" . $appsecret . "&code=" . $code . "&grant_type=authorization_code";
        $tokendata = $this->http_curl($url, 'get', 'json', '');
        if (isset($tokendata['errcode'])) {
            return $tokendata;
        }
        //3. 获取用户信息
        $url = "https://api.weixin.qq.com/sns/userinfo?access_token=".$tokendata['access_token']."&openid=".$tokendata['openid']."&lang=zh_CN";
        $res = $this->http_curl($url, 'get', 'json', '');
        return $res;
    }

    //定义curl方法，用于调用接口
    public function http_curl($url, $request_type = 'get', $data_type = 'json', $arr = '')
    {
        $ch = curl_init(); //初始化curl
        curl_setopt($ch, CURLOPT_URL, $url); //定义一些curl参数
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        if ($request_type == 'post') { //如果是post请求
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $arr);
        }
        $output = curl_exec($ch); //执行请求
        if ($data_type == 'json') {
            if (curl_errno($ch)) { //如果请求出错，返回错误信息
                return curl_error($ch);
            } else { //请求成功获取数据
                $res = json_decode($output, true);
            }
            curl_close($ch); //curl关闭
            return $res; //返回数据
        }
    }
}
