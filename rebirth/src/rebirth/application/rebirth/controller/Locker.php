<?php

/**

 * Created by PhpStorm.

 * User: Administrator

 * Date: 2019/4/16 0016

 * Time: 上午 10:19

 */



namespace app\rebirth\controller;





use think\Db;



class Locker extends UserBase

{



//    public function sendsms(){

////        $arr=array(

////            'uid'=>'poower',

////            'key'=>'d41d8cd98f00b204e980',

////            'smsMob'=>'13526415290',

////            'smsText'=>'要到期了',

////        );

//      //  $url='http://utf8.api.smschinese.cn/?Uid=poower&Key=d41d8cd98f00b204e980&smsMob=15036095772&smsText=你的柜子要到期了【Rebirth】';

//       // $res=myCurl($url);

//        halt($res);

//    }





    public function test($id='0101'){

//1100011268  16

//1100011413  24

//1100011403  16

//1100011414  24



            $locker_id=10;

            $locker_command=Enum::locker_command();

            $lockAddress=$locker_command[$locker_id];

            $arr=array(

                'deviceId'=>1100011403,

                'lockTotalNum'=>1,

                'lockAddress'=>$id,

                'commandType'=>'openOne',

                'sourceType'=>'O',

                'uqKey'=>config('rebirth.sark'),

            );

            $res=myCurl('http://cos.wondware.com/mq/device/service',1,$arr);

        header('content-type:application/json');

            echo $res;exit;





    }



    /**

     * 柜子开门

     */

    public function open(){

        $uid=$this->uid;

        $locker_end_time=Db::name('member_info')->where('id',$uid)->value('locker_end_time');

        if($locker_end_time<time()){

            Db::name('member_info')->where('id',$uid)->update(['locker_store_id'=>0,'locker_id'=>0]);

            return m_error('您柜子已到期');

        }
        $locker_store_id=Db::name('member_info')->where('id',$uid)->value('locker_store_id');
        $locker_id=Db::name('member_info')->where('id',$uid)->value('locker_id');
        $deviceld='1100010614';
        $locker_command=Enum::locker_command();
        if($locker_store_id=='5'){
            $deviceld=$locker_id<16?'1100011403':'1100011413';
            $locker_command=Enum::locker_command2();
        }
        if($locker_store_id=='6'){
            $deviceld=$locker_id<16?'1100011268':'1100011414';
            $locker_command=Enum::locker_command3();
        }
        $lockAddress=$locker_command[$locker_id];
        $arr=array(

            'deviceId'=>$deviceld,

            'lockTotalNum'=>1,

            'lockAddress'=>$lockAddress,

            'commandType'=>'openOne',

            'sourceType'=>'O',

            'uqKey'=>config('rebirth.sark'),

        );
        myCurl('http://cos.wondware.com/mq/device/service',1,$arr);
        return m_success('',$locker_id.'号柜子已开');
    }

    /**

     * 获取支付配置

     */

    public function getconfig(){

        $charge=Enum::locker_charge();





        $type=input('type');

        if(!array_key_exists($type,$charge)){

            return m_error('参数有误');

        }

        $num=input('num');

        if(!is_numeric($num) || $num<1){

            $num=1;

        }

        $store_id=input('store_id');

        if(!is_numeric($store_id)){

            return m_error('健身房id有误');

        }



        $time=strval(time());

        $uid=$this->uid;

        $res['appid']=config('rebirth.appid');

        $res['timeStamp']=$time;

        $res['nonceStr']=md5($time);

        $value=$charge[$type]*100*$num;

        //使用余额

        $use_point=input('use_point');



        if($use_point==1){

            $proceeds=Db::name('member_info')

                ->where('id',$uid)

                ->value('proceeds');



            if($value>$proceeds){

                $value=$value-$proceeds;



            }else{

                if($type=='year'){

                    $bonus=60*60*24*365;

                    $comment='购买柜子包年';

                }elseif ($type=='season'){

                    $bonus=60*60*24*30*3;

                    $comment='购买柜子包季';

                }elseif ($type=='month'){

                    $bonus=60*60*24*30;

                    $comment='购买柜子包月';

                }







                $store_id=$store_id;





                $locker_done_ids=Db::name('member_info')

                    ->where('locker_store_id',$store_id)

                    ->column('locker_id');

                $arr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49];
                if($store_id!='3'){
                    $arr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
                }
                $arr=array_diff($arr,$locker_done_ids);

                $locker_id=array_rand($arr);



                $locker_end_time=Db::name('member_info')->where('id',$uid)->value('locker_end_time');

                if($locker_end_time>time()){

                    $locker_end_time=$locker_end_time+$bonus;

                    Db::name('member_info')->where('id',$uid)

                        ->update([

                            'locker_end_time'=>$locker_end_time,

                            'locker_store_id'=>$store_id,

                            'locker_expire_warn'=>1,

                        ]);

                }else{



                    $locker_end_time=time()+$bonus;

                    Db::name('member_info')->where('id',$uid)

                        ->update([

                            'locker_end_time'=>$locker_end_time,

                            'locker_id'=>$locker_id,

                            'locker_store_id'=>$store_id,

                            'locker_expire_warn'=>1,

                        ]);

                }



                Db::name('member_charge')->insert([

                    'member_id'=>$uid,

                    'type'=>2,

                    'order_no'=>order_sn(),

                    'comment'=>$comment,

                    'bonus'=>$bonus,

                    'trade_value'=>$value,

                    'create_time'=>time(),

                    'update_time'=>time(),

                    'status'=>1,



                ]);

                return m_success('','余额支付成功',201);

            }





        }

        $wx_order=$this->unifiedorder($value,$uid,$type,$num,$store_id);



        $res['package']='prepay_id='.$wx_order['prepay_id'];

        $res['signType']='MD5';

        $str='appId='.$res['appid'].'&nonceStr='.$res['nonceStr'].'&package='.$res['package'].'&signType=MD5&timeStamp='.$res['timeStamp'].'&key='.config('rebirth.paysecret');

        $res['paySign']=MD5($str);

        return m_success($res);



    }



    /**********

     * 下单接口

     */

    public function unifiedorder($value,$uid,$type,$num,$store_id){



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

            'notify_url' => 'https://'.$host.'/rebirth/callback/locker',

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

        $insert['store_id']=$store_id;



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