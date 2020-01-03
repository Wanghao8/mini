<?php
/**
 * This file is part of workerman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link http://www.workerman.net/
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 */

/**
 * 主逻辑
 * 主要是处理 onMessage onClose 三个方法
 */

use \GatewayWorker\Lib\Gateway;
use Workerman\Lib\Timer;
require_once __DIR__ . '/../../vendor/workerman/mysql/src/Connection.php';


class Events
{
    /**
     * 新建一个类的静态成员，用来保存数据库实例
     */
    public static $db = null;

    /**
     * 进程启动后初始化数据库连接
     */
    public static function onWorkerStart($worker)
    {

//        self::$db = new \Workerman\MySQL\Connection('121.41.29.178', '3306', 'root', 'edelweiss1234.', 'auctiontools');
    }

    /**
     * 当客户端连上时触发
     * @param int $client_id
     */
    public static function onConnect($client_id)
    {
//        $_SESSION['id'] = time();
//        Gateway::sendToCurrentClient('{"type":"welcome","id":'.$_SESSION['id'].'}');
        Gateway::sendToClient($client_id, json_encode(array(
            'type'      => 'init',
            'client_id' => $client_id
        )));
    }
    
   /**
    * 有消息时
    * @param int $client_id
    * @param int $data
    * @param string $message
    */
   public static function onMessage($client_id, $data)
   {
////       var_dump(json_decode($data));
//       $data = json_decode($data,true);
////       var_dump($data);
//       $goods_id = $data['goods_id'];
//       $acc_id = $data['acc_id'];
//
//       // 使用数据库实例
//       $timer_id = Timer::add(1, function()use($goods_id,$acc_id,$client_id,&$timer_id){
//           $data = self::select_goods($goods_id,$acc_id);
////           var_dump($data);
////           if ($data['goods']['status'] != 0){
//               $data['type'] = "data";
//               Gateway::sendToClient($client_id,json_encode($data));
////           }
//           if(!Gateway::isOnline($client_id))
//           {
//               Timer::del($timer_id);
//           }
//           return;
//       });
   }
   
   /**
    * 当用户断开连接时
    * @param integer $client_id 用户id
    */
   public static function onClose($client_id)
   {
       Gateway::closeClient($client_id);
   }

    /**
     * 查询拍品信息以及更改
     * @param $goods_id
     * @param $acc_id
     * @return array
     */
   public static function select_goods($goods_id,$acc_id){
       //查询拍品信息
//       $goods = self::$db->select('*')->from('t_goods')->where('id= :id')->bindValues(array('id' => $goods_id))->row();
//       $goods = self::$db->query("SELECT a.*,b.nickName,b.avatarUrl FROM `t_goods` AS `a` INNER JOIN `t_manage_acc` AS `b` ON `a`.`acc_id` = `b`.`id` WHERE a.id = ".$goods_id)[0];
       $goods = self::$db->select('t_goods.*,t_manage_acc.nickName,t_manage_acc.avatarUrl')->from('t_goods')->innerJoin('t_manage_acc','t_goods.acc_id = t_manage_acc.id')->where('t_goods.id = :id')->bindValues(array('id' => $goods_id))->row();
       //查询是否缴纳保证金
       if ($acc_id){
           $goods_bond = self::$db->select('id')->from('t_goods_bond')->where('goods_id = :goods_id AND acc_id= :acc_id AND pay_status = :pay_status')->bindValues(array('goods_id' => $goods_id,'acc_id'=>$acc_id,'pay_status'=>1))->row();
//           var_dump($goods_bond);
           $goods['bond_status'] = $goods_bond ? 1 :0;
           $goods_offer = self::$db->select('id')->from('t_goods_offer')->where('goods_id = :goods_id AND acc_id= :acc_id')->bindValues(array('goods_id' => $goods_id,'acc_id'=>$acc_id))->row();
           $goods['is_offer'] = $goods_offer ? 1 : 0;
       }

       $goods['cover_imgs'] = unserialize($goods['cover_imgs']);
       $goods['imgtxt'] = unserialize($goods['imgtxt']);
       $now_time = date('Y-m-d H:i:s',time());
       if ( $now_time > $goods['start_time'] && $now_time < $goods['delay_time']){
           $goods['status'] = 1;
           $goods['countdown_time'] = self::countdown_time($goods['delay_time']);
       }
       if ($goods['start_time'] >= $now_time){
           $goods['status'] = 2;
           $goods['countdown_time'] = self::countdown_time($goods['start_time']);
       }
       if ($goods['delay_time'] <= $now_time){
           $goods['status'] = 3;
           $goods['countdown_time'] = self::countdown_time($goods['start_time']);
       }

       $update = [];
       if ($now_time > $goods['start_time'] && $now_time < $goods['delay_time'] && $goods['status'] != 1){
           $update['status'] = 1;//修改状态为正在拍卖
       }

       if ($now_time > $goods['delay_time'] && $goods['status'] !=0){
           $update['status'] = 0;//修改状态为已结束
       }
       //查询出价记录,如果180s内无人出价,则结束,如果有人出价,则在原有结束时间上加180s
       $goods_offer = self::$db->select('acc_id,add_time')->from('t_goods_offer')->where('goods_id= :goods_id AND status = :status')->bindValues(array('goods_id' => $goods_id,'status'=>1))->row();
       if (!empty($goods_offer)){
           //上次数据库记录的win_acc_id,如果跟重新拍中的id不同(并且最后180s),则重新延迟时间
//           if ($goods['win_acc_id'] != $goods_offer['acc_id']){
               $update['win_acc_id'] = $goods_offer['acc_id'];
               $update['last_time'] = $now_time;
               if (strtotime($goods_offer['add_time']) > (strtotime($goods['delay_time']) - $goods['delay'])){
                   $update['status'] = 1;
                   $update['delay_time'] = date('Y-m-d H:i:s',time() + $goods['delay']);
               }
//           }
       }
       if (!empty($update)){
           $res = self::$db->update('t_goods')->cols($update)->where('id='.$goods_id)->query();
       }
       $offer_list = self::$db->query("SELECT a.*,b.nickName,b.avatarUrl FROM `t_goods_offer` AS `a` INNER JOIN `t_manage_acc` AS `b` ON `a`.`acc_id` = `b`.`id` WHERE goods_id = ".$goods_id." ORDER BY a.id DESC");
       array_walk($offer_list,function(&$v){
           $v['add_time'] = self::get_last_time(strtotime($v['add_time']));
       });
       $data = [
           'goods' => $goods,
           'offer_list' => $offer_list
       ];
       return $data;
   }

    /**
     * 格式化时间
     * @param $time
     * @return false|string
     */
   public static function get_last_time($time)
   {
       // 当天最大时间
       $todayLast = strtotime(date('Y-m-d 23:59:59'));
       $agoTimeTrue = time() - $time;
       $agoTime = $todayLast - $time;
       $agoDay = floor($agoTime / 86400);

       if ($agoTimeTrue < 60) {
           $result = '刚刚';
       } elseif ($agoTimeTrue < 3600) {
           $result = (ceil($agoTimeTrue / 60)) . '分钟前';
       } elseif ($agoTimeTrue < 3600 * 12) {
           $result = (ceil($agoTimeTrue / 3600)) . '小时前';
       } elseif ($agoDay == 1) {
           $result = '昨天 ';
       } elseif ($agoDay == 2) {
           $result = '前天 ';
       } else {
           $format = date('Y') != date('Y', $time) ? "Y-m-d" : "m-d";
           $result = date($format, $time);
       }
       return $result;
   }

    /**
     * 计算倒计时时间
     * @param $end_time
     * @return string
     */
   public static function countdown_time($end_time)
   {
       /*拍卖倒计时*/
       $today =time();   //当前时间戳 6月7号
       $second = strtotime($end_time)-$today; //结束时间戳减去当前时间戳
       // echo $second;
       $day = floor($second/3600/24);    //倒计时还有多少天
       $hr = floor($second/3600%24);     //倒计时还有多少小时（%取余数）
       $min = floor($second/60%60);      //倒计时还有多少分钟
       $sec = floor($second%60);         //倒计时还有多少秒
       if ($second > 0){
           //组合成字符串
           $str = sprintf("%02d",(($day*24)+$hr)).":".sprintf("%02d",$min).":".sprintf("%02d",$sec);  //组合成字符串
       }else{
           $str = "00:00:00";  //组合成字符串
       }
       return $str;
   }
}
