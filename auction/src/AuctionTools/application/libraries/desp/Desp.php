<?php
/**
 * 支付加密解密
 * 前台直接无参数调用，服务器生成微信签名包
 * last_author huangluan
 */
class Desp
{
    var $key;
    var $iv; //偏移量

    function Desp($key) {
        //key长度8例如:1234abcd
        $this->key =$key;
        $this->iv =$key;
    }
    function encrypt($str) {
        //加密，返回大写十六进制字符串
        $size = mcrypt_get_block_size (MCRYPT_DES, MCRYPT_MODE_CBC);
        $str = $this->pkcs5Pad ($str,$size);
        $strdo=mcrypt_encrypt(MCRYPT_DES,$this->key,$str,MCRYPT_MODE_CBC,$this->iv);
        return strtoupper(bin2hex($strdo));
    }     
    function decrypt($str)
    {
        //解密
        $midstr = hex2bin(strtolower($str));
        $str=mcrypt_decrypt(MCRYPT_DES, $this->key, $midstr,MCRYPT_MODE_CBC,$this->iv);
        //$pad = ord($str[($len = strlen($str)) - 1]);
        return $str;
    } 
    function pkcs5Pad($text, $blocksize) {
        $pad = $blocksize - (strlen ( $text ) % $blocksize);
        return $text . str_repeat ( chr ( $pad ), $pad );
    }
    function pkcs5Unpad($text) {
        $pad = ord ( $text {strlen ( $text ) - 1} );
        if ($pad > strlen ( $text ))
            return false;
        if (strspn ( $text, chr ( $pad ), strlen ( $text ) - $pad ) != $pad)
            return false;
        return substr ( $text, 0, - 1 * $pad );
    }
}
