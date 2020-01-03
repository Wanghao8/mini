<?php
/**
 * 容联短信发送
 * 方式一 formdata 一般PC端使用
 * 方式二 uptoken 一般针对APP端直接上传
 * 方式三 medias 需要结合微信先获取再上传
 * 上传成功给后 直接返回 ,各开的文件路径
 */
class CCsms
{   
    /**
      *发送短信验证码，传入参数phone，生成6位验证码，发送并返回
      * @param $phone
      * @return data code(短信验证码)  
      */
      public function send_code_sms($phone){ 
        include_once APPPATH . 'libraries/yuntongxun/CCPRestSmsSDK.php';
        include_once APPPATH . 'libraries/account/yuntongxun.php';
         $rest = new REST($serverIP,$serverPort,$softVersion);
         $rest->setAccount($accountSid,$accountToken);
         $rest->setAppId($appId);
         $code=str_pad(mt_rand(0, 999999), 6, "0", STR_PAD_BOTH);
         $datas=array($code,1);
         $result = $rest->sendTemplateSMS($phone,$datas,43712);
         return array('result'=>$result,'code'=>$code);
    }
    
    /**
      * 通用发送模板短信
      * @param to 手机号码集合,用英文逗号分开
      * @param datas 内容数据 格式为数组 例如：array('Marry','Alon')，如不需替换请填 null
      * @param $tempId 模板Id,测试应用和未上线应用使用测试模板请填写1，正式应用上线后填写已申请审核通过的模板ID
      * 测试数据 {"phone":"18203643064","info":["1975","2"],"mid":"335936","timeStamp":1537521758,"summary":"06f003870f1b8d8c9ab230b87b3d7ffd"}
      */ 
      public function send_message_sms($to,$datas,$tempId){
        include_once APPPATH . 'libraries/yuntongxun/CCPRestSmsSDK.php';
        include_once APPPATH . 'libraries/account/yuntongxun.php';
         $rest = new REST($serverIP,$serverPort,$softVersion);
         $rest->setAccount($accountSid,$accountToken);
         $rest->setAppId($appId);
         $result = $rest->sendTemplateSMS($to,$datas,$tempId);
         return $result;
    }
}
