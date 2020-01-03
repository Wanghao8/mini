<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Common_service extends MY_Service
{

    private $key = null;

    public function __construct()
    {
        parent::__construct();
        $this->CI = @get_instance();
        $this->load->model('Common_model');
        $this->key = "U4tsVO6WxXGehJl3";
    }

    /**
     * 通用单字段修改
     * @param data $data table,id,filed,value,acc_id,info,role
     * 同时记录操作日志
     * 测试数据 {"phone":"18203643064","info":["1975","2"],"mid":"335936","timeStamp":1537521758,"summary":"06f003870f1b8d8c9ab230b87b3d7ffd"}
     */
    public function single_field_update($data)
    {
        $single_r = $this->Common_model->single_field_update(array('id' => $data['id']), array($data['filed'] => $data['value']), $data['table']);
        if (!$single_r) {
            return $this->serviceres(false, 'upFail', '更新失败！');
        }
        return $this->serviceres(true, ' success', '更新成功！');
    }

    /**
     * 通用单字段查询是否存在
     * 例如身份证号 手机号等是否存在
     */
    public function single_field_exist($data)
    {
        $single_r = $this->Common_model->single_field_exist($data['table'], $data['field'], $data['value']);
        if (!$single_r) {
            return $this->serviceres(false, 'havaExist', '不存在查询结果');
        }
        return $this->serviceres(true, ' success', '已存在查询结果');
    }

    /**
     * 通用身份证识别接口
     * cardurl 身份证图片地址
     */
    //身份证识别信息
    public function get_id_card($cardurl)
    {
        include_once(APPPATH . 'libraries/baidu/AipOcr.php');
        include_once(APPPATH . 'libraries/account/baidu.php');
        $client = new AipOcr($APP_ID, $API_KEY, $SECRET_KEY);
        $image = file_get_contents($cardurl);
        $idCardSide = "front";
        $options = array();
        $options["detect_direction"] = "true";//设置检测图片方向
        $m_row = $client->idcard($image, $idCardSide);
        if (isset($m_row['words_result']) && !empty($m_row['words_result'])) {
            $arr = $m_row['words_result'];
            $res = array("住址" => '', "出生" => '', "姓名" => '', "公民身份号码" => '', "性别" => '', "民族" => '');
            foreach ($arr as $key => $value) {
                $res[$key] = $value['words'];
            }
            return $this->serviceres(true, 'success', '识别成功', $res);
        }
        return $this->serviceres(false, 'fail', '识别失败');
    }

    //星座属相获取
    public function getxingshu($type, $year, $month, $day)
    {
        $dayArr = array(20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22);
        $xingArr = array("摩羯座", "水瓶座", "双鱼座", "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座");
        $shuArr = Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪");
        $zuo = $day < $dayArr[$month - 1] ? $xingArr[$month - 1] : $xingArr[(int)$month];
        $xiang = $shuArr[($year - 1900) % 12];
        $thisYear = date('Y', time());
        $age = $thisYear - $year;
        switch ($type) {
            case "xingzuo":
                $res = $zuo;
                break;
            case "shuxiang":
                $res = $xiang;
                break;
            case "age":
                $res = $age;
                break;
            default:
                $res = "";
        }
        return $res;
    }

    /**
     * 加密
     * @param $input
     * @return false|string
     */
    public function encrypt($input)
    {
        $data = openssl_encrypt($input, 'AES-128-ECB', $this->key, OPENSSL_RAW_DATA);
        $data = base64_encode($data);
        return $data;
    }

    /**
     * 解密
     * @param $input
     * @return false|string
     */
    public function decrypt($input)
    {
        $decrypted = openssl_decrypt(base64_decode($input), 'AES-128-ECB', $this->key, OPENSSL_RAW_DATA);
        return $decrypted;
    }
}

?>
