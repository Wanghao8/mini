<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 电脑端打开页面所需接口
 * 微信登录+手机号登陆+
 * 部分接口无需登录验证 可直接上传
 */
class Indexapi extends WebRes{
    public function __construct(){
        parent::__construct();
        $this->load->library("session");
        $this->load->helper("cookie"); 
        $this->load->service('Manage_service');
        @session_start();
        header('Content-Type:application/json; charset=utf-8');
    }

    /**
     * 用户手机登录接口
     * 参数 acc_login_phone
     * 返回 acc_id acc_token
     */
    public function acc_login_phone(){
        //执行账号查看
        $param = $this->input->post();
        if(!(isset($param['phone'])&&isset($param['password']))){
            return $this->actionres(false,'loseParam','缺失请求参数！');
        }
        $row=$this->manage_service->user_login($param); 
        $user=$row['data'];
        if(!$user){
            return $this->actionres(false,'errorAccount','账号密码错误，请核对');
        }
        if(!($user['role']=='manage'&&$user['status']==1)){
            return $this->actionres(false,'quanxianError','权限不足，非管理员或账号已被停用');
        }
        //写入系统缓存中
        $_SESSION['user']=$user;
        return $this->actionres(true,'success','登陆成功');
    }

    /**
     * [img_up_layedit 编辑器中图片上传
     *  model实体信息
     */
    public function img_up_layedit(){
        if (!isset($_FILES['file'])||empty($_FILES['file'])) {
            return json_encode(array('code'=>1,'msg'=>'未找到有效文件','data'=>''));
        }
        include_once APPPATH."libraries/qiniu/Qiniu_upload.php";
        $qiniu_up = new Qiniu_upload();
        $imgSrc=$qiniu_up->formdata($_FILES['file']);
        $xx=array('code'=>0,'msg'=>'','data'=>array('src'=>QINIU_URL.$imgSrc,'title'=>''));
        echo json_encode($xx);
        exit;
    }
}