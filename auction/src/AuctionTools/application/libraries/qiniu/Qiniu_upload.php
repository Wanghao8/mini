<?php
/**
 * 七牛文件上传
 * 方式一 formdata 一般PC端使用
 * 方式二 uptoken 一般针对APP端直接上传
 * 方式三 medias 需要结合微信先获取再上传
 * 上传成功给后 直接返回 ,各开的文件路径
 */
class Qiniu_upload
{   
    function __get($key){
        $CI = & get_instance();
        return $CI->$key;
    }
    public function __construct()
    {
        include_once APPPATH.'libraries/account/qiniuyun.php';
        $this->accessKey=$accessKey;
        $this->secretKey=$secretKey;
        $this->bucket = $bucket;
        $this->qiniuurl = $qiniuurl;
    }
    //获取七牛token 供APP端上传使用
    public function uptoken(){
        include_once APPPATH.'libraries/qiniu/autoload.php';
        $auth = new Qiniu\Auth($this->accessKey,$this->secretKey);        
        $expires = 21600;
        $policy = null;
        if (file_exists(APPPATH.'cache/qiniu_token.json')){
            $ken = file_get_contents(APPPATH.'cache/qiniu_token.json');
            $arr_token = json_decode($ken,true);
            if (is_array($arr_token) && $arr_token['expire_time'] > time()){
                $token['upToken'] = $arr_token['upToken'];
            }else{
                $token['upToken'] = $auth->uploadToken($this->bucket, null, $expires, $policy, true);
                $token['expire_time'] = time() + 21600;
                file_put_contents(APPPATH.'cache/qiniu_token.json',json_encode($token));
            }
        }else{
            $token['upToken'] = $auth->uploadToken($this->bucket, null, $expires, $policy, true);
            $token['expire_time'] = time() + 21600;
            file_put_contents(APPPATH.'cache/qiniu_token.json',json_encode($token));
        }
        return $token['upToken'];
    }

    //微信头像单独上传
    public function headimgurl($imgurl)
    {
        include_once APPPATH . 'libraries/qiniu/autoload.php';
        $auth = new Qiniu\Auth($this->accessKey,$this->secretKey); 
        $key = date('Ym') . date('d') . uniqid() . mt_rand(99, 999) . '.jpg';
        $bucketManager = new Qiniu\Storage\BucketManager($auth);
        list($ret, $err) = $bucketManager->fetch($imgurl,$this->bucket, $key);
        return $key;
    }

    //微信端文件上传
    public function medias($medias)
    {
        include_once APPPATH . "libraries/wechat/Wxjssdk.php";
        include_once APPPATH . 'libraries/qiniu/autoload.php';
        $jssdk = new Wxjssdk();
        $access_token = $jssdk->getAccessToken();
        $auth = new Qiniu\Auth($this->accessKey,$this->secretKey); 
        $bucketManager = new Qiniu\Storage\BucketManager($auth);
        $imgarr = array();
        $media_array = explode(",", $medias);
        foreach ($media_array as $value) {
            $url = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=" . $access_token . "&media_id=" . $value;
            $key = date('Ym') . date('d') . uniqid() . mt_rand(99, 999) . '.jpg';
            list($ret, $err) = $bucketManager->fetch($url,$this->bucket, $key);
            $imgarr[] = $key;
        }
        $imgs = implode(",", $imgarr);
        return $this->actionres(true, 'success', '文件上传成功！', $imgs);
    }

    //weburl图片上传-一次性使用
    public function qianyi_img_up($where)
    {
        //获取列表数据
        $info='1';
        $this->load->model('T_temp_media_model');
        $list_r = $this->T_temp_media_model->do_list($where);
        $list_r = $list_r ? $list_r : [];
        //获取七牛授权
        include_once APPPATH . 'libraries/qiniu/autoload.php';
        $auth = new Qiniu\Auth($this->accessKey,$this->secretKey); 
        $bucketManager = new Qiniu\Storage\BucketManager($auth);
        if(!$list_r){
            return 0;
        }
        //循环数组对象
        foreach ($list_r as $imgItem) {
            $imgurl='http://xrhs.yuanfangyun.com/'.$imgItem['src'];
            list($ret, $err) = $bucketManager->fetch($imgurl,$this->bucket,$imgItem['src']);
            if($err!=null){
                $info="id=".$imgItem['id']."上传失败，错误代码为";
                continue;
            }
            $this->T_temp_media_model->do_update(array('id'=>$imgItem['id']),array('isUp'=>1));
            $this->T_temp_media_model->do_add($imgItem);
        }
        return $info;
    }

    //PC端上传接口
    public function formdata($file)
    {
        include_once APPPATH . 'libraries/qiniu/autoload.php';
        $auth = new Qiniu\Auth($this->accessKey,$this->secretKey); 
        //这里用的也是APP端token
        $token = $this->uptoken();
        $realname = $file['name'];
        $arrRealName = explode('.', $realname);
        $stuffix = end($arrRealName);
        $filePath =$file['tmp_name'];
        $key = date('Ym') . date('d') . uniqid() . mt_rand(99, 999) . '.' . $stuffix;
        $uploadMgr = new Qiniu\Storage\UploadManager();
        list($ret, $err) = $uploadMgr->putFile($token, $key, $filePath);
        return $key;
    }

    //删除七牛云对应文件
    public function delete($name){
        include_once APPPATH . 'libraries/qiniu/autoload.php';
        $auth = new Qiniu\Auth($this->accessKey,$this->secretKey);
        $config = new Qiniu\Config();
        $bucketManager = new Qiniu\Storage\BucketManager($auth, $config);
        $bucketManager->delete($this->bucket, $name);
    }

    //本地文件上传
    public function localdata($filePath,$fileName)
    {
        include_once APPPATH . 'libraries/qiniu/autoload.php';
        $auth = new Qiniu\Auth($this->accessKey,$this->secretKey);
        $token = $auth->uploadToken($this->bucket);
//        $filePath = $file;
//        $arrRealName = explode('.', $file);
//        $stuffix = end($arrRealName);
//        $key = date('Ym') . date('d') . uniqid().'.'. $stuffix;
        $key = $fileName;
        $uploadMgr = new Qiniu\Storage\UploadManager();
        list($ret, $err) = $uploadMgr->putFile($token, $key, $filePath);
        return $key;
    }

    //返回格式重构
    public function actionres($res, $code, $msg = '', $data = null)
    {
        $result = array(
            'res' => $res,
            'code' => $code,
            'msg' => $msg,
            'data' => $data,
        );
        echo json_encode($result);
        exit;
    }

}
