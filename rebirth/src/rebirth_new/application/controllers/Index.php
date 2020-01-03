<?php if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}
//登录页面
class Index extends WebRes
{
    public function __construct()
    {
        parent::__construct();
    }
    /**
     * 网站首页链接
     */
    public function index()
    {
        $this->load->view('web/indexw/index');
    }
    /**
     * 管理人员登录
     */
    public function login()
    {
        $this->load->view('web/indexw/login');
    }
    /**
     * 管理人员退出
     */
    public function loginout()
    {
        $this->load->library("session");
        @session_start();
        unset($_SESSION['member']);
        echo "<script>top.location.href='".SITE_URL."/index/login'; </script>";
    }
}
