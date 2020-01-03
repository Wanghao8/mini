<?php

/**

 * Created by PhpStorm.

 * User: my

 * Date: 2019/3/5

 * Time: 21:46

 */



namespace app\rebirth\controller;





use think\Controller;

use think\Db;



class Callback extends Base

{



    public function locker(){

//获取返回的xml

        $testxml = file_get_contents("php://input");



//将xml转化为json格式

        $jsonxml = json_encode(simplexml_load_string($testxml, 'SimpleXMLElement', LIBXML_NOCDATA));

//转成数组

        $result = json_decode($jsonxml, true);

        cache(111,$result,300);





        $out_trade_no=$result['out_trade_no'];



        if($result){

            //如果成功返回了

            if($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'SUCCESS'){



                Db::name('wx_trade')->where('out_trade_no',$out_trade_no)

                    ->update([

                        'return_code'=>$result['return_code'],

                        'result_code'=>$result['result_code'],

                        'is_pay'=>1,

                        'time_end'=>$result['time_end'],

                        'transaction_id'=>$result['transaction_id'],

                    ]);



                $data=Db::name('wx_trade')->where('out_trade_no',$out_trade_no)->find();



//扣积分回调

                if($data['total_fee']>$data['price']){

                    $cha=$data['total_fee']-$data['price'];

                    Db::name('member_info')

                        ->where('id',$data['uid'])

                        ->update(['proceeds'=>0]);

                    Db::name('member_log')->insert([

                        'member_id'=>$data['uid'],

                        'type'=>2,

                        'value'=>$cha*(-1),

                        'desc'=>'购买减余额',

                        'desc_type'=>6,

                        'create_time'=>time(),

                    ]);

                }



                $type=$data['type'];

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





                Db::name('member_charge')

                    ->insert([

                        'member_id'=>$data['uid'],

                        'type'=>2,

                        'order_no'=>$data['out_trade_no'],

                        'comment'=>$comment,

                        'bonus'=>$bonus,

                        'trade_value'=>$data['price'],

                        'create_time'=>time(),

                        'update_time'=>time(),

                        'status'=>1,

                    ]);

                $store_id=$data['store_id'];





                $locker_done_ids=Db::name('member_info')

                    ->where('locker_store_id',$store_id)

                    ->column('locker_id');

                $arr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49];
                if($store_id!='3'){
                    $arr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
                }
                $arr=array_diff($arr,$locker_done_ids);

                $locker_id=array_rand($arr);



                $locker_end_time=Db::name('member_info')->where('id',$data['uid'])->value('locker_end_time');

                if($locker_end_time>time()){

                    $locker_end_time=$locker_end_time+$bonus;

                    Db::name('member_info')->where('id',$data['uid'])

                        ->update([

                            'locker_end_time'=>$locker_end_time,

                            'locker_store_id'=>$store_id,

                            'locker_expire_warn'=>1,

                        ]);

                }else{

                    $locker_end_time=time()+$bonus;

                    Db::name('member_info')->where('id',$data['uid'])

                        ->update([

                            'locker_end_time'=>$locker_end_time,

                            'locker_id'=>$locker_id,

                            'locker_store_id'=>$store_id,

                            'locker_expire_warn'=>1,

                        ]);

                }







            }else{

                Db::name('wx_trade')->where('out_trade_no',$out_trade_no)

                    ->update(['return_code'=>$result['return_code'],'return_msg'=>$result['return_msg']]);



            }

        }

        echo '<xml>

              <return_code><![CDATA[SUCCESS]]></return_code>

              <return_msg><![CDATA[OK]]></return_msg>

              </xml>';

    }





    public function index(){
        //获取返回的xml
        $testxml = file_get_contents("php://input");
        //将xml转化为json格式
        $jsonxml = json_encode(simplexml_load_string($testxml, 'SimpleXMLElement', LIBXML_NOCDATA));
        //转成数组
        $result = json_decode($jsonxml, true);
        cache(111,$result,300);

        $out_trade_no=$result['out_trade_no'];
        if($result){
            //如果成功返回了
            if($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'SUCCESS'){
                Db::name('wx_trade')->where('out_trade_no',$out_trade_no)
                    ->update([
                        'return_code'=>$result['return_code'],
                        'result_code'=>$result['result_code'],
                        'is_pay'=>1,
                        'time_end'=>$result['time_end'],
                        'transaction_id'=>$result['transaction_id']
                    ]);
                $data=Db::name('wx_trade')->where('out_trade_no',$out_trade_no)->find();

                //扣积分回调
                if($data['total_fee']>$data['price']){

                    $cha=$data['total_fee']-$data['price'];

                    Db::name('member_info')

                        ->where('id',$data['uid'])

                        ->update(['proceeds'=>0]);

                    Db::name('member_log')->insert([

                        'member_id'=>$data['uid'],

                        'type'=>2,

                        'value'=>$cha*(-1),

                        'desc'=>'购买减余额',

                        'desc_type'=>6,

                        'create_time'=>time(),

                    ]);

                }

                $charge=Enum::charge();
                $charge=$charge[$data['type']];
                $bonus=$charge['time']*$data['num'];

                //次卡处理 直接更改逻辑

                if($data['type']=='time'){

                    $bonus=0;

                    Db::name('member_info')->where('id',$data['uid'])->setInc('once_card',1);

                }
                if($data['type']=='xun'){

                    $bonus=0;

                    Db::name('member_info')->where('id',$data['uid'])->setInc('once_card',12);

                }
                if($data['type']=='hundred'){

                    $bonus=0;

                    Db::name('member_info')->where('id',$data['uid'])->setInc('once_card',150);

                }


                //充值记录添加
                Db::name('member_charge')
                    ->insert([
                        'member_id'=>$data['uid'],
                        'type'=>0,
                        'order_no'=>$out_trade_no,
                        'bonus'=>$bonus,
                        'trade_value'=>$data['total_fee'],
                        'create_time'=>time(),
                        'update_time'=>time(),
                        'status'=>1,
                        'comment'=>$charge['desc']
                    ]);



                //赠品卡处理
                $gift_id=$data['gift_id'];
                if($gift_id>0){

                    $gift=Enum::gift();

                    $gift=$gift[$gift_id];

                    Db::name('market_gift')

                        ->insert([

                            'uid'=>$data['uid'],

                            'value'=>$bonus,

                            'price'=>$data['price'],

                            'gift_id'=>$gift_id,

                            'gift_image'=>$gift['image'],

                            'gift_title'=>$gift['title'],

                            'gift_info'=>$gift['info'],

                            'gift_no'=>makecard($data['uid']),

                            'status'=>1,

                            'create_time'=>time(),

                            'update_time'=>time(),

                        ]);


                    }

                //上级id  14
                $pid=Db::name('member_info')->where('id',$data['uid'])->value('pid');
                //上上级id  36
                $gid=Db::name('member_info')->where('id',$pid)->value('pid');
                //充值金额变化
                Db::name('member_info')->where('id',$data['uid'])->setInc('total_amount',$data['total_fee']);
                //上级用户子用户充值金额变化
                Db::name('member_info')->where('id',$pid)->setInc('children_total_amount',$data['total_fee']);

                //用户加时间
                if($gift_id==0&&$bonus>0){

                    //Db::name('member_info')->where('id',$data['uid'])->setInc('prepare_time',$bonus);

                    //Db::name('member_info')->where('id',$data['uid'])->update(['prepare_start_time'=>time()]);

                   $end_time=Db::name('member_info')->where('id',$data['uid'])->value('end_time');

                   if($end_time<time()){

                       $end_time=time()+$bonus;

                   }else{

                       $end_time=$end_time+$bonus;

                   }

                   Db::name('member_info')->where('id',$data['uid'])->update(['end_time'=>$end_time]);



                    //加时间记录

                    Db::name('member_log')->insert([

                        'member_id'=>$data['uid'],

                        'type'=>1,

                        'value'=>$bonus,

                        'order_no'=>$out_trade_no,

                        'desc'=>'用户充值加时间',

                        'desc_type'=>3,

                        'create_time'=>time()

                    ]);



                }



                //上级用户加钱及记录
                $p_value=$data['price']*0.1;
                Db::name('member_info')->where('id',$pid)->setInc('proceeds',$p_value);
                Db::name('member_log')->insert([
                    'member_id'=>$pid,
                    'relate_uid'=>$data['uid'],
                    'type'=>2,
                    'value'=>$p_value,
                    'order_no'=>$out_trade_no,
                    'desc'=>'子用户充值加余额',
                    'desc_type'=>1,
                    'create_time'=>time()
                ]);



                //上上级用户加钱及记录
                $g_value=$data['price']*0.02;
                Db::name('member_info')->where('id',$gid)->setInc('proceeds',$g_value);
                Db::name('member_log')->insert([
                    'member_id'=>$gid,
                    'relate_uid'=>$pid,
                    'type'=>2,
                    'value'=>$g_value,
                    'order_no'=>$out_trade_no,
                    'desc'=>'二级子用户充值加余额',
                    'desc_type'=>2,
                    'create_time'=>time()
                ]);
            }else{
                Db::name('wx_trade')->where('out_trade_no',$out_trade_no)
                    ->update(['return_code'=>$result['return_code'],'return_msg'=>$result['return_msg']]);
            }

        }

        echo '<xml>

              <return_code><![CDATA[SUCCESS]]></return_code>

              <return_msg><![CDATA[OK]]></return_msg>

              </xml>';

    }



    public function show(){

        $res=cache(111);

        halt($res);

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



}