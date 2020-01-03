<?php


namespace app\rebirth\controller;

use PhpOffice\PhpWord\PhpWord;
use think\Controller;

class Census extends Controller
{
    public function index(){

        $count=db('member_info')->where('end_time','>',time())->whereOr('prepare_time','>',0)->count();
        $this->assign('count',$count);
        if(!input('start') ||!input('end')){
            $y = date("Y", time()); //年
            $m = date("m", time()); //月
            $d = date("d", time()); //日
            $t0 = date('t'); // 本月一共有几天
            $start_s = mktime(0, 0, 0, $m, 1, $y); // 创建本月开始时间
            $start=date('Y-m-d',$start_s);
            $end_s = mktime(23, 59, 59, $m, $t0, $y); // 创建本月结束时间
            $end=date('Y-m-d',$end_s);
        }else{
            $start_s=strtotime(input('start'));
            $end_s=strtotime(input('end'));
            $start=input('start');
            $end=input('end');
        }
        $year=db('wx_trade')->where('create_time','<',$end_s)->where('create_time','>',$start_s)->where('type','year')->count();
        $season=db('wx_trade')->where('create_time','<',$end_s)->where('create_time','>',$start_s)->where('type','season')->count();
        $time=db('wx_trade')->where('create_time','<',$end_s)->where('create_time','>',$start_s)->where('type','time')->count();
        $xun=db('wx_trade')->where('create_time','<',$end_s)->where('create_time','>',$start_s)->where('type','xun')->count();
        $gift=db('wx_trade')->where('create_time','<',$end_s)->where('create_time','>',$start_s)->where('gift_id','>',0)->count();
        $sum=db('wx_trade')->where('create_time','<',$end_s)->where('create_time','>',$start_s)->sum('total_fee');
        $sum=$sum/100;

        $this->assign('start',$start);
        $this->assign('end',$end);
        $this->assign('year',$year);
        $this->assign('season',$season);
        $this->assign('time',$time);
        $this->assign('xun',$xun);
        $this->assign('gift',$gift);
        $this->assign('sum',$sum);
        return $this->fetch();
    }


    public function excel(){
        error_reporting(E_ALL);
        ini_set('display_errors', TRUE);
        ini_set('display_startup_errors', TRUE);
//date_default_timezone_set('Europe/London');


        $PHPExcel=new \PHPExcel();
        $filename = './es.xls';
//如果excel文件后缀名为.xls，导入这个类
        $exts = substr($filename,(strrpos($filename,".")+1));
        if($exts == 'xls'){

            $PHPReader=new \PHPExcel_Reader_Excel5();
        }else if($exts == 'xlsx'){

            $PHPReader=new \PHPExcel_Reader_Excel2007();
        }
//载入文件
        $PHPExcel=$PHPReader->load($filename);
//获取表中的第一个工作表，如果要获取第二个，把0改为1，依次类推

        $currentSheet=$PHPExcel->getSheet(0);
//获取总列数
        $allColumn=$currentSheet->getHighestColumn();
//获取总行数
        $allRow=$currentSheet->getHighestRow();
//循环获取表中的数据，$currentRow表示当前行，从哪行开始读取数据，索引值从0开始
        for($currentRow=1;$currentRow<=$allRow;$currentRow++){
            //从哪列开始，A表示第一列
            for($currentColumn='A';$currentColumn<=$allColumn;$currentColumn++){
                //数据坐标
                $address=$currentColumn.$currentRow;
                //读取到的数据，保存到数组$arr中
                $d=$currentSheet->getCell($address)->getValue();
                //处理文本格式
                if(is_object($d))  $d= $d->__toString();
                $data[$currentRow][$currentColumn]=$d;
            }
        }
        echo "<pre>";
        var_dump($data);
        echo "</pre>";
        cache('test',$data[1],3600);


    }

    public function word(){
        //模板的路径，word的版本最好是docx，要不然可能会读取不了，根据自己的模板位置调整
        $path = './t.docx';

        //生成word路径，根据自己的目录调整
        $filePath= './tt.docx';

        $data=cache('test');
        $test=$data['A'];

        //声明一个模板对象、读取模板
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor($path);



        $templateProcessor->setValue('test',iconv('utf-8', 'GB2312//IGNORE', $test));//传真

        //生成新的word
        $templateProcessor->saveAs($filePath);

    }

}