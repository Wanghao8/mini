<?php
/**
 * 获取微信页面授权签名包
 * 前台直接无参数调用，服务器生成微信签名包
 * last_author huangluan
 */
class Wxjssdk
{
    public function __construct()
    {
        include_once APPPATH.'libraries/account/wechat.php';
        $this->appId = $appidm;
        $this->appSecret = $appsecretm;
    }
    public function getSignPackage()
    {
        $jsapiTicket = $this->getJsApiTicket();
        if (!$jsapiTicket) {
            return "";
        }
        $curl='http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        // 注意 URL 一定要动态获取，不能 hardcode.
        // $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        // $url = "$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        // if (isset($_SERVER["HTTP_REFERER"])) {
        //     $url = $_SERVER["HTTP_REFERER"];
        // }
        $timestamp = time();
        $nonceStr = $this->createNonceStr();
        // 这里参数的顺序要按照 key 值 ASCII 码升序排序
        $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$curl";
        $signature = sha1($string);
        $signPackage = array(
            "debug" => false,
            "appId" => $this->appId,
            "nonceStr" => $nonceStr,
            "timestamp" => $timestamp,
            "signature" => $signature,
            'jsApiList' => array('chooseImage', 'previewImage', 'uploadImage', 'onMenuShareTimeline', 'onMenuShareAppMessage','hideMenuItems','chooseWXPay','scanQRCode'),
        );
        return $signPackage;
    }
    private function createNonceStr($length = 16)
    {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }
    private function getJsApiTicket()
    {
        $data = json_decode($this->get_php_file(APPPATH . "cache/jsapi_ticket.php"));
        if ($data->expire_time < time()) {
            $accessToken = $this->getAccessToken();
            if (!$accessToken) {
                return null;
            }
            $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
            $res = json_decode($this->httpGet($url));
            $ticket = $res->ticket;
            if ($ticket) {
                $data->expire_time = time() + 7000;
                $data->jsapi_ticket = $ticket;
                $this->set_php_file(APPPATH . "cache/jsapi_ticket.php", json_encode($data));
            }
        } else {
            $ticket = $data->jsapi_ticket;
        }

        return $ticket;
    }
    public function getAccessToken()
    {
        $data = json_decode($this->get_php_file(APPPATH . "cache/access_token.php"));
        if ($data->expire_time < time()) {
            $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$this->appId&secret=$this->appSecret";
            $res = json_decode($this->httpGet($url));
            if (!property_exists($res,'access_token')) {
                return null;
            }
            $access_token = $res->access_token;
            if ($access_token) {
                $data->expire_time = time() + 7000;
                $data->access_token = $access_token;
                $this->set_php_file(APPPATH . "cache/access_token.php", json_encode($data));
            }
        } else {
            $access_token = $data->access_token;
        }
        return $access_token;
    }
    private function httpGet($url)
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 2);
        curl_setopt($curl, CURLOPT_TIMEOUT, 500);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 2);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($curl, CURLOPT_URL, $url);
        $res = curl_exec($curl);
        curl_close($curl);
        return $res;
    }
    private function get_php_file($filename)
    {
        return trim(substr(file_get_contents($filename), 15));
    }
    private function set_php_file($filename, $content)
    {
        $fp = fopen($filename, "w");
        fwrite($fp, "<?php exit();?>" . $content);
        fclose($fp);
    }
}
