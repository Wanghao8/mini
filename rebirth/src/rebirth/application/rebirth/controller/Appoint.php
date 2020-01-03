<?php

/**

 * Created by PhpStorm.

 * User: Administrator

 * Date: 2019/4/1 0001

 * Time: 上午 11:41

 */



namespace app\rebirth\controller;





use think\Controller;

use think\Db;



class Appoint extends Base

{

    //获取健身房列表

    public function storeList($page=1,$limit=20){

        $lat=input('lat')?input('lat'):'34.74568';

        $lon=input('lon')?input('lon'):'113.77647';



        if(!$lat || !$lon){

            return m_error('无经纬度参数');

        }

        $data=Db::name('manage_store')

            ->field('name,address,id,ROUND(

        6378.138 * 2 * ASIN(

            SQRT(

                POW(

                    SIN(

                        (

                            '.$lat.' * PI() / 180 - lat * PI() / 180

                        ) / 2

                    ),

                    2

                ) + COS('.$lat.' * PI() / 180) * COS(lat * PI() / 180) * POW(

                    SIN(

                        (

                            '.$lon.' * PI() / 180 - lon * PI() / 180

                        ) / 2

                    ),

                    2

                )

            )

        ) * 1000

    ) AS distance')

            ->order('distance','asc')

            ->page($page,$limit)

            ->select();



        return m_success($data);

    }



    /**

     * 预约健身界面获取预约状态

     */

    public function status(){

        $date=input('date');

        if(!$date){

            return m_error('缺少date参数');

        }

        $hour=input('hour');

        if(!is_numeric($hour)){

            return m_error('缺少正确的hour参数');

        }

        $date=explode('-',$date);

        $store_id=input('store_id');

        if(!is_numeric($store_id)){

            return m_error('缺少正确的store_id参数');

        }



        $year=$date[0];

        $month=$date[1];

        $day=$date[2];



        $res=Db::name('manage_appoint')

            ->field('COUNT(*) as count,section')

            ->where([

                'year'=>$year,

                'month'=>$month,

                'day'=>$day,

                'hour'=>$hour,

                'store_id'=>$store_id

            ])

            ->group('section')

            ->select()

        ;

        $arr=array(

            1=>0,

            2=>0,

            3=>0,

            4=>0,

            5=>0,

            6=>0

        );

        foreach ($res as $vo){

              $arr[$vo['section']]=$vo['count'];

        }

        return m_success($arr);



    }



    /*

     * 添加预约信息

     */

    public function add(){

        $uid=input('uid');

        if(!is_numeric($uid)){

            return m_error('未传入uid');

        }

        $check=Db::name('manage_appoint')

            ->where('member_id',$uid)

            ->where('status',1)

            ->find();

        if($check){

            return m_error('请先取消之前的预约');

        }



        $date=input('date');

        if(!$date){

            return m_error('缺少date参数');

        }

        $hour=input('hour');

        if(!is_numeric($hour)){

            return m_error('缺少正确的hour参数');

        }



        $section=input('section');

        if(!is_numeric($section) || $section>6 || $section<0){

            return m_error('缺少正确的section参数');

        }



        $arr=array(

            1=>'09:00',

            2=>'19:00',

            3=>'29:00',

            4=>'39:00',

            5=>'49:00',

            6=>'59:00',

        );





        $appoint_time=$date.' '.$hour.':'.$arr[$section];

        $appoint_time=strtotime($appoint_time);





        $date=explode('-',$date);

        $store_id=input('store_id');

        if(!is_numeric($store_id)){

            return m_error('缺少正确的store_id参数');

        }



//        //使用新用户体验时间，取消新用户状态

//        $gift_end_time=time()+(60*60*24);

//        Db::name('member_info')

//            ->where('id',$uid)

//            ->where('new',1)

//            ->update([

//                'new'=>2,

//                'gift_end_time'=>$gift_end_time

//            ]);



        //余额时间处理 19-7-3孟

        $data=\db('member_info')->find($uid);

        if($data['prepare_time']>0){

            if($data['end_time']>time()){

                $s=$data['end_time'];

            }else{

                $s=time();

            }

            $end_time=$s+$data['prepare_time'];

            \db('member_info')->where('id',$uid)->update(['end_time'=>$end_time,'prepare_time'=>0]);

        }else{

            $end_time=$data['end_time'];

        }



        //次卡处理 19-7-3孟

        if( $end_time<time()){



                if($data['once_card']<0){

                    return m_error('您的时间余额及次卡均不足，请充值');

                }else{

                    \db('member_info')->where('id',$uid)->setDec('once_card',1);

                }



        }

        //end 19-7-3





        $res=Db::name('manage_appoint')

            ->insert([

                'year'=>$date[0],

                'month'=>$date[1],

                'day'=>$date[2],

                'hour'=>$hour,

                'store_id'=>$store_id,

                'section'=>$section,

                'member_id'=>$uid,

                'create_time'=>time(),

                'update_time'=>time(),

                'appoint_time'=>$appoint_time,

            ]);

        //保留最后一次预约门店为有效门店
        Db::name('member_info')
           ->where('id',$uid)
           ->update([
               'last_store_id'=>$store_id
           ]);

        if($res==1){

            return m_success('预约成功');

        }



    }



    /**

     * 我的预约

     */

    public function myappoint(){

        $uid=input('uid');

        if(!is_numeric($uid)){

            return m_error('未传入uid');

        }

        $data=Db::name('manage_appoint')

            ->field('a.store_id,a.id as appoint_id,a.year,a.month,a.day,a.hour,a.section,b.name as store_name')

            ->alias('a')

            ->where('a.member_id',$uid)

            ->where('a.status',1)

            ->join('manage_store b','a.store_id =b.id','left')

            ->find();





        $arr=$this->appointformat(time());

        if($arr['year']==$data['year'] & $arr['month']==$data['month'] & $arr['day']==$data['day'] & $arr['hour']==$data['hour'] & $arr['section']==$data['section']){

            $data['is_now']=1;

        }else{

            $data['is_now']=2;

        }



        //进门二维码可用1小时

        $checknow=Db::name('member_consume')

            ->where([

                'member_id'=>$uid,

                'store_id'=>$data['store_id']

            ])

//            ->where('start_time','<',(time()+180))

//            ->where('end_time','>',(time()-180))

            ->where('start_time','<',time())

            ->where('end_time','>',time())

            ->find();

        if($checknow){

            $data['is_now']=1;

        }







        $hour=$data['hour']-1;

        $sections=array(

            1=>$hour.':00-'.$hour.':10',

            2=>$hour.':10-'.$hour.':20',

            3=>$hour.':20-'.$hour.':30',

            4=>$hour.':30-'.$hour.':40',

            5=>$hour.':50-'.$hour.':50',

            6=>$hour.':50-'.$data['hour'].':00',

        );

        $data['section']=$sections[$data['section']];









        unset($data['hour']);

        return m_success($data);





    }

    /**

     * 取消预约

     */

    public function cancle(){

        $uid=input('uid');

        if(!is_numeric($uid)){

            return m_error('未传入uid');

        }

        $appoint_id=input('appoint_id');

        if(!is_numeric($appoint_id)){

            return m_error('未传入预约信息id');

        }

        $res=Db::name('manage_appoint')

            ->where('member_id',$uid)

            ->where('id',$appoint_id)

            ->update(['status'=>-1]);

        if($res==1){

            $data=Db::name('manage_appoint')->find($appoint_id);





            $gift_end_time=Db::name('member_info')

                ->where('id',$uid)

                ->value('gift_end_time');

            $cha=$gift_end_time-time();







            if($cha<0){

                Db::name('member_info')

                    ->where('id',$uid)

                    ->setDec('end_time',60*60*8);

            }else{

                $cha=(60*60*8)-$cha;

                if($cha<0){

                    Db::name('member_info')

                        ->where('id',$uid)

                        ->setDec('gift_end_time',60*60*8);

                }else{

                    Db::name('member_info')

                        ->where('id',$uid)

                        ->setDec('gift_end_time',60*60*8);

                    Db::name('member_info')

                        ->where('id',$uid)

                        ->setDec('end_time',$cha);



                }



            }



                Db::name('member_log')

                    ->insert([

                        'member_id'=>$uid,

                        'type'=>1,

                        'value'=>60*60*8,

                        'desc'=>'取消预约扣除,'.$data['year'].'年'.$data['month'].'月'.$data['day'].'日'.$data['hour'].'时',

                        'desc_type'=>4,

                        'create_time'=>time()

                    ]);

            return m_success('取消成功');



        }else{

            return m_error('取消失败，请联系管理员');

        }



    }





}