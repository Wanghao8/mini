<?php
/**
 * Created by PhpStorm.
 * User: my
 * Date: 2019/5/16
 * Time: 9:36
 */

namespace app\rebirth\controller;


use think\Controller;
use think\Db;

class Gift extends Controller
{
    /**
 * 礼品卡列表
 */
    public function lists(){
        $data=Enum::gift();
        $arr=array();
        foreach ($data as $vo){
            $arr[]=$vo;
        }
        return m_success($arr);
    }


    /**
     * 我购买的礼品卡
     */
    public function myLists($uid=0){

        if($uid==0){
            return m_error('uid有误');
        }
        $data=Db::name('market_gift')
            ->where('uid',$uid)
            ->order('status','asc')
            ->select();
        return m_success($data);
    }

    /**
     * 我接受的礼品卡
     */
    public function useLists($use_uid=0){

        if($use_uid==0){
            return m_error('use_uid有误');
        }
        $data=Db::name('market_gift')
            ->where('use_uid',$use_uid)
            ->order('status','asc')
            ->select();
        return m_success($data);
    }

    /**
     * 使用礼品卡
     * @param int $use_uid
     * @param int $id
     * @return \think\response\Json
     */
    public function useUp($use_uid=0,$id=0){
        if($use_uid==0){
            return m_error('uid有误');
        }
        if($id==0){
            return m_error('id有误');
        }
        $status=Db::name('market_gift')
            ->where('id',$id)
            ->value('status');
        //卡只能用一次
        if($status==2){
            return m_error('该卡已经被使用过');
        }

        Db::name('market_gift')
            ->where('id',$id)
            ->update(['use_uid'=>$use_uid,'status'=>2]);
        $data=Db::name('market_gift')
            ->find($id);
        //用户加时间
        $bonus=$data['value'];
        Db::name('member_info')->where('id',$data['uid'])->setInc('prepare_time',$bonus);
        Db::name('member_info')->where('id',$data['uid'])->update(['prepare_start_time'=>time()]);
//        $end_time=Db::name('member_info')->where('id',$use_uid)->value('end_time');
//        if($end_time<time()){
//            $end_time=time()+$bonus;
//        }else{
//            $end_time=$end_time+$bonus;
//        }
//        Db::name('member_info')->where('id',$use_uid)->update(['end_time'=>$end_time]);
        //加时间记录
        Db::name('member_log')->insert([
            'member_id'=>$use_uid,
            'type'=>1,
            'value'=>$bonus,
            //            'order_no'=>$out_trade_no,
            'desc'=>'使用充值赠卡加时间',
            'desc_type'=>7,
            'create_time'=>time()
        ]);
        return m_success();

    }


}