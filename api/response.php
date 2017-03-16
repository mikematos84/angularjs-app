<?php 
/**
* Response Class
* 
* Sets the proper response type of the API
**/

class Response{
    public static function sendHeaders(){
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: *');
    }
    
    public static function send($object){
        self::sendHeaders();
        print_r($object);
    }
    
    public static function json($object){
        self::sendHeaders();
        header('Content-Type: application/json');
        echo json_encode($object);
    }
}