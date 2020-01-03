<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Manage_service extends MY_Service
{
    public function __construct()
    {
        parent::__construct();
        $this->CI = @get_instance();
        $this->load->model('Common_model');
        $this->load->model('T_manage_acc_model');
        $this->load->model('T_store_model');
        $this->load->model('T_order_consume_model');
    }

    /**
     * acc_login_openid
     * 小程序端登录使用
     * mini 场景使用
     */
    public function acc_login_openid($wechat)
    {
        $acc_r = $this->T_manage_acc_model->do_one("openid", $wechat['openid']);
        if ($acc_r) {
            return $this->serviceres(true, 'success', '用户信息获取成功', $acc_r);
        }
        //查询上级是否存在
        if ($wechat['p_acc_id'] != 0) {
            $p_acc_r = $this->T_manage_acc_model->do_show($wechat['p_acc_id']);
            if (!$p_acc_r) {
                return $this->serviceres(true, 'noAcc', '推荐用户不存在');
            }
        }
        //根据经纬度查出最近的门店,如果没有授权位置则随机给一个门店id
        $store_list = $this->T_store_model->do_list('', 0, 0, 'id,latlong');
        if ($wechat['latlong'] == '0,0') {
            $wechat['store_id'] = $store_list[array_rand($store_list, 1)]['id'];
        } else {
            if (!empty($store_list)) {
                //1. 引入距离服务
                include_once APPPATH . "libraries/wechat/Wxmini.php";
                $wxmini = new Wxmini();
                //2. 循环拼装位置
                $to_latlons = "";
                foreach ($store_list as $site_item) {
                    $to_latlons .= $site_item['latlong'] . ";";
                }
                $to_latlons = substr($to_latlons, 0, strlen($to_latlons) - 1);
                //4.请求腾讯距离
                $julidata = $wxmini->mapDistance($wechat['latlong'], $to_latlons);
                $elements = $julidata['result']['elements'];
                foreach ($elements as $k => $v) {
                    $store_list[$k]['distance'] = $v['distance'];
                    $new_arr[] = $v['distance'];
                }
            }
            //升序排序
            asort($new_arr);
            $key = array_keys($new_arr)[0];
            $wechat['store_id'] = $store_list[$key]['id'];
        }
        $acc_id = $this->T_manage_acc_model->do_add($wechat);
        //新用户赠送一次次卡
        $consume = [
            'acc_id' => $acc_id,
            'nature' => 'income',
            'type' => 'income_times',
            'name' => '注册赠送次卡一次',
            'money' => 0,
            'value' => 1,
            'oncecard' => 1,
            'status' => 1
        ];
        $this->T_order_consume_model->do_add($consume);
        //更新acc表单个字段
        $acc_update = [
            'id' => $acc_id,
            'field' => 'oncecard',
            'value' => 1,
            'table' => 't_manage_acc'
        ];
        $this->Common_model->single_field_update(['id' => $acc_update['id']], [$acc_update['field'] => $acc_update['value']], $acc_update['table']);
        //更新父级下属成员统计总数
        if ($wechat['p_acc_id'] != 0) {
            $this->Common_model->single_field_total($wechat['p_acc_id'], "t_manage_acc", "acc_total", "add");
        }
        $data = $this->T_manage_acc_model->do_show($acc_id);
        return $this->serviceres(true, 'success', '用户信息获取成功', $data);
    }

    /**
     * acc_edit_info
     * 添加/修改用户信息
     * 传递实体返回状态
     */
    public function acc_edit_info($data)
    {
        //查询用户是否存在
        $acc_r = $this->T_manage_acc_model->do_show($data['acc_id']);
        if (!$acc_r) {
            return $this->serviceres(false, 'editFail', '用户信息不存在');
        }
        //判断是否有微信头像
        if (isset($data['avatarUrl'])) {
            include_once APPPATH . "libraries/qiniu/Qiniu_upload.php";
            $qiniuup = new Qiniu_upload();
            try {
                $avatarUrl = $qiniuup->headimgurl($data['avatarUrl']);
                $data['avatarUrl'] = $avatarUrl;
            } catch (Exception $e) {
                $data['avatarUrl'] = "";
            }
        }
        //执行用户修改操作
        $acc_up = $this->T_manage_acc_model->do_update(array('id' => $data['acc_id']), $data);
        if (!$acc_up) {
            return $this->serviceres(false, 'editFail', '修改失败，检查数据格式');
        }
        return $this->serviceres(true, 'success', '用户信息修改成功，更新成功');
    }

    /**
     * acc_show
     * 小程序端登录使用
     * mini 场景使用
     */
    public function acc_show($data)
    {
        $acc_r = $this->T_manage_acc_model->do_show($data['acc_id']);
        if (!$acc_r) {
            return $this->serviceres(false, 'noAcc', '用户信息获取失败');
        }
        return $this->serviceres(true, 'success', '用户信息获取成功', $acc_r);
    }

    /**
     * acc_login
     * 小程序用户信息登录
     * 传递实体返回状态
     */
    public function acc_login($data)
    {
        //查询用户信息是否存在
        $acc_r = $this->T_manage_acc_model->do_one("phone", $data['phone']);
        if ($acc_r) {
            return $this->serviceres(true, 'success', '信息获取成功', array('id' => $acc_r['id'], 'resume_id' => $acc_r['resume_id'], 'phone' => $acc_r['phone'], 'status' => $acc_r['status']));
        }
        //执行acc用户添加
        $acc_add = $this->T_manage_acc_model->do_add($data);
        if (!$acc_add) {
            return $this->serviceres(false, 'error', '登陆错误，请联系管理员400-800-9033');
        }
        $acc_r = array('id' => $acc_add, 'resume_id' => 0, 'phone' => $data['phone'], 'status' => 1);
        return $this->serviceres(true, 'success', '用户登陆成功', $acc_r);
    }

    /**
     * log_list
     * 添加系统操作日志
     * app wechat web多场景使用
     */
    public function log_list($data)
    {
        $list_r = $this->T_manage_log_model->do_list($data['where'], $data['page'], $data['limit'], $data['field']);
        $list_r = $list_r ? $list_r : [];
        return $this->serviceres(true, 'success', '列表成功', $list_r);
    }

    /**
     * log_add
     * 添加系统操作日志
     * app wechat web多场景使用
     */
    public function log_add($data)
    {
        $m_r = $this->T_manage_log_model->log_add($data['acc_id'], $data['sub_id'], $data['sub_type'], $data['role'], $data['action'], $data['info'], implode(",", $data));
        if (!$m_r) {
            return $this->serviceres(false, 'logAddError', '日志添加失败');
        }
        return $this->serviceres(true, 'success', '日志添加成功');
    }

    /**
     * share_code
     * 生成海报
     */
    public function share_code($data)
    {
        $acc_r = $this->T_manage_acc_model->do_show($data['p_acc_id']);
        if (!empty($acc_r['share_code'])) {
            $share_code = $acc_r['share_code'];
        } else {
            include_once APPPATH . "libraries/wechat/Wxmini.php";
            $wxmini = new Wxmini();
            $share_code = $wxmini->qrcode($data['p_acc_id']);
            $update['share_code'] = $share_code;
            $this->T_manage_acc_model->do_update(array('id' => $data['p_acc_id']), $update);
        }
        return $this->serviceres(true, 'success', '海报生成成功', $share_code);
    }
}