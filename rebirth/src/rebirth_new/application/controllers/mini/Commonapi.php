<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Commonapi extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->service('Common_service');
        header('Content-Type:application/json; charset=utf-8');
    }

    /**
     * [single_field_update 单字段修改接口]
     * @param table,id,filed,value,info,role,acc_id
     * 传入参数对应解释:数据表，数据id,字段名，字段修改值，修改信息，role，角色，acc_id
     * @return res ture/false
     * @return data 无返回
     */
    public function single_field_update()
    {
        $param = $this->input->post();
        if (empty($param)) {
            return $this->actionres(false, 'MissingParameter', '缺失请求参数！');
        }
        $row = $this->common_service->single_field_update($param);
        echo json_encode($row);
        exit;
    }

    /**
     * [qiniu_uptoken 七牛云token获取] 调用七牛上传插件
     * @param timeStamp summary
     * @return data 0
     * data[0]=uptoken值
     */
    public function qiniu_uptoken()
    {
        include_once APPPATH . "libraries/qiniu/Qiniu_upload.php";
        $qiniu_upload = new Qiniu_upload();
        $uptoken = $qiniu_upload->uptoken();
        echo json_encode($uptoken);
        exit;
    }

    /**
     * [get_id_card 身份证识别接口]
     * @param cardurl
     * 参数释义:身份证地址
     * @return res true/false
     */
    public function get_id_card()
    {
        $cardurl = $this->input->get('cardurl');
        if ($cardurl == '') {
            $this->actionres(false, 'Missing parameter', '缺失参数', '');
        }
        $row = $this->common_service->get_id_card($cardurl);
        echo json_encode($row);
        exit;
    }

    /**
     * [get_bank_card 银行卡识别接口]
     * @param cardurl
     * 参数释义:身份证地址
     * @return res true/false
     */
    public function get_bank_card()
    {
        $cardurl = $this->input->post('cardurl');
        if ($cardurl == '') {
            $this->actionres(false, 'Missing parameter', '缺失参数', '');
        }
        $row = $this->common_service->get_bank_card($cardurl);
        echo json_encode($row);
        exit;
    }

    /**
     * [get_phone_code 获取短信验证码]
     * @param cardurl
     * 参数释义:身份证地址
     * @return res true/false
     */
    public function get_phone_code($phone)
    {
        //手机号校验
        if (strlen($phone) != 11) {
            return $this->serviceres(false, 'fail', '手机号不符合规则');
        }
        //发送短信
        include_once APPPATH . "libraries/yuntongxun/CCsms.php";
        $ccsms = new CCsms();
        $smsArr = $ccsms->send_code_sms($phone);
        $result = $smsArr['result'];
        $code = $smsArr['code'];
        if (!$result) {
            $this->actionres(false, 'notSend', '系统没有发送短信！');
        }
        if ($result->statusCode != 0) {
            $this->actionres(false, 'sendFail', $result->statusCode . ' ' . $result->statusMsg);
        }
        $this->actionres(true, 'success', '', $code);
        exit;
    }
}