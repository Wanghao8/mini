<?php if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}
include_once APPPATH."libraries/GatewayClient/Gateway.php";
use GatewayClient\Gateway;
Gateway::$registerAddress = '47.104.195.149:1237';
//账号管理接口
class Goodsapi extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->service('Manage_service');
        $this->load->service('Goods_service');
    }

    /**
     * [goods_list 拍品列表]
     * 分页+条件所有参数
     * 列表数据信息
     */
    public function goods_list()
    {
        $param = $this->input->post();
        if(!isset($param['page'])||!isset($param['limit'])||!isset($param['type'])){
            return $this->actionres(false,'loseParam','缺失请求参数！');
        }
        switch ($param['type']) {
            case "1"://正在拍卖
                $param['where']=" start_time<now() and delay_time>now() order by id desc";
                break;
            case "2"://即将拍卖
                $param['where']=" start_time>=now() order by id desc";
                break;
            case "3"://历史记录
                $param['where']=" delay_time<=now() order by id desc";
                break;
        }
        $param['field']="*";
        $row=$this->goods_service->goods_list($param);
        echo json_encode($row);
        exit;
    }

    /**
     * [goods_add 拍品添加接口]
     * 参数 wechat实体信息
     */
    public function goods_add(){
        $param = $this->input->post();
        if(!(isset($param['acc_id'])&&isset($param['name'])&&isset($param['cover_imgs'])&&isset($param['start_price'])&&isset($param['range_price'])&&isset($param['start_time'])&&isset($param['end_time']))){
            return $this->actionres(false,"noParam","参数不完整，请检查");
        }
        $row=$this->goods_service->goods_add($param);
        echo json_encode($row);
        exit;
    }

    /**
     * [goods_show 拍品预览接口]
     * acc_id 或 id
     * 单条符合条件订单视图信息
     */
    public function goods_show(){
        $param = $this->input->get();
        if(!(isset($param['id']) && isset($param['acc_id']))){
            return $this->actionres(false,'loseParam','缺失请求参数！');
        }
        $row=$this->goods_service->goods_show($param);
        echo json_encode($row);
        exit;
    }

    /**
     * [goods_bond_add 拍品保证金添加接口]
     * 参数 wechat实体信息
     */
    public function goods_bond_add(){
        $param = $this->input->post();
        if(!(isset($param['acc_id'])&&isset($param['goods_id'])&&isset($param['openid'])&&isset($param['money'])&&isset($param['phone']))){
            return $this->actionres(false,"noParam","参数不完整，请检查");
        }
        $row=$this->goods_service->goods_bond_add($param);
        echo json_encode($row);
        exit;
    }

    /**
     * [goods_offer_list 拍品出价列表]
     * 列表数据信息
     */
    public function goods_offer_list()
    {
        $param = $this->input->post();
        if(!isset($param['goods_id'])){
            return $this->actionres(false,'loseParam','缺失请求参数！');
        }
//        $param['where']=$param['where']." order by id desc";
//        $param['field']="*";
        $row=$this->goods_service->goods_offer_list($param);
        echo json_encode($row);
        exit;
    }

    /**
     * [goods_offer_add 拍品出价接口]
     * 参数 wechat实体信息
     */
    public function goods_offer_add(){
        $param = $this->input->post();
        if(!(isset($param['acc_id'])&&isset($param['goods_id'])&&isset($param['money']))){
            return $this->actionres(false,"noParam","参数不完整，请检查");
        }
        $row=$this->goods_service->goods_offer_add($param);
        echo json_encode($row);
        exit;
    }

    /**
     * [participate_goods_list 我参与的拍品列表]
     * 分页+条件所有参数
     * 列表数据信息
     */
    public function participate_goods_list()
    {
        $param = $this->input->post();
        if(!isset($param['page'])||!isset($param['limit'])||!isset($param['acc_id'])){
            return $this->actionres(false,'loseParam','缺失请求参数！');
        }
        $param['field']="*";
        $row=$this->goods_service->participate_goods_list($param);
        echo json_encode($row);
        exit;
    }

    /**
     * [bond_list 保证金列表]
     * 分页+条件所有参数
     * 列表数据信息
     */
    public function bond_list()
    {
        $param = $this->input->post();
        if(!isset($param['page'])||!isset($param['limit'])||!isset($param['acc_id'])){
            return $this->actionres(false,'loseParam','缺失请求参数！');
        }
        $param['field']="*";
        $row=$this->goods_service->bond_list($param);
        echo json_encode($row);
        exit;
    }

    /**
     * [publish_goods_list 我发起的拍品列表]
     * 分页+条件所有参数
     * 列表数据信息
     */
    public function publish_goods_list()
    {
        $param = $this->input->post();
        if(!isset($param['page'])||!isset($param['limit'])||!isset($param['acc_id'])){
            return $this->actionres(false,'loseParam','缺失请求参数！');
        }
        $row=$this->goods_service->publish_goods_list($param);
        echo json_encode($row);
        exit;
    }

    /**
     * 绑定用户和群组
     */
    public function bind_user()
    {
        $param = $this->input->post();
        if (!isset($param['client_id']) || !isset($param['acc_id']) || !isset($param['goods_id'])){
            return $this->actionres(false,'loseParam','缺失请求参数!');
        }
        // client_id与uid绑定
        Gateway::bindUid($param['client_id'], $param['acc_id']);
        // 加入某个群组（可调用多次加入多个群组）
        Gateway::joinGroup($param['client_id'], $param['goods_id']);

        $res = array(
            'type' => 'join',
            'msg' => 'success'
        );
        echo json_encode($res);
        exit;
    }

    /**
     * 获取用户缴纳保证金状态和出价状态
     */
    public function get_user_status()
    {
        $param = $this->input->get();
        if(!(isset($param['goods_id']) && isset($param['acc_id']))){
            return $this->actionres(false,'loseParam','缺失请求参数！');
        }
        $row=$this->goods_service->get_user_status($param);
        echo json_encode($row);
        exit;
    }

    /**
     * 支付回调
     */
    public function notify()
    {
        $param = $GLOBALS['HTTP_RAW_POST_DATA'];
        $this->goods_service->bond_notify($param);
    }

    /**
     * 拍卖结束后退款
     * 定时任务,每隔2分钟执行一次
     */
    public function refund()
    {
        if(is_cli()){
            $this->goods_service->bond_refund();
        }
    }







}

