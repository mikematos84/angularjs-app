<?php 

/**
* Simple API Routing System 
* 
* Routes can be placed in one or many files within the "routes" folder. Opon a request
* all routes will be loaded so that the routing system can verify the request against
* the known routes. If successful, the user will be presented with the information requested. 
* If unsuccessful, the user will be presented with an error message. All information will 
* be returned in a JSON format
**/

class Api{

    public $version = 1.0;
    public $response = []; 
    public $route = [];
    public $endpoint = '';
    
    public function __construct(){
        
       if(isset($_REQUEST['route']) == false){
            $this->response['error'] = 404;
            $this->response['message'] = 'No route was defined';
            echo json_encode($this->response);
            return;
        }

        require_once __DIR__ . '/router.php';
        Router::init();
        Router::execute($_REQUEST['route']);
    }

}

$api = new Api();
