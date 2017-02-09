<?php 

class Api{

    public $version = 1.0;
    public $response = []; 

    public function __construct(){
        $this->setHeaders();
        
        require __DIR__ . '/router.php';
        Router::loadDefinedRoutes();

        if(isset($_REQUEST['route']) == false){
            $this->response['error'] = 404;
            $this->response['message'] = 'No route was defined';
            echo json_encode($this->response);
        }else{
            Router::execute($_REQUEST['route']);
        }
    }

    private function setHeaders(){
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: *');
        header('Content-Type: application/json');
    }

}