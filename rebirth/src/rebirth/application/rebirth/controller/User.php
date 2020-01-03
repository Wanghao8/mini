<?php

/**

 * Created by PhpStorm.

 * User: my

 * Date: 2019/2/15

 * Time: 17:14

 */



namespace app\rebirth\controller;





use think\Controller;

use think\Db;



class User extends Base

{



    /**

     * 获取openID

     * @param $jscode

     * @return \think\response\Json

     */

    public function openid(){



        $jscode=input('jscode');

        if(!$jscode){

            return m_error('请传入正确的jscode');

        }

        $appid=config('rebirth.appid');

        $appsecret=config('rebirth.appsecret');

        $res=myCurl('https://api.weixin.qq.com/sns/jscode2session?appid='.$appid.'&secret='.$appsecret.'&js_code='.$jscode.'&grant_type=authorization_code');

        $data=json_decode($res,true);

        return m_success($data);

    }



    /**

     * 添加用户

     */

    public function useradd(){

//        $lat=input('lat');

//        $lng=input('lng');

        $pid=input('pid')?input('pid'):0;

//        if($lat & $lng){

//            $res = file_get_contents("http://apis.map.qq.com/ws/geocoder/v1/?location=".$lat.",".$lng."&key=VCZBZ-K4QEW-4OERB-OBD6C-DF35Q-2YB62");

//            $arr = json_decode($res, true);

//            $arr = $arr['result']['address_component'];

//            $data['lat']=$lat;

//            $data['lng']=$lng;

//            $data['province']=$arr['province'];

//            $data['city']=$arr['city'];

//            $data['district']=$arr['district'];

//            $data['street']=$arr['street'];

//        }



        $nickName=input('nickName');

        if(!$nickName){

            return m_error('请传入用户名');

        }else{

            $data['nickName']=$nickName;

        }

        $avatarUrl=input('avatarUrl');

        if(!$avatarUrl){

            $avatarUrl='';

        }

        $data['avatarUrl']=$avatarUrl;



        $openid=input('openid');

        if(!$openid){

            return m_error('请传入openid');

        }

        $check=Db::name('member_info')

            ->where('openid',$openid)

            ->find();

        if($check){

            return m_error('该openID的用户已存在');

        }

        $data['openid']=$openid;

        $data['create_time']=time();

        $phone=input('phone');

        if(!checkphone($phone)){

            return m_error('手机号不正确');

        }



        $unionid=input('unionid');

        if(!$unionid){

            $unionid='';

        }

        $data['unionid']=$unionid;

        $data['create_time']=time();

        $data['pid']=$pid;

        $data['end_time']=time();

        if(!$pid || $pid ==0){

            return m_error('请传入正确pid');

        }

        $data['phone']=$phone;

        $data['once_card']=1;

        $uid=Db::name('member_info')

            ->insertGetId($data);

        Db::name('member_info')

            ->where('id',$uid)

            ->update([

                'card_no'=>makecard($uid),

            ]);



        //上级用户加时间奖励

//        $pend_time=Db::name('member_info')

//            ->where('id',$pid)

//            ->value('end_time');

//        if($pend_time>time()){

//

//                $end_time=$pend_time+(60*60*24);

//

//

//

//        }else{

//            $end_time=time()+(60*60*24);

//        }

//        Db::name('member_info')

//            ->where('id',$pid)

//            ->update(['end_time'=>$end_time]);

//        Db::name('member_log')

//            ->insert([

//                'member_id'=>$pid,

//                'relate_uid'=>$uid,

//                'type'=>1,

//                'value'=>60*60*24,

//                'desc'=>'邀请子用户'.$nickName.'获得',

//                'desc_type'=>5,

//                'create_time'=>time()

//

//            ]);



        //上级用户加次卡奖励

//            Db::name('member_info')

//            ->where('id',$pid)

//            ->setInc('once_card',2);



            Db::name('member_invite')

                ->insert([

                    'inviter_id'=>$pid,

                    'invitee_id'=>$uid,

                    'value'=>2,

                    'create_time'=>time(),

                ]);

            Db::name('member_log')

            ->insert([

                'member_id'=>$pid,

                'relate_uid'=>$uid,

                'type'=>3,

                'value'=>2,

                'desc'=>'邀请子用户'.$nickName.'获得2次卡',

                'desc_type'=>6,

                'create_time'=>time()



            ]);



            return m_success(array('uid'=>$uid,'status'=>1),'添加成功');



    }

    

    /**

     * 获取uid

     * @return \think\response\Json

     */

    public function getuid(){

        $openid=input('openid');



        if(!$openid){

            return m_error('请传入openID');

        }

        $uid=Db::name('member_info')

           // ->field('uid,avatarUrl,nickName,residue_time,loginnum,card_no,visit_num')

            ->where('openid',$openid)

            ->value('id');

        if(!$uid){



            return m_error('用户不存在请先走添加用户接口',403);

        }else{

            return m_success(array(

                'uid'=>$uid

            ));

        }

    }





    /**

     * 获取用户信息

     * @throws \think\db\exception\DataNotFoundException

     * @throws \think\db\exception\ModelNotFoundException

     * @throws \think\exception\DbException

     */

    public function getinfo(){



        $uid=input('uid');



        //预约完成检测

        $check=Db::name('manage_appoint')->where('member_id',$uid)->where('status',1)->find();

        if($check['visit']==1){

            $arr=array(

                1=>'09',

                2=>'19',

                3=>'29',

                4=>'39',

                5=>'49',

                6=>'59',

            );

            $hour=$check['hour']-1;

            $minute=$arr[$check['section']];

            $check_time=$check['year'].'-'.$check['month'].'-'.$check['day'].' '.$hour.':'.$minute;

            $strtotime=strtotime($check_time);

            if((time()-$strtotime)>(60*60)){

               Db::name('manage_appoint')->where('member_id',$uid)->where('status',1)->update(['status'=>2]);

            }

        }







        $ip=getip();

        if(!$uid){

            return m_error('请传入uid');

        }

        $data=Db::name('member_info')

            ->field('id as uid,avatarUrl,nickName,end_time,loginnum,card_no,status,pid,phone,proceeds,new,gift_end_time,locker_end_time,locker_id,locker_store_id,once_card,prepare_time,prepare_start_time,last_store_id')

            ->where('id',$uid)

            ->find();

        if(!$data){

            return m_error('uid有误');

        }



        //余额池处理，7天处理 19-7-3孟

            $seven=($data['prepare_time']-$data['prepare_start_time'])>(60*60*24*7);

            if($data['prepare_time']>0 & $seven > 0){

                if($data['end_time']>time()){

                    $s=$data['end_time'];

                }else{

                    $s=time();

                }

                \db('member_info')->where('id',$uid)->update(['end_time'=>($s+$data['prepare_time']),'prepare_time'=>0]);

            }

        //end 19-7-3







        if(($data['locker_end_time']-time())>0){

            $data['has_locker']=1;

        }else{

            $data['has_locker']=2;

        }



        $check=Db::name('manage_appoint')

            ->where('status',1)

            ->where('member_id',$uid)

            ->find();



        if(!$check){



            $data['is_appoint']=2;

        }else{



            switch ($check['section']){

                case 1;

                    $section='09';

                    break;

                case 2;

                    $section='19';

                    break;

                case 3;

                    $section='29';

                    break;

                case 4;

                    $section='39';

                    break;

                case 5;

                    $section='49';

                    break;

                case 6;

                    $section='59';

                    break;

            }

            $date=$check['year'].'-'.$check['month'].'-'.$check['day'].' '.($check['hour']-1).':'.$section.':00';





            $date=strtotime($date);



            //超时扣时间

            if($date<time()){

                $data['is_appoint']=2;



                Db::name('member_info')

                    ->where('id',$uid)

                    ->setDec('end_time',60*60*8);

                Db::name('manage_appoint')

                    ->where('id',$check['id'])

                    ->update(['status'=>-1]);



                Db::name('member_log')

                    ->insert([

                        'member_id'=>$uid,

                        'type'=>1,

                        'value'=>60*60*8,

                        'desc'=>'取消预约扣除,'.$check['year'].'年'.$check['month'].'月'.$check['day'].'日'.$check['hour'].'时',

                        'desc_type'=>4,

                        'create_time'=>time()

                    ]);

            }else{

                $data['is_appoint']=1;

            }



        }





        if($data['new']==1){

            $data['gift_residue_time']=60*60*24;

        }else{



            $cha=$data['gift_end_time']-time();



            if($cha<0){

                $data['gift_residue_time']=0;

            }else{

                $data['gift_residue_time']=$cha;

            }



        }



        $residue_time=$data['end_time']-time();

        if($residue_time <0){

            $residue_time=0;

        }

        $member_loginnum=$data['loginnum']+1;



        //计算超过多少比例用户

        $getper=\db('member_consume')

            ->field('count(*) as count,`member_id`')

            ->group('member_id')

            ->order('count','desc')

            ->select()



        ;



        $count=Db::name('member_info')->count();

        $key=0;

        foreach ($getper as $k=>$v){

            if($v['member_id']==$uid){

                $key=$k;

                break;

            }

        }

        $count_has=count($getper);

        $key=$count_has+$key+1;



        $per=($key+1)/$count;

        $per=1-$per;



        $per=intval($per*100);



        $visit_num=Db::name('member_consume')->where('member_id',$uid)->count();

        $data['visit_num']=$visit_num;





        //原来是邀请人数，后来改为邀请并到店的人数

      //  $invite_num=Db::name('member_info')->where('pid',$uid)->count();

        $invite_num=Db::name('member_invite')->where('inviter_id',$uid)->where('status',1)->count();

        $invite_value_all=Db::name('member_invite')->where('inviter_id',$uid)->sum('value');

        $invite_value_nouse=Db::name('member_invite')->where('inviter_id',$uid)->where('status',0)->sum('value');



        $data['per']=$per;

        $data['invite_num']=$invite_num;

        $data['invite_value_all']=$invite_value_all;

        $data['invite_value_nouse']=$invite_value_nouse;

        $data['residue_time']=$residue_time;

        $data['proceeds']=$data['proceeds']/100;

        if(!$data['card_no']){

            $card_no=createCode($data['uid']);

            $data['card_no']=$card_no;

        }else{

            $card_no=$data['card_no'];

        }



        Db::name('member_info')

            ->where('id',$uid)

            ->update([

                'loginnum'=>$member_loginnum,

                'login_time'=>time(),

                'ip'=>$ip,

                'card_no'=>$card_no

            ]);

        



        return m_success($data);

    }





    /**

     * 足迹

     */

    public function track($page=1,$limit=10){

        $uid=input('uid');

        if(!is_numeric($uid)){

            return m_error('请传入正确的uid');

        }



        $data=Db::name('member_consume')

            ->field("a.id,b.name,from_unixtime(`start_time`, '%Y-%m-%d %H:%i:%S') as start_time,from_unixtime(`end_time`, '%Y-%m-%d %H:%i:%S') as end_time")

            ->alias('a')

            ->where('a.member_id',$uid)

            ->join('manage_store b','a.store_id =b.id')

            ->order('id','desc')

            ->page($page,$limit)

            ->select();

        return m_success($data);



    }



    /**

     * 首页我的会员

     * @return \think\response\Json

     * @throws \think\db\exception\DataNotFoundException

     * @throws \think\db\exception\ModelNotFoundException

     * @throws \think\exception\DbException

     */

    public function inivte_member($page=1,$limit=10){

        $uid=input('uid');

        if(!is_numeric($uid)){

            return m_error('请传入正确的uid');

        }

        $data=Db::name('member_info')

            ->field("id,avatarUrl,nickName,from_unixtime(`end_time`, '%Y-%m-%d %H:%i:%S') as end_time,total_amount,children_total_amount,status")

            ->where('pid',$uid)

            ->page($page,$limit)

            ->select()



        ;



        foreach($data as $key=>$vo){



            $data[$key]['proceeds']=($vo['total_amount'])*(0.1)/100;

            $data[$key]['children_proceeds']=($vo['children_total_amount'])*0.02/100;



        }



        return m_success($data);



    }



    /**

     * 余额记录

     */

    public function proceeds_log($page=1,$limit=20){

        $uid=input('uid');

        if(!is_numeric($uid)){

            return m_error('请传入uid');

        }

        $data=Db::name('member_log')

            ->alias('a')

            ->field("a.id,a.member_id as uid,a.relate_uid,a.desc,from_unixtime(a.`create_time`, '%Y-%m-%d %H:%i:%S') as create_time,a.relate_uid,a.value,b.nickName,b.avatarUrl,a.desc_type")

            ->join('member_info b','a.relate_uid = b.id','left')

            ->where('a.member_id',$uid)

            ->where('a.type',2)

            ->order('id','desc')

            ->page($page,$limit)

            ->select();

        return m_success($data);



    }





    /**

     * 会员卡时间记录

     */

    public function time_log($page=1,$limit=20){

        $uid=input('uid');

        if(!is_numeric($uid)){

            return m_error('请传入uid');

        }

        $data=Db::name('member_log')

            ->field("id,member_id as uid,desc,create_time,value")

            ->where('member_id',$uid)

            ->where('type',1)

            ->where('desc_type','neq',4)

            ->order('id','desc')

            ->page($page,$limit)

            ->select();

        foreach ($data as &$vo){

            $vo['create_time']=date('Y-m-d H:i:s',$vo['create_time']);

        }

        return m_success($data);



    }





    /**

     * 充值记录

     */

    public function charge_log($page=1,$limit=20){

        $uid=input('uid');

        if(!is_numeric($uid)){

            return m_error('请传入uid');

        }

        $data=Db::name('member_charge')

            ->field("id,comment,from_unixtime(`create_time`, '%Y-%m-%d %H:%i:%S') as create_time,ROUND(bonus/(24*60*60)) as bonus")

            ->page($page,$limit)

            ->order('id','desc')

            ->select();

        return m_success($data);



    }













}