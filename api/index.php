<?php 

    require __DIR__ . '/../vendor/autoload.php';
    require __DIR__ . '/response.php';

    // Connect to a database using ADOdb
    $db = ADONewConnection('mysqli');
    $db->Connect('localhost','root','','sandbox');
    $db->SetFetchMode(ADODB_FETCH_ASSOC);
    
    // Create Router instance
    $router = new \Bramus\Router\Router();

    // Custom 404 Handler
    $router->set404(function () {
        header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
        echo '404, route not found!';
    });

    // Define routes
    $files = array_diff(scandir('routes'), ['.','..']);
    foreach($files as $file){
        require_once 'routes/' . $file;
    }

    // Run it!
    $router->run();