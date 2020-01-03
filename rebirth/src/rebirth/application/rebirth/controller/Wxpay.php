<?php

/**

 * Created by PhpStorm.

 * User: my

 * Date: 2019/3/4

 * Time: 16:00

 */



namespace app\rebirth\controller;





use think\Controller;

use think\Db;



class Wxpay extends UserBase

{





    /**

     * 获取支付配置

     */

    public function getconfig(){

 // return m_error($msg='充值已关闭',$code=100,$data='提示');


        $charge=Enum::charge();



        $type=input('type');

        if(!array_key_exists($type,$charge)){

            return m_error('参数有误');

        }else{

            $charge=$charge[$type];

        }





        $num=input('num');

        if(!is_numeric($num) || $num<1){

            $num=1;

        }



        //是否是赠礼消费

        $gift=input('gift_id');

        if(!$gift || !is_numeric($gift)){

            $gift=0;

        }



        $time=strval(time());

        $uid=$this->uid;

        $res['appid']=config('rebirth.appid');

        $res['timeStamp']=$time;

        $res['nonceStr']=md5($time);

        $value=$charge['price']*100*$num;


        //使用余额

        $use_point=input('use_point');



        if($use_point==1){



            $proceeds=Db::name('member_info')

                ->where('id',$uid)

                ->value('proceeds');

            if($value>$proceeds){

                $value=$value-$proceeds;



            }else{

                //上级id

                $pid=Db::name('member_info')->where('id',$uid)->value('pid');

                //上上级id

                $gid=Db::name('member_info')->where('id',$pid)->value('pid');



                $bonus=$charge['time']*$num;





                if($gift==0){

                    //用户加时间

                    $end_time=Db::name('member_info')->where('id',$uid)->value('end_time');

                    if($end_time<time()){

                        $end_time=time()+$bonus;

                    }else{

                        $end_time=$end_time+$bonus;

                    }

                    Db::name('member_info')->where('id',$uid)->update(['end_time'=>$end_time]);

                    //加时间记录

                    Db::name('member_log')->insert([

                        'member_id'=>$uid,

                        'type'=>1,

                        'value'=>$bonus,

                        //            'order_no'=>$out_trade_no,

                        'desc'=>'用户充值加时间',

                        'desc_type'=>3,

                        'create_time'=>time()

                    ]);

                }else{

                    //赠品卡处理

                    $gift_id=$gift;

                    if($gift_id>0){

                        $gift=Enum::gift();

                        $gift=$gift[$gift_id];

                        for ($i=0;$i<$num;$i++){

                            Db::name('market_gift')

                                ->insert([

                                    'uid'=>$uid,

                                    'value'=>$bonus/$num,

                                    'price'=>$value,

                                    'gift_id'=>$gift_id,

                                    'gift_image'=>$gift['image'],

                                    'gift_title'=>$gift['title'],

                                    'gift_info'=>$gift['info'],

                                    'gift_no'=>makecard($uid),

                                    'status'=>1,

                                    'create_time'=>time(),

                                    'update_time'=>time(),

                                    'type'=>$type

                                ]);

                        }



                    }

                }





                //上级用户加钱及记录

                $p_value=$charge['price']*0.1;

                Db::name('member_info')->where('id',$pid)->setInc('proceeds',$p_value);

                Db::name('member_log')->insert([

                    'member_id'=>$pid,

                    'relate_uid'=>$uid,

                    'type'=>2,

                    'value'=>$p_value,

                //    'order_no'=>$out_trade_no,

                    'desc'=>'子用户充值加余额',

                    'desc_type'=>1,

                    'create_time'=>time()

                ]);



                //上上级用户加钱及记录

                $g_value=$charge['price']*0.02;

                Db::name('member_info')->where('id',$gid)->setInc('proceeds',$g_value);

                Db::name('member_log')->insert([

                    'member_id'=>$gid,

                    'relate_uid'=>$pid,

                    'type'=>2,

                    'value'=>$g_value,

                 //   'order_no'=>$out_trade_no,

                    'desc'=>'二级子用户充值加余额',

                    'desc_type'=>2,

                    'create_time'=>time()

                ]);



                //余额处理

                Db::name('member_info')

                    ->where('id',$uid)

                    ->setDec('proceeds',$value);

                Db::name('member_log')->insert([

                    'member_id'=>$uid,

                    'type'=>2,

                    'value'=>$value*(-1),

                    'desc'=>'购买减余额',

                    'desc_type'=>6,

                    'create_time'=>time(),

                ]);

                return m_success('','余额支付成功',201);

            }





        }



        $wx_order=$this->unifiedorder($value,$uid,$type,$num,$gift);









        $res['package']='prepay_id='.$wx_order['prepay_id'];

        $res['signType']='MD5';

        $str='appId='.$res['appid'].'&nonceStr='.$res['nonceStr'].'&package='.$res['package'].'&signType=MD5&timeStamp='.$res['timeStamp'].'&key='.config('rebirth.paysecret');

        $res['paySign']=MD5($str);

        return m_success($res);



    }



    /**********

     * 下单接口

     */

    public function unifiedorder($value,$uid,$type,$num,$gift=0){



        $ip=getIp();



        $out_trade_no=order_sn();

        $host=$_SERVER['SERVER_NAME'];





        $openid=Db::name('member_info')->where('id',$uid)->value('openid');



        $data=array(

            'appid' => config('rebirth.appid'),

            'mch_id' => config('rebirth.mchid'),

            'nonce_str' => md5(rand(1,9999)),

            'body' => 'ugigg',

            'out_trade_no' => $out_trade_no,//商户订单号

            'total_fee' =>$value,

            'spbill_create_ip' => $ip,

            'notify_url' => 'https://'.$host.'/rebirth/callback',

            'trade_type' => 'JSAPI',

            'openid' => $openid,

        );





//        $enum=$this->enum;

//        $points=$enum[$price];

//

        $insert['uid']=$uid;

        $insert['price']=$value;

        $insert['create_time']=time();

        $insert['out_trade_no']=$data['out_trade_no'];

        $insert['nonce_str']=$data['nonce_str'];

        $insert['total_fee']=$data['total_fee'];

        $insert['spbill_create_ip']=$data['spbill_create_ip'];

        $insert['openid']=$data['openid'];

        $insert['is_pay']=0;

        $insert['type']=$type;

        $insert['num']=$num;

        $insert['gift_id']=$gift;



        $secrect_key = config('rebirth.paysecret');///这个就是个API密码。32位的。。随便MD5一下就可以了

        $data = array_filter($data);

        ksort($data);

        $str = '';

        foreach ($data as $k => $v) {

            $str .= $k . '=' . $v . '&';

        }

        $str .= 'key=' . $secrect_key;

        $data['sign'] =strtoupper(md5($str));







        $xml =$this->arraytoxml($data);





        $url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';



        $res=myCurl($url,1,$xml);





       // $res =$this->curl($xml, $url);

        $res =$this->xmltoarray($res);

      



//        cache(222,$insert,600);

        Db::name('wx_trade')->insert($insert);

        return $res;

//        $prepay_id=$res['prepay_id'];

//        return $prepay_id;





    }



    /***

     * 提现到用户零钱

     * @param $openid

     * @param $val

     * @param $create_time

     * @return array

     */

    public function tixian($openid='oWLnH5aw99MBvWpSJj6pXgGWLtH0',$val=1,$create_time=1551804683)

    {

        //exit;

//        $ip=getIp();

//        if($ip!='221.14.189.131'){

//            exit;

//        }

        $ip=getIp();

        //结算

        $data = array(

            'mch_appid' => config('wx.appid'),//商户账号appid

            'mchid' => config('wx.mchid'),//商户号

            'nonce_str' => md5(rand(1,9999)),//随机字符串

            'partner_trade_no' => date("YmdHis") . rand(10000, 90000) . rand(10000, 90000),//商户订单号

            'openid' => $openid,//用户openid

            'check_name' => 'NO_CHECK',//校验用户姓名选项,

            're_user_name' => '猫熊',//收款用户姓名

            'amount' => $val,//金额

            'desc' => 'jia选积分商城提现',//企业付款描述信息

            'spbill_create_ip' => $ip,//Ip地址

        );

        $secrect_key = config('wx.paysecret');///这个就是个API密码。32位的。。随便MD5一下就可以了

        $data = array_filter($data);

        ksort($data);

        $str = '';

        foreach ($data as $k => $v) {

            $str .= $k . '=' . $v . '&';

        }

        $str .= 'key=' . $secrect_key;

        $data['sign'] = md5($str);

        $xml =$this->arraytoxml($data);

        // echo $xml;

        $url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers';

        $res =$this->curl($xml, $url);

        $return =$this->xmltoarray($res);

        halt($return);





        $return['create_time']=time();

        $return['openid']=$openid;

        $return['value']=$val;







        try{

            Db::name('pay_record')->insert($return);

        }catch (\Exception $e){

            $msg=$e->getMessage();

            errorlog($msg,$return);



        }





        $res=strtolower($return['result_code']);

        // halt($res);



        if($res!='fail'){

            $obj=new Template();

            $obj->paytemplate($openid,$val,$create_time);

            $re=array('status'=>1,'msg'=>'success');



        }else{

            $re=array('status'=>-1,'msg'=>$return['err_code_des']);

        }

        return $re;

    }









    public function arraytoxml($data){

        $str='<xml>';

        foreach($data as $k=>$v) {

            $str.='<'.$k.'>'.$v.'</'.$k.'>';

        }

        $str.='</xml>';

        return $str;

    }



    public function xmltoarray($xml) {

        //禁止引用外部xml实体

        libxml_disable_entity_loader(true);

        $xmlstring = simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA);

        $val = json_decode(json_encode($xmlstring),true);

        return $val;

    }





    public function curl($param="",$url)

    {



        $dir=dirname(dirname(dirname(dirname(__FILE__))));

        $postUrl = $url;

        $curlPost = $param;

        $ch = curl_init();                                      //初始化curl

        curl_setopt($ch, CURLOPT_URL, $postUrl);                 //抓取指定网页

        curl_setopt($ch, CURLOPT_HEADER, 0);                    //设置header

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);            //要求结果为字符串且输出到屏幕上

        curl_setopt($ch, CURLOPT_POST, 1);                      //post提交方式

        curl_setopt($ch, CURLOPT_POSTFIELDS, $curlPost);           // 增加 HTTP Header（头）里的字段

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);        // 终止从服务端进行验证

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

        curl_setopt($ch, CURLOPT_SSLCERT,$dir.'/public/static/cert/apiclient_cert.pem'); //这个是证书的位置绝对路径

        curl_setopt($ch, CURLOPT_SSLKEY,$dir.'/public/static/cert/apiclient_key.pem'); //这个也是证书的位置绝对路径

        $data = curl_exec($ch);                                 //运行curl

        curl_close($ch);

        return $data;

    }



}