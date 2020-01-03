<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
include_once APPPATH . '../vendor/autoload.php';

use Yansongda\Pay\Pay;
use Endroid\QrCode\QrCode;

class Order_service extends MY_Service
{
    public function __construct()
    {
        parent::__construct();
        $this->CI = @get_instance();
        $this->load->service('Common_service');
        $this->load->model('T_manage_acc_model');
        $this->load->model('Common_model');
        $this->load->model('T_order_appoint_model');
        $this->load->model('T_order_consume_model');
        $this->load->model('T_order_report_model');
        $this->load->model('T_order_report_detail_model');
        $this->load->model('T_store_goods_model');
    }

    /**
     * 微信配置
     * @var array
     */
//    protected $wechat_config = [
//        'wechat' => [
//            'miniapp_id' => 'wx2b06ca993015783a',
//            'mch_id' => '1569936791',
//            'notify_url' => 'https://pinzhi.yuanfangyun.com/index.php/mini/orderapi/consume_pay_success',
//            'key' => 'AE982BB6CA3DCC577526C28CE3AAD4DA',
//            'cert_client' => '/www/web/paimai_yuanfangyun_com/public_html/application/libraries/wechat/apiclient_cert.pem',
//            'cert_key' => '/www/web/paimai_yuanfangyun_com/public_html/application/libraries/wechat/apiclient_key.pem',
//        ],
//    ];

    /**
     * appoint_list
     * 预约列表接口
     * @param $data
     * @return array
     */
    public function appoint_list($data)
    {
        $where = " acc_id=" . $data['acc_id'] . " order by id desc";
        $list_r = $this->T_order_appoint_model->do_list($where, $data['page'], $data['limit'], $data['field']);
        $list_r = $list_r ? $list_r : [];
        return $this->serviceres(true, 'success', '列表成功', $list_r);
    }

    /**
     * appoint_add
     * 预约添加接口
     * @param $data
     * @return array
     */
    public function appoint_add($data)
    {
        //查询用户状态是否可以预约,天卡或者次卡
        $acc_r = $this->T_manage_acc_model->do_show($data['acc_id']);
        $now_date = date('Y-m-d');
        if (!is_null($acc_r['timecard']) && $acc_r['timecard'] >= $now_date) {
            $type = "timecard";//天卡
        } elseif ($acc_r['oncecard'] > 0) {
            $type = "oncecard";//次卡
        } else {
            return $this->serviceres(false, 'noGoods', '请先充值');
        }
//        1. 查询预约的课程实体信息
        $goods_r = $this->T_store_goods_model->do_show_goods($data['goods_id']);
        if (!$goods_r) {
            return $this->serviceres(false, 'noGoods', '未查询到有效课程');
        }
//		2. 是否大于当前时间（排除手机端更改时间）、是否预约人数已满（排除超过）
        $now_time = date('Y-m-d H:i:s', time());
        if ($now_time > $goods_r['begin_time']) {
            return $this->serviceres(false, 'fail', '已过预约时间');
        }
        if ($goods_r['appoint_total'] >= $goods_r['volume']) {
            return $this->serviceres(false, 'fail', '预约人数已满');
        }
//		3. 查询是否已经预约过该课程（排除重复预约）   查询是否有未结束的课程
        $appoint_exist = $this->T_order_appoint_model->do_select_one(['acc_id' => $data['acc_id'], 'status' => 2]);
        if ($appoint_exist) {
            return $this->serviceres(false, 'fail', '您有未结束的课程,不可预约');
        }
        $appoint_r = $this->T_order_appoint_model->do_select_one(['acc_id' => $data['acc_id'], 'goods_id' => $data['goods_id']]);
        if ($appoint_r) {
            return $this->serviceres(false, 'fail', '您已预约,不可重复预约');
        }
//		4. 执行预约信息添加具体参数看数据库中
        $appoint = [
            'acc_id' => $data['acc_id'],
            'store_id' => $goods_r['store_id'],
            'course_id' => $goods_r['course_id'],
            'goods_id' => $data['goods_id'],
            'store_name' => $goods_r['store_name'],
            'course_name' => $goods_r['course_name'],
            'begin_time' => $goods_r['begin_time'],
            'end_time' => $goods_r['end_time'],
            'status' => 2
        ];
        $appoint_add = $this->T_order_appoint_model->do_add($appoint);
        if (!$appoint_add) {
            return $this->serviceres(false, 'addFail', '添加失败,请联系管理员！');
        }
//		5. 预约成功后，如果无时长卡，则扣除一次次卡，并记录在消费记录中
        if ($type == 'oncecard') {
            $consume = [
                'acc_id' => $data['acc_id'],
                'nature' => 'expend',
                'type' => 'expend_times',
                'name' => '预约' . $goods_r['course_name'],
                'money' => 0,
                'value' => 1,
                'oncecard' => $acc_r['oncecard'] - 1,
                'status' => 1
            ];
            $consume_add = $this->T_order_consume_model->do_add($consume);
            if (!$consume_add) {
                return $this->serviceres(false, 'addFail', '添加失败,请联系管理员！');
            }
            $this->Common_model->single_field_total($data['acc_id'], "t_manage_acc", "oncecard", "sub");
        }
//		6. 更新统计
        $this->Common_model->single_field_total($data['acc_id'], "t_manage_acc", "appoint_total", "add");
        $this->Common_model->single_field_total($data['goods_id'], "t_store_goods", "appoint_total", "add");
        //更新门店id为最后一次预约的id
        $this->T_manage_acc_model->do_update(['id' => $data['acc_id']], ['store_id' => $goods_r['store_id']]);
        return $this->serviceres(true, 'success', '预约成功');
    }

    /**
     * appoint_show
     * 预约预览接口
     * @param $data
     * @return array
     */
    public function appoint_show($data)
    {
        $appoint_r = $this->T_order_appoint_model->do_show($data['id']);
        //开门二维码在开始前30分钟内可以显示
        $openDoor = [
            'time' => time(),
            'id' => $appoint_r['id']
        ];
        $begin_time = strtotime($appoint_r['begin_time']) - 1800;
        $end_time = strtotime($appoint_r['begin_time']) + 1800;
//        if ($openDoor['time'] > $begin_time && $openDoor['time'] < $end_time) {
        if ($openDoor['time'] > $begin_time) {
            $appoint_r['url'] = '/mini/orderapi/qrcode?content=' . $this->setSign($openDoor);
            $appoint_r['code_status'] = 1;
        } else {
            $appoint_r['url'] = '';
            $appoint_r['code_status'] = 0;
        }
        $appoint_r['current_time'] = time();
        $appoint_r['start_time'] = $begin_time;
        if (!$appoint_r) {
            return $this->serviceres(false, 'addFail', '查询失败,请联系管理员！');
        }
        return $this->serviceres(true, 'success', '预约信息查询成功', $appoint_r);
    }

    /**
     * appoint_show_exit
     * 预约查询接口
     * @param $data
     * @return array
     */
    public function appoint_show_exist($data)
    {
        $appoint_r = $this->T_order_appoint_model->do_select_one(['acc_id' => $data['acc_id'], 'status' => 2]);
        if (!$appoint_r) {
            return $this->serviceres(true, 'fail', '没有预约课程',[]);
        }
        return $this->serviceres(true, 'success', '预约信息查询成功', $appoint_r);
    }

    /**
     * consume_list
     * 消费列表接口
     * @param $data
     * @return array
     */
    public function consume_list($data)
    {
        $where = " acc_id=" . $data['acc_id'] . " order by id desc";
        $list_r = $this->T_order_consume_model->do_list($where, $data['page'], $data['limit'], $data['field']);
        $list_r = $list_r ? $list_r : [];
        return $this->serviceres(true, 'success', '列表成功', $list_r);
    }

    /**
     * consume_pay
     * 消费充值接口
     * @param $data
     * @return array
     */
    public function consume_pay($data)
    {
        $acc_r = $this->T_manage_acc_model->do_show($data['acc_id']);
        $code = date('YmdHis') . 'BD' . mt_rand(1000, 9999);
        $consume = [
            'acc_id' => $data['acc_id'],
            'code' => $code,
            'nature' => 'income',
            'type' => $data['type'],
            'name' => $data['name'],
            'money' => $data['money'],
            'value' => $data['value'],
//            'status' => 2
            'status' => 1
        ];
        //天卡
        if ($data['type'] == 'income_days') {
            $consume['timecard'] = date('Y-m-d', strtotime('+' . $data['value'] . ' day', strtotime($acc_r['timecard'])));
            //测试直接添加
            $this->T_manage_acc_model->do_update(['id' => $data['acc_id']], ['timecard' => $consume['timecard']]);
        }
        //次卡
        if ($data['type'] == 'income_times') {
            $consume['oncecard'] = $acc_r['oncecard'] + $data['value'];
            //测试直接添加
            $this->T_manage_acc_model->do_update(['id' => $data['acc_id']], ['oncecard' => $consume['oncecard']]);
        }
        $consume_add = $this->T_order_consume_model->do_add($consume);
        if (!$consume_add) {
            return $this->serviceres(false, 'addFail', '添加失败,请联系管理员！');
        }

        //支付
//        $config_biz = [
//            'out_trade_no' => $code,
//            'total_fee' => (int)$data['money'] * 100,
//            'body' => $data['name'],
//            'spbill_create_ip' => $this->get_client_ip(),
//            'openid' => $acc_r['openid'],
//        ];
//        $pay = new Pay($this->wechat_config);
//        $res = $pay->driver('wechat')->gateway('miniapp')->pay($config_biz);

//        return $this->serviceres(true, 'success', '充值成功', $res);
        return $this->serviceres(true, 'success', '充值成功');
    }

    /**
     * consume_pay_success
     * 充值成功回调接口
     * @param $data
     * @return array
     */
    public function consume_pay_success($data)
    {
        $pay = new Pay($this->wechat_config);
        $verify = $pay->driver('wechat')->gateway('miniapp')->verify($data);
        if ($verify) {
            $order_consume = $this->T_order_consume_model->do_select_one(['code' => $verify['out_trade_no']]);
            //修改订单状态
            $this->T_order_consume_model->do_update(['code' => $verify['out_trade_no']], ['status' => 1]);
            //天卡
            if ($order_consume['type'] == 'income_days') {
                $this->T_manage_acc_model->do_update(['id' => $order_consume['acc_id']], ['timecard' => $order_consume['timecard']]);
            }
            //次卡
            if ($order_consume['type'] == 'income_times') {
                $this->T_manage_acc_model->do_update(['id' => $order_consume['acc_id']], ['oncecard' => $order_consume['oncecard']]);
            }
            echo "success";
        }
    }

    /**
     * 获取客户端IP地址
     * @param integer $type 返回类型 0 返回IP地址 1 返回IPV4地址数字
     * @return mixed
     */
    public function get_client_ip($type = 0)
    {
        $type = $type ? 1 : 0;
        static $ip = NULL;
        if ($ip !== NULL) return $ip[$type];
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $arr = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $pos = array_search('unknown', $arr);
            if (false !== $pos) unset($arr[$pos]);
            $ip = trim($arr[0]);
        } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (isset($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        // IP地址合法验证
        $long = sprintf("%u", ip2long($ip));
        $ip = $long ? array($ip, $long) : array('0.0.0.0', 0);
        return $ip[$type];
    }

    /**
     * qrcode
     * 生成二维码
     */
    public function qrcode($data)
    {
        $qrCode = new QrCode();
        $qrCode->getText();
        $qrCode->setText($data['content'])
            ->setSize(300)//大小
            ->setErrorCorrectionLevel('high')
            ->setForegroundColor(array('r' => 0, 'g' => 0, 'b' => 0, 'a' => 0))
            ->setBackgroundColor(array('r' => 255, 'g' => 255, 'b' => 255, 'a' => 0))
            ->setLabelFontSize(16);
        header('Content-Type: ' . $qrCode->getContentType());
        echo $qrCode->writeString();
        exit;
    }

    /**
     * 生成每次请求的sign
     * @param array $data
     * @return string
     */
    public function setSign($data = [])
    {
        // 1 按字段排序
        ksort($data);
        // 2拼接字符串数据  &
        $string = http_build_query($data);
        // 3通过aes来加密
        $string = $this->common_service->encrypt($string);
        return $string;
    }
}