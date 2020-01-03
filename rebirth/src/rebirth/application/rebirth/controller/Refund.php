<?php

/**

 * Created by PhpStorm.

 * User: wki

 * Date: 2019/7/30

 * Time: 9:35

 */



namespace app\rebirth\controller;





use think\Controller;

use think\Db;

use app\rebirth\controller\GetAccessToken;


class Refund extends Controller

{
/**

     * 退款

     */


 public function refund(){

	$charge=Enum::charge();

	$type=input('type');



if(!array_key_exists($type,$charge)){

            return m_error('参数有误');

        }else{

            $charge=$charge[$type];

        }

$time=strval(time());

$num=input('num');

        if(!is_numeric($num) || $num<1){

            return m_error('参数有误');

        }

$uid=input('uid');

$formid=input('formid');
if(empty($formid)){

            return m_error('参数有误');

        }

$bonus=$charge['time']*$num;

// 用户减时间
	$end_time=Db::name('member_info')->where('id',$uid)->value('end_time');
	
	$prepare_time=Db::name('member_info')->where('id',$uid)->value('prepare_time');
	
	
	if($prepare_time >= $bonus){
		
		$prepare_time=$prepare_time-$bonus;
		
		Db::name('member_info')->where('id',$uid)->update(['prepare_time'=>$prepare_time]);
		
		}else{
			
		
	if($end_time < $time + $bonus){
		return m_error('时长不足');
	}else{
		$end_time=$end_time-$bonus;
	}
	
	}
	
 Db::name('member_info')->where('id',$uid)->update(['end_time'=>$end_time]);


        //加时间记录
       
                          Db::name('member_log')->insert([
       
                              'member_id'=>$uid,
       
                              'type'=>1,
       
                              'value'=>$bonus,
      
                              'desc'=>'用户退卡减时间',
       
                              'desc_type'=>8,
       
                              'create_time'=>time()
       
                          ]);
						  
						  // 推送消息
						  $accesstoken=GetAccessToken::get();
						  

                $url='https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='.$accesstoken;
				
				$name=Db::name('member_info')->where('id',$uid)->value('nickName');
				$phone=Db::name('member_info')->where('id',$uid)->value('phone');
				
$time=date('Y-m-d H:i:s', time());
$data=[
            "touser"=>'o_vEB5WlCVvYj628WMXBSxnBNWGs', //对方的openid，前一步获取
            "template_id"=>'2caFsIGsSUM3QJ_c3QIbXI1zzHwqTHa3e0N-6PIkGgc', //模板id
			 "page"=>"page/order/refundorder/refundorder",
			'form_id'=> $formid,
            "data"=>[
                "keyword1"=>[
                    "value"=> $time, 
                ],
                "keyword2"=>[
                    "value"=> '退款', 
                ],
                "keyword3"=>[
                    "value"=> $num.'个月'.$num*299 .'元'
                ],
				"keyword4"=>[
				    "value"=> $name, 
				],
				"keyword5"=>[
				    "value"=> $phone, 
				]
            ]
        ];



                $data=json_encode($data);
				
				$res=myCurl($url,1,$data);
						  
						   return m_success($res,'退款成功',200);
						   
    }

/**

     * 全部退款记录

     */

public function getlist($page=1,$limit=10){

 $data=Db::name('member_log')
 ->alias('a')
 
 ->join('member_info b','a.member_id=b.id','left')
 ->field('a.value,a.desc,a.create_time,b.nickName,b.phone,ROUND(a.value/30/24/60/60 *299) AS money')
 

            
			->order('a.create_time','desc')
            ->where('a.desc_type','8')
			->page($page,$limit)
            ->select();


        return m_success($data);



    }



}