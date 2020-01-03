<?php
/**
 * 扩展 Controller
 */
class MY_Controller extends CI_Controller{
    function  __construct(){
        parent::__construct();
    }
    //app端返回数据格式
    public  function actionres($res,$code,$msg = '',$data=null) {
        $result = array(
            'res' =>$res,
            'code' => $code,
            'msg' => $msg,
            'data' => $data
        );
        echo json_encode($result);
        exit;               
    }
    //web端返回格式
    public  function layuires($rows) {
        $result = array(
            'count'=>$rows['count'],
            'code'=>0,
            'msg'=>'',
            'data' =>$rows['data']
        );
        echo json_encode($result);
        exit;               
    }
}
 
/**web端资源调用
 * 暂时未做任何登陆权限验证
 */
class WebRes extends MY_Controller{
    function  __construct(){
        parent::__construct();
        self::init();
    }
    private function init(){
	    $this->config->load('default',true);
        $default_config = $this->config->item('default');
        define('SITE_URL',$default_config['site_url']);
        define('STATICS_URL',$default_config['statics_url']);
        define('QINIU_URL',$default_config['qiniu_url']);
        $this->load->helper("url");
    }
}

/**web端管理验证
 * 登录之后session验证
 */
class WebMan extends MY_Controller{
    function  __construct(){
        parent::__construct();
        self::init();
        @session_start();
        $this->check_login();
    }
    //加载后台默认配置
    private function init(){
        $this->config->load('default',true);
        $default_config = $this->config->item('default');
        define('SITE_URL',$default_config['site_url']);
        define('STATICS_URL',$default_config['statics_url']);
        define('QINIU_URL',$default_config['qiniu_url']);
        $this->load->library("session");
        $this->load->helper("url");
        $this->load->helper("cookie"); 
    }
    public function check_login(){
        if(!isset($_SESSION['user'])){
            echo "<script> alert('您没有登录,即将跳转到系统登陆页面');top.location.href='".SITE_URL."index/login'; </script>";
            exit;    
        }
    }
}