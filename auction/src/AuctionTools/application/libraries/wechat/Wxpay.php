<?php
/**
 * 获取微信页面授权签名包
 * 前台直接无参数调用，服务器生成微信签名包
 * last_author huangluan
 */
class Wxpay 
{
    public function __construct() {
        include_once APPPATH.'libraries/account/wechat.php';
        $this->appid = $appidmini;
        $this->appsecret = $appsecretmini;
        $this->mch_id = $mch_idmini;
        $this->apikey = $apikeymini;
    }

    /**
     * JSAPI获取prepay_id
     * @param $body
     * @param $out_trade_no
     * @param $total_fee
     * @param $notify_url
     * @param $openid
     * @return null
     */
    public function payOrder($params) {
        //预付订单获取
        $wx_order=$this->unifiedorder($params);
        if (!($wx_order["return_code"] == "SUCCESS" && $wx_order["result_code"] == "SUCCESS")){
            return $this->actionres(false, 'unifiedorderError', '预付单生成错误！'.$wx_order["return_code"] ,$wx_order["return_msg"]);
        }
        //组装前台参数
        $time=strval(time());
        $res['appid']=$this->appid;
        $res['timeStamp']=$time;
        $res['nonceStr']=md5($time);
        $res['package']='prepay_id='.$wx_order['prepay_id'];
        $res['signType']='MD5';
        $str='appId='.$res['appid'].'&nonceStr='.$res['nonceStr'].'&package='.$res['package'].'&signType=MD5&timeStamp='.$res['timeStamp'].'&key='.$this->apikey;
        $res['paySign']=MD5($str);
        return $this->actionres(true, 'success', '预付单生成成功',$res);
    }

    /**
     * 统一下单接口 前台执行添加订单后的数据
     */
    public function unifiedOrder($params) {
        //1. 组装统一下单参数
        $data = array();
        $data["appid"] = $this->appid;
        $data["mch_id"] =$this->mch_id;
        $data["nonce_str"] =md5(rand(1,99999));
        $data["body"] =$params['body'];
        $data["out_trade_no"]=$params['out_trade_no'];
        $data["total_fee"]=$params['total_fee'];
        $data["spbill_create_ip"] =isset($_SERVER['SERVER_ADDR'])?$_SERVER['SERVER_ADDR']:'121.41.29.178';
        $data["notify_url"] =$params['notify_url'];
        $data["trade_type"] ="JSAPI";
        $data["openid"] =$params['openid'];
        //2. 对参数进行签名
        ksort($data);
        $str = '';
        foreach ($data as $k => $v) {
            $str.=$k.'='.$v.'&';
        }
        $str.='key='.$this->apikey;
        $data['sign'] =strtoupper(md5($str));
        //3. 执行下单信息提交
        $result = $this->post("https://api.mch.weixin.qq.com/pay/unifiedorder", $data);
        return $result;
    }

    //数据提交post
    private function post($url, $data) {
        $xml = $this->array2xml($data);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $url);
        $content = curl_exec($ch);
        $array = $this->xml2array($content);
        return $array;
    }

    //数组转xml
    private function array2xml($array) {
        $xml = "<xml>" . PHP_EOL;
        foreach ($array as $k => $v) {
            if($v && trim($v)!='')
                $xml .= "<$k><![CDATA[$v]]></$k>" . PHP_EOL;
        }
        $xml .= "</xml>";
        return $xml;
    }

    //xml转数据
    private function xml2array($xml) {
        $array = array();
        $tmp = null;
        try{
            $tmp = (array) simplexml_load_string($xml);
        }catch(Exception $e){}
        if($tmp && is_array($tmp)){
            foreach ( $tmp as $k => $v) {
                $array[$k] = (string) $v;
            }
        }
        return $array;
    }

    //返回格式重构
    public function actionres($res, $code, $msg = '', $data = null)
    {
        $result = array(
            'res' => $res,
            'code' => $code,
            'msg' => $msg,
            'data' => $data,
        );
        echo json_encode($result);
        exit;
    }
}