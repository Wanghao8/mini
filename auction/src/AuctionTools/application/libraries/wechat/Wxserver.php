<?php
class Wxserver
{
    public function __construct()
    {
        
    }
    //推送消息
    public function push_message($openid, $url, $template_id, $title = '', $keyword1 = '', $keyword2 = '', $keyword3 = '', $keyword4 = '', $keyword5 = '', $remark = '')
    {
        include APPPATH . "libraries/wechat/Wxjssdk.php";
        $jssdk = new JSSDK();
        $acc_token = $jssdk->getJsApiTicket();
        $wx_url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' . $acc_token;
        $data = [
            'touser' => $openid,
            'template_id' => $template_id,
            'url' => $url,
            'topcolor' => '#FF0000',
            'data' => [
                'first' => [
                    'value' => $title,
                    'color' => '#173177',
                ],
                'keyword1' => [
                    'value' => $keyword1,
                    'color' => '#173177',
                ],
                'keyword2' => [
                    'value' => $keyword2,
                    'color' => '#173177',
                ],
                'keyword3' => [
                    'value' => $keyword3,
                    'color' => '#173177',
                ],
                'keyword4' => [
                    'value' => $keyword4,
                    'color' => '#173177',
                ],
                'keyword5' => [
                    'value' => $keyword5,
                    'color' => '#173177',
                ],
                'remark' => [
                    'value' => $remark,
                    'color' => '#173177',
                ],
            ],
        ];
        $res = $this->http_curl($wx_url, 'post', 'json', json_encode($data)); //这是自己写的curl方法，用于调用接口
        if ($res['errcode'] == 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * [http_curl 通用Curl方法]
     * @param  [type] $url          [传入请求url地址]
     * @param  string $request_type [发送请求类型，默认get]
     * @param  string $data_type    [返回数据格式，默认json]
     * @param  any    $arr          [post可能传入参数,默认为空]
     * @return [type]               [返回值]
     */
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
