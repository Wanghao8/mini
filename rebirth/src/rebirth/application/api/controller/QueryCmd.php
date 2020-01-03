<?php

/**

 * Created by PhpStorm.

 * User: Administrator

 * Date: 2019/3/18 0018

 * Time: 下午 3:03

 */



namespace app\api\controller;





use think\Cache;

use think\Controller;

use think\Db;



class QueryCmd extends Controller

{

    public function index(){



        //$data=$GLOBALS['HTTP_RAW_POST_DATA'];

        header('Content-Encoding: en');



        $data=input('post.paramaters');





        cache('test',$data,600);

        $i=cache('i');

        if(!$i){

            $i=1;

            cache('i',$i,7200);

        }else{

            $i++;

            cache('i',$i,7200);

        }



        $data=json_decode($data,true);

        $data['time']=date("y-m-d H:i:s",time());



    //    cache('test1',$data,600);



        $sn_num=$data['SN'];



        $sn=redis()->get($sn_num);







        if(!$sn){



            echo '{ "CmdID":"'.millisecond().'","CmdCode":0}';exit;

        }

        $sn=unserialize($sn);









            $store_id=Db::name('manage_store')->where('sn',$data['SN'])->value('id');

        //    cache('test111',$store_id,600);

            $check=Db::name('member_consume')

                ->where('member_id',$sn['uid'])

                ->where('store_id',$store_id)

                ->where('end_time','>',time())

                ->find();

           // cache('debug',$sn,300);

            if(!$check){

                Db::name('member_consume')

                    ->insert([

                        'member_id'=>$sn['uid'],

                        'store_id'=>$store_id,

                        'start_time'=>$sn['time'],

                        'end_time'=>$sn['time']+(60*60),

                    ]);

                Db::name('manage_appoint')

                    ->where('member_id',$sn['uid'])

                    ->where('status',1)

                    ->update(['visit'=>1]);





                Db::name('member')

                    ->where('id',$sn['uid'])

                    ->setInc('visit_num',1);



                //上级加次数

                $c=Db::name('member_invite')

                    ->where('invitee_id',$sn['uid'])

                    ->where('status',0)

                    ->find();

                if($c){

                    Db::name('member')

                        ->where('id',$sn['uid'])

                        ->setInc('once_card',$c['value']);

                    Db::name('member_invite')

                        ->where('id',$c['id'])

                        ->update(['status'=>1,'activate_time'=>time()]);

                }



            }







        redis()->delete($sn_num);



        echo '{ "CmdID":"'.millisecond().'","CmdCode":1}';











    }



    public function show(){

        $res=cache('test');

        halt($res);





        $data=$sn=redis()->get('1802010475');;

        $data=json_encode($data);

        halt($data);

        $sn=cache('1802010475');



        $store_id=Db::name('manage_store')->where('sn',$sn['sn'])->value('id');

        Db::name('member_consume')

            ->insert([

                'member_id'=>$sn['uid'],

                'store_id'=>$store_id,

                'start_time'=>$sn['time'],

                'end_time'=>$sn['time']+(60*60),

            ]);



        Db::name('manage_appoint')

            ->where('member_id',$sn['uid'])

            ->update(['status'=>2]);



        //$data=cache('test1');

        halt($sn);

    }



}