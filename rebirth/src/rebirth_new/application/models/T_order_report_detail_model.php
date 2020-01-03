<?php

/**
 * Class T_order_report_detail_model
 * 门店月度统计报表模型 model @lin
 */

class T_order_report_detail_model extends MY_model{
    var $table = 't_order_report_detail';
    public function __construct(){
        parent::__construct();
    }

    //插入
    public function do_add($data){
        $data['add_time'] = date('Y-m-d H:i:s');
        $data['last_time']=date('Y-m-d H:i:s');
        $data = $this->filter_field($data);
        $table=$this->table;
        $row= $this->insert($data,$table,'true');
        return $row;
    }

    //列表
    public function do_list($where,$page,$limit,$field='*'){
        $table=$this->table;
        $limits=($page==0)?'':('limit '.($page-1)*$limit.','.$limit.'');
        $where=(empty($where))?'':('where ' .$where);
        $sql='select '.$field.' from  '.$table.' '.$where.' '.$limits.'';
        $row=$this->getRows($sql);
        return $row ;
    }

    //更新
    public function do_update($where,$data){
        $data['last_time']=date('Y-m-d H:i:s');
        $data = $this->filter_field($data);
        $row= $this->update($where,$data);
        return $row;
    }

    //id查询单条
    public function do_show($id){
        $table=$this->table;
        $sql = "select * from ".$table." where id='".$id."'";
        $row = $this->getOneRow($sql);
        return $row;
    }

    //单字段查询单条
    public function do_one($field,$value){
        $table=$this->table;
        $sql = "select * from ".$table." where ".$field."='".$value."' order by id desc";
        $row = $this->getOneRow($sql);
        return $row;
    }

    //条件查询一条
    public function do_select_one($data=array(),$like=array()){
        $data = $this->filter_field($data);
        $row = $this->where($data)->like($like)->select_one();
        return $row;
    }

    //统计
    public function do_count($data=array(),$like=array()){
        $data = $this->filter_field($data);
        $row = $this->where($data)->like($like)->count();
        return $row;
    }

    //执行sql语句
    public function do_sql($sql){
        $row=$this->getOne($sql);
        return $row;
    }

}