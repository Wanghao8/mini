<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Store_service extends MY_Service
{
    public function __construct()
    {
        parent::__construct();
        $this->CI = @get_instance();
        $this->load->model('T_manage_acc_model');
        $this->load->model('Common_model');
        $this->load->model('T_store_model');
        $this->load->model('T_store_course_model');
        $this->load->model('T_store_goods_model');
        $this->load->model('T_store_manage_model');
        $this->load->model('T_order_appoint_model');
    }

    /**
     * goods_list
     * 门店排课列表
     * @param $data
     * @return array
     */
    public function goods_list($data)
    {
        $where = " a.store_id=" . $data['store_id'] . " and a.dayn='" . $data['dayn'] . "'";
        $field = "a.*,b.name,b.label";
        $list_r = $this->T_store_goods_model->do_list($where, $data['page'], $data['limit'], $field);
        $list_r = $list_r ? $list_r : [];
        return $this->serviceres(true, 'success', '列表成功', $list_r);
    }

    /**
     * goods_show
     * 排班详情
     */
    public function goods_show($data)
    {
        $goods_r = $this->T_store_goods_model->do_show_goods($data['id']);
        //查询用户状态是否可以预约,天卡或者次卡
        $acc_r = $this->T_manage_acc_model->do_show($data['acc_id']);
        $now_date = date('Y-m-d');
        if ($now_date <= $acc_r['timecard'] || $acc_r['oncecard'] > 0) {
            $goods_r['card_status'] = 1;
        } else {
            $goods_r['card_status'] = 0;
        }
        //查询是否预约
        $appoint = $this->T_order_appoint_model->do_select_one(['acc_id' => $data['acc_id'], 'goods_id' => $data['id']]);
        $goods_r['appoint_status'] = !empty($appoint) ? 1 : 0;
        if (!$goods_r) {
            return $this->serviceres(false, 'addFail', '查询失败,请联系管理员！');
        }
        return $this->serviceres(true, 'success', '排课信息查询成功', $goods_r);
    }

    /**
     * goods_edit
     * 排课信息添加修改
     * @param $data
     * @return array
     */
    public function goods_edit($data)
    {
        //执行修改操作
        if ($data['id'] > 0) {
            $goods_up = $this->T_store_goods_model->do_update(array('id' => $data['id']), $data);
            if (!$goods_up) {
                return $this->serviceres(false, 'editFail', '修改失败,检查数据格式');
            }
            return $this->serviceres(true, 'success', '排课信息修改成功');
        }
        //执行添加操作
        $goods_add = $this->T_store_goods_model->do_add($data);
        if (!$goods_add) {
            return $this->serviceres(false, 'addFail', '添加失败,请联系管理员！');
        }
        return $this->serviceres(true, 'success', '排课信息添加成功');
    }

    /**
     * goods_delete
     * 排课删除接口
     * @param $data
     * @return array
     */
    public function goods_delete($data)
    {
        $delte_r=$this->T_store_goods_model->do_delete($data);
        if(!$delte_r){
            return $this->serviceres(false,'delFail','删除失败,请联系管理员！');
        }
        return $this->serviceres(true,'success','删除成功');
    }

    /**
     * 排课结束接口
     */
    public function goods_done($data)
    {
        //修改排课状态
        $goods_up = $this->T_store_goods_model->do_update(['id'=>$data['id']],['status'=>1]);
        if (!$goods_up){
            return $this->serviceres(false, 'editFail', '修改失败,检查数据格式');
        }
        $appoint_r = $this->T_order_appoint_model->do_select_one(['goods_id'=>$data['id']]);
        if ($appoint_r){
            //将该课程全部预约单批量改为结束
            $appoint_up = $this->T_order_appoint_model->do_update(['goods_id'=>$data['id']],['status'=>1]);
            if (!$appoint_up) {
                return $this->serviceres(false, 'editFail', '修改失败,检查数据格式');
            }
        }
        return $this->serviceres(true, 'success', '修改成功');

    }

    /**
     * store_list
     * 门店列表
     * @param $data
     * @return array
     */
    public function store_list($data)
    {
        $where = " status>0";
        $list_r = $this->T_store_model->do_list($where, $data['page'], $data['limit'], $data['field']);
        $list_r = $list_r ? $list_r : [];
        if (!empty($list_r)) {
            //1. 引入距离服务
            include_once APPPATH . "libraries/wechat/Wxmini.php";
            $wxmini = new Wxmini();
            //2. 循环拼装位置
            $to_latlons = "";
            foreach ($list_r as $site_item) {
                $to_latlons .= $site_item['latlong'] . ";";
            }
            $to_latlons = substr($to_latlons, 0, strlen($to_latlons) - 1);
            //4.请求腾讯距离
            $julidata = $wxmini->mapDistance($data['latlong'], $to_latlons);
            $elements = $julidata['result']['elements'];
            foreach ($elements as $k => $v) {
                if ($v['distance'] > 1000) {
                    $list_r[$k]['distance'] = (round($v['distance'] / 1000, 1)) . 'km';
                } else {
                    $list_r[$k]['distance'] = $v['distance'] . 'm';
                }
            }
        }
        return $this->serviceres(true, 'success', '列表成功', $list_r);
    }

    /**
     * store_show
     * 门店详情
     * @param $id
     * @return array
     */
    public function store_show($id)
    {
        $goods_r = $this->T_store_model->do_show($id);
        if (!$goods_r) {
            return $this->serviceres(false, 'addFail', '查询失败,请联系管理员！');
        }
        return $this->serviceres(true, 'success', '门店信息查询成功', $goods_r);
    }

    /**
     * course_list
     * 课程列表
     * @param $data
     * @return array
     */
    public function course_list($data)
    {
        $where = " status=1";
        $list_r = $this->T_store_course_model->do_list($where, $data['page'], $data['limit'], $data['field']);
        $list_r = $list_r ? $list_r : [];
        return $this->serviceres(true, 'success', '列表成功', $list_r);
    }

}