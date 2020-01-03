<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/4/1 0001
 * Time: 下午 2:07
 */

namespace app\rebirth\controller;


use think\Controller;
use think\Db;

class Base extends Controller
{
    public function _initialize() {

//        //预约过时违约
//        $arr=$this->appointformat(time());
//        Db::name('manage_appoint')
//            ->where('year','<=',$arr['year'])
//            ->where('month','<=',$arr['month'])
//            ->where('day','<=',$arr['day'])
//            ->where('hour','<=',$arr['hour'])
//            ->where('section','<',$arr['section'])
//            ->where('status',1)
//            ->update([
//               'status'=>-2
//            ]);

        $this->locker_warn();


    }

    /*
     * 柜子到期提醒
     */
    public function locker_warn(){
        $min=time();
        $max=time()+(60*60*24*3);
        $data=Db::name('member_info')
            ->field('id,phone,locker_store_id,locker_id')
            ->where('locker_end_time','>',$min)
            ->where('locker_end_time','<',$max)
            ->where('locker_expire_warn',1)
            ->select();

        foreach ($data as $vo){
            $store_name=Db::name('manage_store')->where('id',$vo['locker_store_id'])->value('name');
            $url='http://utf8.api.smschinese.cn/?Uid=poower&Key=d41d8cd98f00b204e980&smsMob='.$vo['phone'].'&smsText=您在'.$store_name.'店租赁的专属储物柜将在3天后到期，到期时工作人员会将您的物品移出.【Rebirth】';
            myCurl($url);
            Db::name('member_info')->where('id',$vo['id'])->update(['locker_expire_warn'=>2]);

        }



    }



    /*
     * 时间戳转预约时间
     */
    public function appointformat($time){
        $year=date('Y',$time);
        $month=date('m',$time);
        $day=date('d',$time);
        $hour=date('H',$time);
        $hour=$hour+1;
        $minute=$time%(60*60);
        $section=intval($minute/600);
        $section=$section+1;
        $arr=array(
            'year'=>$year,
            'month'=>$month,
            'day'=>$day,
            'hour'=>$hour,
            'section'=>$section
        );
        return $arr;
    }

    /*
     * 控制前端显示
     */
    public function check(){
        return m_success(2);
    }

}