<?php if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

//门店模块接口
class Storeapi extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->service('Store_service');
    }

    /**
     * goods_list
     * 门店排课列表
     */
    public function goods_list()
    {
        $param = $this->input->post();
        $param['page'] = 0;
        $param['limit'] = 0;
        $param['field'] = '*';
        if (!isset($param['store_id']) || !isset($param['dayn']) || !isset($param['page']) || !isset($param['limit'])) {
            return $this->actionres(false, 'loseParam', '缺失请求参数！');
        }
        $row = $this->store_service->goods_list($param);
        echo json_encode($row);
        exit;
    }

    /**
     * goods_show
     * 门店排课详情
     */
    public function goods_show()
    {
        $param = $this->input->get();
        if (!(isset($param['id']) && isset($param['acc_id']))) {
            return $this->actionres(false, "loseParam", "缺失请求参数");
        }
        $row = $this->store_service->goods_show($param);
        echo json_encode($row);
        exit;
    }

    /**
     * goods_edit
     * 排课添加/修改接口
     */
    public function goods_edit()
    {
        $param = $this->input->post();
        if (!(isset($param['id']))) {
            return $this->actionres(false, "noId", "id参数没有给我");
        }
        $row = $this->store_service->goods_edit($param);
        echo json_encode($row);
        exit;
    }

    /**
     * goods_delete
     * 排课删除接口
     */
    public function goods_delete()
    {
        $param = $this->input->post();
        if(!isset($param['id'])){
            return $this->actionres(false,'loseParam','缺失请求参数！');
        }
        $row=$this->store_service->goods_delete($param);
        echo json_encode($row);
        exit;
    }

    /**
     * goods_done
     * 排课完成接口
     */
    public function goods_done()
    {
        $param = $this->input->post();
        if(!isset($param['id'])){
            return $this->actionres(false,'loseParam','缺失请求参数！');
        }
        $row=$this->store_service->goods_done($param);
        echo json_encode($row);
        exit;
    }

    /**
     * store_list
     * 门店列表
     */
    public function store_list()
    {
        $param = $this->input->post();
        $param['page'] = 0;
        $param['limit'] = 0;
        $param['field'] = '*';
        if (!isset($param['page']) || !isset($param['limit']) || !isset($param['latlong'])) {
            return $this->actionres(false, 'loseParam', '缺失请求参数！');
        }
        $row = $this->store_service->store_list($param);
        echo json_encode($row);
        exit;
    }

    /**
     * store_show
     * 门店详情
     */
    public function store_show()
    {
        $param = $this->input->get();
        if (!(isset($param['id']))) {
            return $this->actionres(false, "noId", "id参数没有给我");
        }
        $row = $this->store_service->store_show($param['id']);
        echo json_encode($row);
        exit;
    }

    /**
     * course_list
     * 课程列表
     */
    public function course_list()
    {
        $param = $this->input->post();
        $param['page'] = 0;
        $param['limit'] = 0;
        $param['field'] = '*';
        if (!isset($param['page']) || !isset($param['limit'])) {
            return $this->actionres(false, 'loseParam', '缺失请求参数！');
        }
        $row = $this->store_service->course_list($param);
        echo json_encode($row);
        exit;
    }

}

