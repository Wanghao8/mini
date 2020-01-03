<?php
/**
 * 微信端授权登陆用户信息
 * 前台直接无参数调用，服务器生成微信签名包
 * last_author huangluan
 */
class Wxmini
{
    public function __construct()
    {

    }
    
    //获取用户信息,这里是获取用户信息
    public function code2Session($code)
    {
        //1. 判断来源 赋值appid
        include_once APPPATH . 'libraries/account/wechat.php';
        $appid=$appidmini;
        $appsecret=$appsecretmini;
        //2. 获取access_token 信息
        $url = "https://api.weixin.qq.com/sns/jscode2session?appid=".$appid."&secret=".$appsecret."&js_code=".$code."&grant_type=authorization_code";
        $resdata = $this->http_curl($url, 'get', 'json', '');
        return $resdata;
    }

    //解密用户手机号
    public function decryptPhone($encryptedData,$iv,$sessionKey)
    {
        //1. 判断来源 赋值appid
        include_once APPPATH . 'libraries/account/wechat.php';
//        $appid='wxf6bbcc171e7293e1';
        //$appid='wx4f4bc4dec97d474b';
        $appid=$appidmini;
        //2. 获取access_token 信息
        include_once APPPATH . 'libraries/wechat/wxphone/WXBizDataCrypt.php';
        $pc = new WXBizDataCrypt($appid, $sessionKey);
        $errCode = $pc->decryptData($encryptedData,$iv,$data);
        if ($errCode == 0) {
            return array('res' =>true,'code' =>'sucess','msg' =>'解密成功','data' => $data);
        }
        return array('res' =>false,'code' =>'error','msg' =>'解密失败，错误代码'.$errCode,'data' => $data);
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

    //生成小程序二维码
    public function qrcode($p_acc_id)
    {
        //1. 判断来源 赋值appid
        include_once APPPATH . 'libraries/account/wechat.php';
        $appid=$appidmini;
        $appsecret=$appsecretmini;
        //2. 获取access_token 信息
        //获取access_token
        $access_token = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$appsecret";

        //缓存access_token
        @session_start();
        $_SESSION['access_token'] = "";
        $_SESSION['expires_in'] = 0;

        $ACCESS_TOKEN = "";
        if(!isset($_SESSION['access_token']) || (isset($_SESSION['expires_in']) && time() > $_SESSION['expires_in'])){
            $json = $this->httpRequest( $access_token );
            $json = json_decode($json,true);
            // var_dump($json);
            $_SESSION['access_token'] = $json['access_token'];
            $_SESSION['expires_in'] = time()+7200;
            $ACCESS_TOKEN = $json["access_token"];
        }else{
            $ACCESS_TOKEN =  $_SESSION["access_token"];
        }
        //构建请求二维码参数
        //path是扫描二维码跳转的小程序路径，可以带参数?id=xxx
        //width是二维码宽度
        $qcode ="https://api.weixin.qq.com/wxa/getwxacode?access_token=$ACCESS_TOKEN";
        $param = json_encode(array("path"=>"page/store/course_list/course_list?p_acc_id=".$p_acc_id,"width"=> 150));

        //POST参数
        $result = $this->httpRequest( $qcode, $param,"POST");
        //生成二维码
        $filename = date('Ym') . date('d') . uniqid() . mt_rand(99, 999) .".jpg";
        file_put_contents($filename, $result);
        include_once APPPATH . 'libraries/qiniu/Qiniu_upload.php';
        $qiniuup= new Qiniu_upload();
        $fileUrl = $qiniuup->localdata(FCPATH.$filename,$filename);
        if (FCPATH.$filename){
            unlink(FCPATH.$filename);
        }
        return $fileUrl;
    }

    //把请求发送到微信服务器换取二维码
    function httpRequest($url, $data='', $method='GET'){
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
        if($method=='POST'){
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data != ''){
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            }
        }

        curl_setopt($curl, CURLOPT_TIMEOUT, 30);
        curl_setopt($curl, CURLOPT_HEADER, 0);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($curl);
        curl_close($curl);
        return $result;
    }

    //获取地图位置参数
    public function mapDistance($from,$to)
    {
        //2. 获取全部距离信息
        $url="https://apis.map.qq.com/ws/distance/v1/?mode=driving&from=".$from."&to=".$to."&key=VEZBZ-3RWCP-WTBDS-LGTLF-IOCNQ-2AFZP";
        $resdata = $this->http_curl($url, 'get', 'json', '');
        return $resdata;
    }


}
