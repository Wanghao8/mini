<?php

/**
 * Class T_goods_model
 * 拍品信息模型 model @lin
 */

class T_goods_model extends MY_model{
    var $table = 't_goods';
    public function __construct(){
        parent::__construct();
    }

    //插入
    public function do_add($data){
        $data['add_time'] = date('Y-m-d H:i:s');
        $data['last_time']=date('Y-m-d H:i:s');
        $data['delay_time']=$data['end_time'];
        $data['cover_imgs'] = serialize($data['cover_imgs']);
        $data['imgtxt'] = serialize($data['imgtxt']);
        $data['last_price'] = $data['start_price'];
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
        foreach ($row as &$v){
            if (isset($v['cover_imgs'])){
                $v['cover_imgs'] = unserialize($v['cover_imgs']);
            }
            if (isset($v['imgtxt'])){
                $v['imgtxt'] = unserialize($v['imgtxt']);
            }
        }
        return $row ;
    }

    //我参与的列表
    public function do_participate_list($where,$page,$limit,$field='*'){
        $table=$this->table;
        $limits=($page==0)?'':('limit '.($page-1)*$limit.','.$limit.'');
        $where=(empty($where))?'':('where ' .$where);
        $sql='select '.$field.' from  '.$table.' '.$where.' '.$limits.'';
        $row=$this->getRows($sql);
        foreach ($row as &$v){
            if (isset($v['cover_imgs'])){
                $v['cover_imgs'] = unserialize($v['cover_imgs']);
            }
            if (isset($v['imgtxt'])){
                $v['imgtxt'] = unserialize($v['imgtxt']);
            }
            //根据时间来改变状态
            $now_time = date('Y-m-d H:i:s',time());
            if ( $now_time > $v['start_time'] && $now_time < $v['delay_time']){
                $v['status'] = 1;
            }
            if ($v['start_time'] >= $now_time){
                $v['status'] = 2;
            }
            if ($v['delay_time'] <= $now_time){
                $v['status'] = 3;
            }
        }
        return $row ;
    }

    //我发布的拍品列表
    public function do_publish_list($where,$page,$limit,$field='*'){
        $table=$this->table;
        $limits=($page==0)?'':('limit '.($page-1)*$limit.','.$limit.'');
        $where=(empty($where))?'':('where ' .$where);
        $sql="select ".$field." from  ".$table." as a left join t_manage_acc as b on a.win_acc_id=b.id left join t_goods_bond as c on a.win_acc_id=c.acc_id and a.id=c.goods_id ".$where." ".$limits."";
        $row=$this->getRows($sql);
        foreach ($row as &$v){
            if (isset($v['cover_imgs'])){
                $v['cover_imgs'] = unserialize($v['cover_imgs']);
            }
            if (isset($v['imgtxt'])){
                $v['imgtxt'] = unserialize($v['imgtxt']);
            }
            //根据时间来改变状态
            $now_time = date('Y-m-d H:i:s',time());
            if ( $now_time > $v['start_time'] && $now_time < $v['delay_time']){
                $v['status'] = 1;
            }
            if ($v['start_time'] >= $now_time){
                $v['status'] = 2;
            }
            if ($v['delay_time'] <= $now_time){
                $v['status'] = 3;
            }
        }
        return $row ;
    }

    //更新
    public function do_update($where,$data){
        $data['last_time']=date('Y-m-d H:i:s');
        if (isset($data['cover_imgs'])){
            $data['cover_imgs'] = serialize($data['cover_imgs']);
        }
        if (isset($data['imgtxt'])){
            $data['imgtxt'] = serialize($data['imgtxt']);
        }
        $data = $this->filter_field($data);
        $row= $this->update($where,$data);
        return $row;
    }

    //id查询单条
    public function do_show($id){
        $table=$this->table;
        $sql = "select * from ".$table." where id='".$id."'";
        $row = $this->getOneRow($sql);
        $row['cover_imgs'] = unserialize($row['cover_imgs']);
        $row['imgtxt'] = unserialize($row['imgtxt']);
        return $row;
    }

    //id查询单条
    public function do_show_goods($id){
        $table=$this->table;
        $sql="select a.*,b.nickName,b.avatarUrl from  ".$table." as a left join t_manage_acc as b on a.acc_id=b.id where a.id='".$id."'";
        $row=$this->getOneRow($sql);
        $row['cover_imgs'] = unserialize($row['cover_imgs']);
        $row['imgtxt'] = unserialize($row['imgtxt']);
        //根据时间来改变状态
        $now_time = date('Y-m-d H:i:s',time());
        if ( $now_time > $row['start_time'] && $now_time < $row['delay_time']){
            $row['status'] = 1;
        }
        if ($row['start_time'] >= $now_time){
            $row['status'] = 2;
        }
        if ($row['delay_time'] <= $now_time){
            $row['status'] = 3;
        }
        return $row;
    }

    //单字段查询单条
    public function do_one($field,$value){
        $table=$this->table;
        $sql = "select * from ".$table." where ".$field."='".$value."' order by id desc";
        $row = $this->getOneRow($sql);
        $row['cover_imgs'] = unserialize($row['cover_imgs']);
        $row['imgtxt'] = unserialize($row['imgtxt']);
        return $row;
    }

    //条件查询一条
    public function do_select_one($data=array(),$like=array()){
        $data = $this->filter_field($data);
        $row = $this->where($data)->like($like)->select_one();
        $row['cover_imgs'] = unserialize($row['cover_imgs']);
        $row['imgtxt'] = unserialize($row['imgtxt']);
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
        if (isset($row['cover_imgs'])){
            $row['cover_imgs'] = unserialize($row['cover_imgs']);
        }
        if (isset($row['imgtxt'])){
            $row['imgtxt'] = unserialize($row['imgtxt']);
        }
        return $row;
    }

}