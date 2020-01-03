<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/3/25 0025
 * Time: 下午 2:52
 */

namespace app\rebirth\controller;


use think\Controller;
use think\Db;

class Store extends Base
{
    /**
     * 获取健身房列表
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function lists($page=1,$limit=20){
        $lat=input('lat')?input('lat'):'34.74568';
        $lon=input('lon')?input('lon'):'113.77647';

        if(!$lat || !$lon){
            return m_error('无经纬度参数');
        }
        $data=Db::name('manage_store')
            ->alias('a')
            ->join('member_info b','a.member_id=b.id','left')
            ->field('a.name,a.address,a.id,a.lat,a.lon,a.image,    ROUND(
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
    ) AS distance,b.nickName,b.phone')
            ->order('distance','asc')
            ->page($page,$limit)
            ->select();

        foreach ($data as &$vo){
            $count=Db::name('member_consume')
                ->where('start_time','<',time())
                ->where('end_time','>',time())
                ->where('store_id',$vo['id'])
                ->count();
            $vo['count']=$count;
            $vo['member_count']=Db::name('member_info')->count();
        }




        return m_success($data);

    }

    /**
     * 添加健身房信息
     * @return \think\response\Json
     */
    public function add(){
        $lat=input('lat');
        $lon=input('lon');
        $name=input('name');
        $address=input('address');
        $image=input('image');
        if(!$lat || !$lon ||!$name ||!$address){
            return m_error('参数错误');
        }

        $data=array(
            'lat'=>$lat,
            'lon'=>$lon,
            'name'=>$name,
            'address'=>$address,
            'create_time'=>time(),
            'update_time'=>time(),
            'image'=>$image,
        );

        $res=Db::name('manage_store')
            ->insert($data);
        if($res==1){
            return m_success('添加成功');
        }else{
            return m_success('添加失败');
        }
    }

    /**
     * 获取健身房id
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function detail(){
        $store_id=input('store_id');
        if(!is_numeric($store_id)){
            return m_error('健身房id有误');
        }
        $data=Db::name('manage_store')
            ->field('name,address,id,member_id,image')
            ->find($store_id);
        return m_success($data);


    }




}