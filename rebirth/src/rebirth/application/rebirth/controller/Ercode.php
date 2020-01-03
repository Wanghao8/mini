<?php

/**

 * Created by PhpStorm.

 * User: my

 * Date: 2019/3/6

 * Time: 10:04

 */



namespace app\rebirth\controller;





use app\rebirth\controller\GetAccessToken;

use Endroid\QrCode\QrCode;

use think\Controller;

use think\Db;



class Ercode extends UserBase

{

    /***

     * 获取分享二维码

     */

    public function share(){

        $uid=$this->uid;

        $host=$_SERVER['SERVER_NAME'];

        //$str=array('pid'=>$uid);

        //$str=json_encode($str);





                $accesstoken=GetAccessToken::get();


                $url='https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token='.$accesstoken;

                $data=array(

                    'scene'=>'pid='.$uid,

                    //'page'=>'page/order/refund/refund',

                );

                $data=json_encode($data);


                $res=myCurl($url,1,$data);




                file_put_contents('./static/rebirth/ercode/'.$uid.'.png',$res);






                Db::name('member_info')->where('id',$uid)

                    ->update([

                        'share_ercode'=>'https://'.$host.'/static/rebirth/ercode/'.$uid.'.png'

                    ]);

                $ercode='https://'.$host.'/static/rebirth/ercode/'.$uid.'.png';





        return  m_success(array('ercode'=>$ercode));







    }





    /**

     * 获取开门码地址

     * @return string

     */

    public function opencode(){

        $uid=input('uid');

        $store_id=input('store_id');

        if($store_id>0){

            $res=Db::name('member_info')

                ->field('end_time,new')

                ->where('id',$uid)

                ->find();

            $new=$res['new'];

            if($res['end_time']<time()){

                $end_time=time()+(60*60*24);

            }else{

                $end_time=$res['end_time']+(60*60*24);

            }





            if($new==1){

                Db::name('member_info')

                    ->where('id',$uid)

                    ->update([

                        'new'=>0,

                        'end_time'=>$end_time

                    ]);

            }

        }

//        $end_time=Db::name('member_info')

//            ->where('id',$uid)

//            ->value('end_time');

//        $check=$end_time-time();

//        if($check>0){

            $time=time();

            $data=array(

                'member_id'=>$uid,

                'time'=>$time,

            );

            $str=serialize($data);

            $str=ds_encrypt($str);

            return m_success(array('url'=>url('/rebirth/ercode/ercode?content='.$str,'','',true)));

//        }else{

//            return m_error('剩余时间不足请充值');

//        }





    }

    /**

     * 获取开门二维码

     */

    public function ercode($content='我是内容'){



        $qrCode=new QrCode();





        $qrCode->getText();

        $qrCode->setText($content)

            ->setSize(300)//大小

            ->setErrorCorrectionLevel('high')

            ->setForegroundColor(array('r' => 0, 'g' => 0, 'b' => 0, 'a' => 0))

            ->setBackgroundColor(array('r' => 255, 'g' => 255, 'b' => 255, 'a' => 0))

            ->setLabelFontSize(16);

        header('Content-Type: '.$qrCode->getContentType());

        echo $qrCode->writeString();

        exit;





    }

















}