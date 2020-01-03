<?php if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

//管理模块接口
class Manageapi extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->service('Manage_service');
    }

    /**
     * 利用code获取openid及用户信息
     * 参数 code
     */
    public function code2Session()
    {
        $param = $this->input->get();
        if (!(isset($param['code']))) {
            return $this->actionres(false, "noCode", "code参数你没有带上呀");
        }
        include_once APPPATH . "libraries/wechat/Wxmini.php";
        $wxmini = new Wxmini();
        $wechat = $wxmini->code2Session($param['code']);
        if (isset($wechat["errcode"])) {
            return $this->actionres(false, $wechat["errcode"], $wechat['errmsg']);
        }
        return $this->actionres(true, "success", "获取openid成功", $wechat);
    }

    /**
     * 利用code获取openid及用户信息
     * 参数 code
     */
    public function acc_login_code()
    {
        $param = $this->input->get();
        if (!(isset($param['code']) && isset($param['p_acc_id']) && isset($param['latlong']))) {
            return $this->actionres(false, "loseParam", "缺失请求参数");
        }
        include_once APPPATH . "libraries/wechat/Wxmini.php";
        $wxmini = new Wxmini();
        $wechat = $wxmini->code2Session($param['code']);
        if (isset($wechat["errcode"])) {
            return $this->actionres(false, $wechat["errcode"], $wechat['errmsg']);
        }
        $wechat['p_acc_id'] = $param['p_acc_id'];
        $wechat['latlong'] = $param['latlong'];
        //查询opendid是否存在
        $row = $this->manage_service->acc_login_openid($wechat);
        echo json_encode($row);
    }

    /**
     * acc_update_phone 解密手机号码
     * 利用code获取openid
     * 参数 code
     */
    public function acc_edit_phone()
    {
        $param = $this->input->post();
        if (!(isset($param['encryptedData']) && isset($param['iv']) && isset($param['sessionKey']) && isset($param['acc_id']))) {
            return $this->actionres(false, "noCode", "解密的三个参数不可为空");
        }
        include_once APPPATH . "libraries/wechat/Wxmini.php";
        $wxmini = new Wxmini();
        $row = $wxmini->decryptPhone($param['encryptedData'], $param['iv'], $param['sessionKey']);
        if (!$row['res']) {
            return $this->actionres(false, "errorPhone", $row['msg']);
        }
        $phoneData = json_decode($row['data'], true);
        //fwrite(fopen('./log.txt', 'a'),"acc_edit_phone ".date("Y-m-d H:i:s")." ".$row['data']."\r\n".$phoneData."\r\n");
        $updata = array('acc_id' => $param['acc_id'], 'phone' => $phoneData['phoneNumber']);
        $row = $this->manage_service->acc_edit_info($updata);
        echo json_encode($row);
    }

    /**
     * acc_edit_info 修改用户信息
     * 利用code获取openid
     * 参数 code
     */
    public function acc_edit_info()
    {
        $param = $this->input->post();
        if (!(isset($param['acc_id']))) {
            return $this->actionres(false, "noCode", "用户信息不能为空");
        }
        $row = $this->manage_service->acc_edit_info($param);
        echo json_encode($row);
    }

    /**
     * acc_show 查询最新用户信息
     * 利用code获取openid
     * 参数 code
     */
    public function acc_show()
    {
        $param = $this->input->get();
        if (!(isset($param['acc_id']))) {
            return $this->actionres(false, "noCode", "用户信息不能为空");
        }
        $row = $this->manage_service->acc_show($param);
        echo json_encode($row);
    }

    /**
     * 用户信息登录接口
     * 参数 wechat实体信息
     */
    public function acc_login_out()
    {
        $param = $this->input->get();
        if (!(isset($param['acc_id']))) {
            return $this->actionres(false, "acc_id", "无效信息 未查询到acc_id");
        }
        $where = array('table' => 't_manage_acc', 'id' => $param['acc_id'], 'filed' => 'openid', 'value' => '');
        $row = $this->common_service->single_field_update($where);
        echo json_encode($row);
        exit;
    }

    /**
     * share_code
     * 生成海报
     */
    public function share_code()
    {
        $param = $this->input->get();
        if (!(isset($param['p_acc_id']))) {
            return $this->actionres(false, "loseParam", "缺少请求参数");
        }
        $row = $this->manage_service->share_code($param);
        echo json_encode($row);
        exit;
    }
}

