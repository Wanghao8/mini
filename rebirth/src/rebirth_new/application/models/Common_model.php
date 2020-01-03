<?php
 
/**
 * Class Common_model
 * Common_model @lin
 * 通用模块model
 */

class Common_model extends MY_model{
	public function __construct(){
		parent::__construct();
	}

	//更新单字段
	public function single_field_update($where,$update,$table){
		$data = $this->filter_field($update,$table);		
		$row= $this->update($where,$update,$table);
		return $row;
	}

	//查询某个字段值是否存在
	public function single_field_exist($table,$field,$value){
		$sql ="select * from ".$table." where ".$field." = ".$value." limit 1";
		$row=$this->db->simple_query($sql);
		return $row;
	}

	//修改单字段增减
	public function single_field_total($id,$table='',$field,$type){
		if($type=='add'){
			$sql ="update ".$table." set ".$field."=".$field."+1 where id = ".$id;
		}
		if($type=='sub'){
			$sql ="update ".$table." set ".$field."=".$field."-1 where id = ".$id;
		}
        $row = $this->db->query($sql);
		return $row;
	}
}