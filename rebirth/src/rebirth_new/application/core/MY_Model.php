<?php
 
/**
 * Class M_model
 * base model 
 */
class MY_model extends CI_Model{
 
	/**
	 * 该Model对应的表名
	 * @var string
	 */
	var $table = '';
 
	/**
	 * 该Model对应的主键名
	 * @var string
	 */
	var $primaryKey = 'id';
 
	public function __construct(){
		parent::__construct();
		$this->load->database();
	}
 
	#region 通用操作
	/**
	 * 执行sql 
	 * @param $sql
	 * @param bool $affect_num 是否返回影响行数
	 * @return mixed
	 */
	function query($sql,$affect_num=false){
		$query = $this->db->query($sql);
		if(!$query){
			return false;
		}
		if($affect_num){
			$query = $this->db->affected_rows();
		}
		return $query;
	}
 
	/**
	 * 返回多行数据 
	 * @param $sql
	 * @return mixed
	 */
	function getRows($sql){
		$query = $this->db->query($sql);
		if(!$query){
			return false;	
		}
		return $query->result_array();
	}
	 
 
	/**
	 * 返回单行数据 
	 * @param $sql
	 * @return mixed
	 */
	function getOneRow($sql){
		$query = $this->db->query($sql);
		if(!$query){
			return false;
		}
		return $query->row_array();
	}

	/**
	 * 返回单行首列数据 
	 * @param $sql
	 * @return mixed
	 */
	function getOne($sql){
		$data = $this->getOneRow($sql);
		if(!$data){
			return false;
		}
		return current($data);
	}
 
	/**
	 * 插入数据 
	 * @param $data 插入的数据array
	 * @param string $table 表名
	 * @param bool $return 是否需要返回插入成功的id
	 * @return bool
	 */
	function insert($data, $table='', $return = false){
		if(!$table){
			if(!$this->table){
				return false;
			}
			$table = $this->table;
		}
		$query = $this->db->insert($table, $data);
		if($return){
			$query = $this->db->insert_id();
		}
		return $query;
	}
 
	/**
	 * 删除数据 
	 * @param $where where (e.g. array('field' =>'value',...))
	 * @param string $table
	 * @return bool
	 */
	function delete($where, $table='',$limit=1){
		if(!$table){
			if(!$this->table){
				return false;
			}
			$table = $this->table;
		}
		$this->db->where($where);
		// if($limit==1){
		// 	$this->db->limit(1);
		// }		
		$this->db->delete($table);
		//判断删除是否成功
		$dele=$this->db->affected_rows();
		if($dele>0){
			return true;
		}
		return false;
	}
 
	/**
	 * 更新数据 
	 * @param $where where (e.g. array('field' =>'value',...))
	 * @param $update update (e.g. array('field' =>'value',...))
	 * @param string $table
	 * @param int $limit
	 * @return bool
	 */
	function update($where,$update,$table='',$limit=1){
		if(!$table){
			if(!$this->table){
				return false;
			}
			$table = $this->table;
		}
		$this->db->where($where);
		//注销掉默认更新一条的数据
		//$this->db->limit($limit);
		$this->db->update($table, $update);
		return $this->db->affected_rows();
	}
#endregion
 
	#region ci框架链式
	/**
	 * where (e.g. array('field' =>'value',...)) 
	 * @param array $where
	 * @return $this
	 */
	function where($where=array()){
		foreach($where as $k=>$v){			
			$this->db->where($k, $v);
		}
		return $this;
	}

	/**
	* WHERE `title` LIKE '%match%' or `phone` LIKE '%182%' ESCAPE  '!'
	* @param array $like
	* @return $this
	*/
	function like($like=array()){
		if($like){
			foreach($like as $k=>$v){
				$this->db->or_like($k, $v);
			}
		}
		return $this;
	}


	/**
	 * limit $offset,$limit 
	 * @param int $limit
	 * @param int $offset
	 * @return $this
	 */
	function limit($offset=0,$limit=1){
		if($offset<=0){
			$offset=0;
		}else{
			$offset=($offset-1)*$limit; //根据算法结果来的值，传入$offset,页码，则从($offset-1)*$limit开始，取$limit条数据
		}
		$this->db->limit($limit,$offset);//从第$offset条开始，取$limit条数据
		return $this;
	}
 
	/**
	 * order by (e.g. array('field1'=>'asc',...)) 
	 * @param array $orderby
	 * @return $this
	 */
	function orderby($orderby=array()){
		if($orderby){
			foreach($orderby as $k=>$v){
				$this->db->order_by($k, $v);
			}
		}else{
			$this->db->order_by($this->primaryKey, 'desc');
		}
		return $this;
	}
 
	/**
	 * where in (e.g. array('field1'=>array('value1','value2',...))) 
	 * @param array $wherein
	 * @return $this
	 */
	function wherein($wherein=array()){
		if($wherein){
			foreach($wherein as $k=>$v){
				$this->db->where_in($k, $v);
			}
		}
		return $this;
	}
 
	/**
	 * where not in (e.g. array('field1'=>array('value1','value2',...))) 
	 * @param array $wherenotin
	 * @return $this
	 */
	function wherenotin($wherenotin=array()){
		if($wherenotin){
			foreach($wherenotin as $k=>$v){
				$this->db->where_not_in($k, $v);
			}
		}
		return $this;
	}
 
	/**
	 * 获取总数 
	 * @return mixed
	 */
	function count(){
		$this->db->from($this->table);
		return $this->db->count_all_results();
	}
 
	/**
	 * select (e.g. array('field1','field2',...) or 'filed1,filed2,...') 
	 * @param string $select
	 * @return data
	 */
	function select($select="*",$orderby=false){
		// select
		$this->db->select($select);
		if(!$orderby){
			$this->db->order_by($this->primaryKey, 'desc');
		}else{
			$this->db->order_by($this->primaryKey, 'desc');
		}		
		// get
		$query = $this->db->get($this->table);
		
		// return
		//if($this->limit == 1){
		//	$data = $query->row_array();
		//}else{
		$data = $query->result_array();
		//}
		return $data;
	}
	//查询单独一条，有点小问题，如果前面条件为空，依然会返回地一条数据
	function select_one($select="*"){
		// select
		$this->db->select($select);
		// get
		$this->db->order_by($this->primaryKey, 'desc');
		$query = $this->db->get($this->table);
		$data = $query->row_array();		
		return $data;

	}



	/**
	 * 获取数据表字段，过滤非本数据库传输字段 
	 * @param string $data
	 * @return $data
	 */
	public function filter_field($data,$table=''){
		if(!$table){
			if(!$this->table){
				return false;
			}
			$table = $this->table;
		}
        $fields = $this->db->list_fields($table);//获取数据库字段
        foreach($data as $key=>$val){
            if(!in_array($key,$fields)){
                unset($data[$key]);
            }
        }
        return $data;
    }
	#endregion
 
}