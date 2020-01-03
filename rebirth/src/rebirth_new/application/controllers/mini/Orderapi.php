<?php if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

//订单模块接口
class Orderapi extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->service('Order_service');
    }

    /**
     * appoint_list
     * 预约列表接口
     */
    public function appoint_list()
    {
        $param = $this->input->post();
        $param['page'] = 0;
        $param['limit'] = 0;
        $param['field'] = '*';
        if (!isset($param['acc_id'])) {
            return $this->actionres(false, 'loseParam', '缺失请求参数！');
        }
        $row = $this->order_service->appoint_list($param);
        echo json_encode($row);
        exit;
    }

    /**
     * appoint_add
     * 预约添加接口
     */
    public function appoint_add()
    {
        $param = $this->input->post();
        if (!(isset($param['acc_id']) && isset($param['goods_id']))) {
            return $this->actionres(false, 'loseParam', '缺失请求参数！');
        }
        $row = $this->order_service->appoint_add($param);
        echo json_encode($row);
        exit;
    }

    /**
     * appoint_show
     * 预约预览接口
     */
    public function appoint_show()
    {
        $param = $this->input->get();
        if (!(isset($param['id']))) {
            return $this->actionres(false, "loseParam", "缺失请求参数");
        }
        $row = $this->order_service->appoint_show($param);
        echo json_encode($row);
        exit;
    }

    /**
     * appoint_show_exit
     * 预约查询接口
     */
    public function appoint_show_exist()
    {
        $param = $this->input->get();
        if (!(isset($param['acc_id']))) {
            return $this->actionres(false, "loseParam", "缺失请求参数");
        }
        $row = $this->order_service->appoint_show_exist($param);
        echo json_encode($row);
        exit;
    }

    /**
     * consume_list
     * 消费列表接口
     */
    public function consume_list()
    {
        $param = $this->input->post();
        $param['page'] = 0;
        $param['limit'] = 0;
        $param['field'] = '*';
        if (!isset($param['acc_id'])) {
            return $this->actionres(false, 'loseParam', '缺失请求参数！');
        }
        $row = $this->order_service->consume_list($param);
        echo json_encode($row);
        exit;
    }

    /**
     * consume_pay
     * 消费充值接口
     */
    public function consume_pay()
    {
        $param = $this->input->post();
        if (!(isset($param['acc_id']) && isset($param['type']) && isset($param['name']) && isset($param['money']) && isset($param['value']))) {
            return $this->actionres(false, "noParam", "参数不完整，请检查");
        }
        $row = $this->order_service->consume_pay($param);
        echo json_encode($row);
        exit;
    }

    /**
     * consume_pay_success
     * 充值成功回调接口
     */
    public function consume_pay_success()
    {
        $param = $GLOBALS['HTTP_RAW_POST_DATA'];
        $this->order_service->consume_pay_success($param);
    }

    /**
     * qrcode
     * 生成二维码
     */
    public function qrcode()
    {
        $param = $this->input->get();
        $this->order_service->qrcode($param);
    }
}

