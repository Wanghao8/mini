<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/3/26 0026
 * Time: 下午 3:34
 */

namespace app\rebirth\controller;


use think\Controller;
use think\Db;

class Activity extends Base
{
    /**
     * 获取活动列表
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function lists(){
        $data=Db::name('market_activity')
            ->field('id,name,desc,bonus,image')
            ->order('sort','asc')
            ->select();
        return m_success($data);
    }

}