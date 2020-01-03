<?php
 
/**
 * Class T_manage_acc_model
 * 管理账号模型 @lin
 */
class T_manage_acc_model extends MY_model{
	var $table = 't_manage_acc';
	public function __construct(){
		parent::__construct();
	}
 
	//插入
	public function do_add($data){
		$data['add_time']=date('Y-m-d H:i:s');
		$data['last_time']=date('Y-m-d H:i:s');
		$data = $this->filter_field($data);		
		$table=$this->table;
		$row= $this->insert($data,$table,'true');
		return $row;
	}

	//更新
	public function do_update($where,$data){
		$data['last_time']=date('Y-m-d H:i:s');
		$data = $this->filter_field($data);
		$row= $this->update($where,$data);
		return $row;
	}

	//登录验证
	public function acc_login($data){
		$data = $this->filter_field($data);				
		$row = $this->where($data)->select_one();
		if(!$row){
			return false; 
		}
		//返回第一条
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
	public function acc_count($data=array(),$like=array()){
		$data = $this->filter_field($data);	
		$row = $this->where($data)->like($like)->count();
		return $row;
	} 
}