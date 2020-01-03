<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
include_once APPPATH."libraries/GatewayClient/Gateway.php";
include_once APPPATH.'../vendor/autoload.php';
use GatewayClient\Gateway;
use Yansongda\Pay\Pay;
Gateway::$registerAddress = '47.104.195.149:1237';
class Goods_service extends MY_Service {
    public function __construct(){
        parent::__construct();
        $this->CI = @get_instance();
        $this->load->model('T_manage_acc_model');
        $this->load->model('T_goods_model');
        $this->load->model('T_goods_bond_model');
        $this->load->model('T_goods_offer_model');
        $this->load->model('Common_model');
    }

    /**
     * 微信配置
     * @var array
     */
    protected $wechat_config = [
        'wechat' => [
            'miniapp_id' => 'wx2b06ca993015783a',
            'mch_id' => '1569936791',
            'notify_url' => 'https://paimai.yuanfangyun.com/index.php/mini/goodsapi/notify',
            'key' => 'AE982BB6CA3DCC577526C28CE3AAD4DA',
            'cert_client' => '/www/web/paimai_yuanfangyun_com/public_html/application/libraries/wechat/apiclient_cert.pem',
            'cert_key' => '/www/web/paimai_yuanfangyun_com/public_html/application/libraries/wechat/apiclient_key.pem',
        ],
    ];

    /**
     * goods_list
     * 拍品列表
     */
    public function goods_list($data){
        $list_r=$this->T_goods_model->do_list($data['where'],$data['page'],$data['limit'],$data['field']);
        $list_r=$list_r?$list_r:[];
        array_walk($list_r,function(&$v){
            $goods_offer = $this->T_goods_offer_model->do_select_one(array('goods_id'=>$v['id']));
            $v['is_offer'] = $goods_offer ? 1 : 0;
            if ((strtotime($v['delay_time'])-time()) >= 0){
                $v['countdown_time'] = strtotime($v['delay_time']) - time();
            }else{
                $v['countdown_time'] = 0;
            }
        });
        $count_query = $this->db->query("select count(*) from t_goods where ".$data['where']);
        $count = current($count_query->row_array());
        return $this->serviceres(true,'success','列表成功',$list_r,$count);
    }

    /**
     * goods_add
     * 拍品信息添加
     * 传递实体返回状态
     */
    public function goods_add($data){
        //执行添加操作
        $goods_add=$this->T_goods_model->do_add($data);
        if(!$goods_add){
            return $this->serviceres(false,'addFail','添加失败,请联系管理员！');
        }
        return $this->serviceres(true,'success','拍品信息添加成功');
    }

    /**
     * goods_show
     * 拍品信息预览
     * 信息预览操作
     */
    public function goods_show($data){
        $goods_show=$this->T_goods_model->do_show_goods($data['id']);
        if(!$goods_show){
            return $this->serviceres(true,'notExist','未查询到拍品详细信息');
        }
        if ((strtotime($goods_show['delay_time'])-time()) >= 0){
            $goods_show['countdown_time'] = strtotime($goods_show['delay_time']) - time();
        }else{
            $goods_show['countdown_time'] = 0;
        }
        $offer_list = $this->T_goods_offer_model->do_offer_list($data['id']);
        array_walk($offer_list,function(&$v){
            $v['add_time'] = $this->get_last_time(strtotime($v['add_time']));
        });
        $data = [
            'goods' => $goods_show,
            'offer_list' => $offer_list
        ];
        return $this->serviceres(true,'success','查询成功！',$data);
    }


    /**
     * goods_bond_add
     * 拍品保证金添加
     * 传递实体返回状态
     */
    public function goods_bond_add($data){
        $goods = $this->T_goods_model->do_show($data['goods_id']);
        $now_time = date('Y-m-d H:i:s');
        if (!$goods || !($goods['start_time']<$now_time && $goods['delay_time']>$now_time)){
            return $this->serviceres(false,'editFail','拍卖已结束');
        }
        //调试状态
//        $data['status'] = 1;
//        $data['pay_status'] = 1;
        $data['order_sn'] = date('YmdHis').'BD'.mt_rand(1000,9999);
        //执行添加操作
        $bond_add=$this->T_goods_bond_model->do_add($data);
        if(!$bond_add){
            return $this->serviceres(false,'addFail','添加失败,请联系管理员！');
        }
        $this->Common_model->single_field_total($data['goods_id'], "t_goods", "bond_count", "add");

        //支付
        $config_biz = [
            'out_trade_no' => $data['order_sn'],
            'total_fee' => (int)$goods['bond_price']*100,
            'body' => "保证金:".$goods['name'],
            'spbill_create_ip' => $this->get_client_ip(),
            'openid' => $data['openid'],
        ];
        $pay = new Pay($this->wechat_config);

        $res = $pay->driver('wechat')->gateway('miniapp')->pay($config_biz);

        return $this->serviceres(true,'success','保证金缴纳成功',$res);
    }

    /**
     * 拍品出价列表
     * @param $data
     */
    public function goods_offer_list($data){

    }

    /**
     * goods_offer_add
     * 拍品出价
     * 传递实体返回状态
     */
    public function goods_offer_add($data){
        $goods = $this->T_goods_model->do_show($data['goods_id']);
        if ($data['money'] <  $goods['start_price']){
            return $this->serviceres(false,'editFail','出价不能小于起始价格');
        }
        $now_time = date('Y-m-d H:i:s');
        if (!($goods['start_time']<$now_time && $goods['delay_time']>$now_time)){
            return $this->serviceres(false,'editFail','拍卖已结束');
        }
        //查询最后一次出价
        $goods_offer = $this->T_goods_offer_model->do_select_one(array('goods_id'=>$data['goods_id'],'status'=>1));
        if ($goods_offer){
            if ($data['money'] <= $goods_offer['money']){
                return $this->serviceres(false,'editFail','出价不能小于上次出价价格');
            }
            //执行添加之前先把出价表此商品的其余状态改为0
            $offer_up=$this->T_goods_offer_model->do_update(array('goods_id' => $data['goods_id']),['status'=>0]);
            if(!$offer_up){
                return $this->serviceres(false,'editFail','出价状态更新失败');
            }
        }

        //修改商品的最后出价和出价人
        $update['win_acc_id'] = $data['acc_id'];
        $update['last_price'] = $data['money'];
        //时间延迟
        if (time() > (strtotime($goods['delay_time']) - $goods['delay'])){
            $update['delay_time'] = date('Y-m-d H:i:s',time() + $goods['delay']);
        }
        $goods_up = $this->T_goods_model->do_update(array('id'=>$data['goods_id']),$update);
        if(!$goods_up){
            return $this->serviceres(false,'editFail','拍品最后出价更新失败');
        }
        //执行添加操作
        $data['status'] = 1;
        $offer_add=$this->T_goods_offer_model->do_add($data);
        if(!$offer_add){
            return $this->serviceres(false,'addFail','出价失败,请联系管理员！');
        }
        $this->Common_model->single_field_total($data['goods_id'], "t_goods", "offer_count", "add");

        //出价成功后发送消息给群组
//        $user = Gateway::getUidListByGroup($data['goods_id']);
//        if (!empty($user)){
//            foreach ($user as $v){
//                $goods_show['id'] = $data['goods_id'];
//                $goods_show['acc_id'] = $v;
//                $message = $this->goods_show($goods_show);
//                $message['type'] = "data";
//                Gateway::sendToUid($v,json_encode($message));
//            }
//        }
        $goods_show['id'] = $data['goods_id'];
        $message = $this->goods_show($goods_show);
        $message['type'] = "data";
        Gateway::sendToGroup($data['goods_id'], json_encode($message));

        return $this->serviceres(true,'success','出价成功');
    }

    /**
     * participate_goods_list
     * 我参与的拍品列表
     */
    public function participate_goods_list($data){
        $data['where'] = "id in(select goods_id from t_goods_bond where acc_id=".$data['acc_id'].") order by id desc";
        $list_r=$this->T_goods_model->do_participate_list($data['where'],$data['page'],$data['limit'],$data['field']);
        $list_r=$list_r?$list_r:[];
        array_walk($list_r,function(&$v){
            $goods_offer = $this->T_goods_offer_model->do_select_one(array('goods_id'=>$v['id']));
            $v['is_offer'] = $goods_offer ? 1 : 0;
            if ((strtotime($v['delay_time'])-time()) >= 0){
                $v['countdown_time'] = strtotime($v['delay_time']) - time();
            }else{
                $v['countdown_time'] = 0;
            }
        });
        $count_query = $this->db->query("select count(*) from t_goods where ".$data['where']);
        $count = current($count_query->row_array());
        return $this->serviceres(true,'success','列表成功',$list_r,$count);
    }

    /**
     * bond_list
     * 保证金列表
     */
    public function bond_list($data){
        $data['where'] = "a.acc_id=".$data['acc_id']." order by id desc ";
        $data['field'] = "a.*,b.name as goods_name,b.delay_time";
        $list_r=$this->T_goods_bond_model->do_bond_list($data['where'],$data['page'],$data['limit'],$data['field']);
        $list_r=$list_r?$list_r:[];
        $count_query = $this->db->query("select count(*) from t_goods_bond where acc_id=".$data['acc_id']);
        $count = current($count_query->row_array());
        return $this->serviceres(true,'success','列表成功',$list_r,$count);
    }

    /**
     * publish_goods_list
     * 我发布的拍品列表
     */
    public function publish_goods_list($data){
        $data['where'] = "a.acc_id=".$data['acc_id']." order by id desc";
        $data['field'] = "a.*,b.nickName,b.avatarUrl,b.phone as acc_phone,c.phone as bond_phone";
        $list_r=$this->T_goods_model->do_publish_list($data['where'],$data['page'],$data['limit'],$data['field']);
        $list_r=$list_r?$list_r:[];
        array_walk($list_r,function(&$v){
            $goods_offer = $this->T_goods_offer_model->do_select_one(array('goods_id'=>$v['id']));
            $v['is_offer'] = $goods_offer ? 1 : 0;
        });
        $count_query = $this->db->query("select count(*) from t_goods where acc_id=".$data['acc_id']);
        $count = current($count_query->row_array());
        return $this->serviceres(true,'success','列表成功',$list_r,$count);
    }


    /**
     * 格式化时间
     * @param $time
     * @return false|string
     */
    public function get_last_time($time)
    {
        // 当天最大时间
        $todayLast = strtotime(date('Y-m-d 23:59:59'));
        $agoTimeTrue = time() - $time;
        $agoTime = $todayLast - $time;
        $agoDay = floor($agoTime / 86400);

        if ($agoTimeTrue < 60) {
            $result = '刚刚';
        } elseif ($agoTimeTrue < 3600) {
            $result = (ceil($agoTimeTrue / 60)) . '分钟前';
        } elseif ($agoTimeTrue < 3600 * 12) {
            $result = (ceil($agoTimeTrue / 3600)) . '小时前';
        } elseif ($agoDay == 1) {
            $result = '昨天 ';
        } elseif ($agoDay == 2) {
            $result = '前天 ';
        } else {
            $format = date('Y') != date('Y', $time) ? "Y-m-d" : "m-d";
            $result = date($format, $time);
        }
        return $result;
    }

    /**
     * 获取用户缴纳保证金状态和出价状态
     * @param $data
     * @return array
     */
    public function get_user_status($data)
    {
        $goods_bond =$this->T_goods_bond_model->do_select_one(array('acc_id'=>$data['acc_id'],'goods_id'=>$data['goods_id'],'pay_status'=>1));
        $goods_offer = $this->T_goods_offer_model->do_select_one(array('acc_id'=>$data['acc_id'],'goods_id'=>$data['goods_id']));
        $user_status = [
            'bond_status' => $goods_bond ? 1 :0,
            'offer_status' => $goods_offer ? 1 : 0
        ];
        return $this->serviceres(true,'success','查询成功！',$user_status);
    }

    /**
     * 获取客户端IP地址
     * @param integer $type 返回类型 0 返回IP地址 1 返回IPV4地址数字
     * @return mixed
     */
    public function get_client_ip($type = 0) {
        $type       =  $type ? 1 : 0;
        static $ip  =   NULL;
        if ($ip !== NULL) return $ip[$type];
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $arr    =   explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $pos    =   array_search('unknown',$arr);
            if(false !== $pos) unset($arr[$pos]);
            $ip     =   trim($arr[0]);
        }elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
            $ip     =   $_SERVER['HTTP_CLIENT_IP'];
        }elseif (isset($_SERVER['REMOTE_ADDR'])) {
            $ip     =   $_SERVER['REMOTE_ADDR'];
        }
        // IP地址合法验证
        $long = sprintf("%u",ip2long($ip));
        $ip   = $long ? array($ip, $long) : array('0.0.0.0', 0);
        return $ip[$type];
    }

    /**
     * 支付成功回调处理(验签,修改pay_status)
     * @param $data
     */
    public function bond_notify($data)
    {
        $pay = new Pay($this->wechat_config);
        $verify = $pay->driver('wechat')->gateway('miniapp')->verify($data);
        if ($verify) {
//            file_put_contents('notify.txt', "收到来自微信的异步通知\r\n", FILE_APPEND);
//            file_put_contents('notify.txt', '订单号：' . $verify['out_trade_no'] . "\r\n", FILE_APPEND);
//            file_put_contents('notify.txt', '订单金额：' . $verify['total_fee'] . "\r\n\r\n", FILE_APPEND);
            $this->T_goods_bond_model->do_update(['order_sn'=>$verify['out_trade_no']],['pay_status'=>1,'status'=>1]);
            echo "success";
        } else {
//            file_put_contents(storage_path('notify.txt'), "收到异步通知\r\n", FILE_APPEND);
        }
    }

    /**
     * 拍卖结束后查询缴纳保证金未成功竞拍的人
     */
    public function bond_refund()
    {
        $goods_where = " delay_time<=now() and bond_refund_status=0 order by id desc";
        $list_r=$this->T_goods_model->do_list($goods_where,0,0);
        if (!empty($list_r)){
            foreach ($list_r as $v){
                $bond_where = " goods_id=".$v['id']." and status=1 and pay_status=1";
                $bond_list = $this->T_goods_bond_model->do_list($bond_where,0,0);
                if (!empty($bond_list)){
                    foreach ($bond_list as $vv){
                        //查询是否中拍
                        $goods_offer = $this->T_goods_offer_model->do_select_one(array('acc_id'=>$vv['acc_id'],'goods_id'=>$vv['goods_id'],'status'=>1));
                        if (!$goods_offer){
                            $order = [
                                'out_trade_no' => $vv['order_sn'],
                                'out_refund_no' => date('YmdHis').'BD'.mt_rand(1000,9999),
                              'total_fee' => (int)$vv['money']*100,
                              'refund_fee' => (int)$vv['money']*100,
//                                'total_fee' => 1,
//                                'refund_fee' => 1,
                                'refund_desc' => '保证金退款:'.$v['name'],
                                'miniapp' => 1
                            ];
                            $pay = new Pay($this->wechat_config);
                            $res = $pay->driver('wechat')->gateway('miniapp')->refund($order);
                            if (isset($res['return_code']) && $res['return_code'] === 'SUCCESS' || $res['result_code'] === 'SUCCESS') {
                                $this->T_goods_bond_model->do_update(['id'=>$vv['id']],['status'=>2]);
                            }
                        }
                    }
                }
                //修改商品保证金退还状态
                $this->T_goods_model->do_update(['id'=>$v['id']],['bond_refund_status'=>1]);
            }
        }
    }



}