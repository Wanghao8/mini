<?php
class MY_Service
{
    public function __construct(){
        log_message('debug', "Service Class Initialized");
    }
 
    function __get($key){
        $CI = & get_instance();
        return $CI->$key;
    }
    //actionsres,返回数据转义成json格式
    public  function actionres($res,$code,$msg = '',$data =null){
        $result = array(
                'res' =>$res,
                'code' => $code,
                'msg' => $msg,
                'data' => $data
        );
        return $result;
    }
	public  function serviceres($res,$code,$msg = '',$data =null,$count=0){
        $result = array(
                'res' =>$res,
                'code' => $code,
                'msg' => $msg,
                'data' => $data,
                'count'=>$count
        );
        return $result;
    }
    

    /**
     * 返回文件格式,根据后缀，判断文件格式
     * @param  string $str 文件名
     * @return string      文件格式
     */
    function file_format($str){
        // 取文件后缀名
        $str=strtolower(pathinfo($str, PATHINFO_EXTENSION));
        // 图片格式
        $image=array('webp','jpg','png','ico','bmp','gif','tif','pcx','tga','bmp','pxc','tiff','jpeg','exif','fpx','svg','psd','cdr','pcd','dxf','ufo','eps','ai','hdri');
        // 视频格式
        $video=array('mp4','avi','3gp','rmvb','gif','wmv','mkv','mpg','vob','mov','flv','swf','mp3','ape','wma','aac','mmf','amr','m4a','m4r','ogg','wav','wavpack');
        // 压缩格式
        $zip=array('rar','zip','tar','cab','uue','jar','iso','z','7-zip','ace','lzh','arj','gzip','bz2','tz');
        // 文档格式
        $text=array('exe','doc','ppt','xls','wps','txt','lrc','wfs','torrent','html','htm','java','js','css','less','php','pdf','pps','host','box','docx','word','perfect','dot','dsf','efe','ini','json','lnk','log','msi','ost','pcs','tmp','xlsb');
        // 匹配不同的结果
        switch ($str) {
            case in_array($str, $image):
                return 'image';
                break;
            case in_array($str, $video):
                return 'video';
                break;
            case in_array($str, $zip):
                return 'zip';
                break;
            case in_array($str, $text):
                return 'text';
                break;
            default:
                return 'other';
                break;
        }
    }
}
