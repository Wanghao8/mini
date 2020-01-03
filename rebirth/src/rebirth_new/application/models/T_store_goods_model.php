<?php

/**
 * Class T_store_goods_model
 * 门店商品模型 model @lin
 */

class T_store_goods_model extends MY_model{
    var $table = 't_store_goods';
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
        $sql='select '.$field.' from  '.$table.' as a left join t_store_course as b on a.course_id=b.id '.$where.' '.$limits.'';
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
    //id查询单条
    public function do_show_goods($id){
        $table=$this->table;
        $sql = "select a.*,b.name as course_name,b.cover_imgs as course_cover_imgs,b.info as course_info,b.label as course_lebel,b.effect as course_effect,b.crowd as course_crowd,b.note as course_note,b.duration as course_duration,b.volume as course_volume,c.name as store_name,c.address as store_address,c.latlong as store_latlong  from ".$table." as a left join t_store_course as b on a.course_id=b.id left join t_store as c on a.store_id=c.id where a.id='".$id."'";
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

    //删除
    public function do_delete($where){
        $where = $this->filter_field($where);
        $row=$this->delete($where);
        return $row;
    }

}