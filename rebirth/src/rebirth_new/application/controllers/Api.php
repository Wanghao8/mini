<?php if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

//扫码机接口
class Api extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->service('Common_service');
        $this->load->service('Order_service');
    }

    /**
     * CheckCode
     * 数据上传接口
     */
    public function CheckCode()
    {
        $param = $this->input->input_stream('paramaters');
        $data = json_decode($param, true);
        $str = $this->common_service->decrypt($data['CodeVal']);
        if (!preg_match('/&/', $str)) {
            return false;
        }

        //通过解密得到id和time   id=1&time=1577688757
        parse_str($str, $openDoor);
        $appoint_r = $this->T_order_appoint_model->do_show($openDoor['id']);

        //判断时间是否在开始前30分钟或开始后三十分钟时间内   并且二维码没有失效(60秒失效)
        $begin_time = strtotime($appoint_r['begin_time']) - 1800;
        $end_time = strtotime($appoint_r['begin_time']) + 1800;
        $failure_time = $openDoor['time']+60;
        if ($openDoor['time'] > $begin_time && $openDoor['time'] < $end_time && time() < $failure_time ) {
            $res = [
                'UID' => $data['UID'],
                'Status' => 1
            ];
        }else{
            $res = [
                'UID' => $data['UID'],
                'Status' => 0
            ];
        }
        p($res);die;
        echo json_encode($res);
//        Array
//        (
//            [CodeVal] => 998678
//    [CodeType] => Q
//    [BrushTime] => 2018-01-17 10:20:30
//    [ViewId] => D2
//    [UID] => 1001
//    [ UKey] => 3F698DAC58
//    [IsOnline] => 1
//    [SN] => 1701000110
//)
    }

    /**
     * IsConnect
     * 设备通讯心跳接口,包括校时
     */
    public function IsConnect()
    {
        $data['DateTime'] = date('Y-m-d H:i:s', time());
        echo json_encode($data);
    }


}

