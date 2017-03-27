<?php 

    require __DIR__ . '/../vendor/autoload.php';
    require __DIR__ . '/response.php';

    use \Firebase\JWT\JWT;

    $key = "angular-app";
    $token = array(
        "iss" => "http://localhost/angular-app",
        "aud" => "http://localhost/angular-app",
        "iat" => 1356999524,
        "nbf" => 1357000000
    );

    /**
    * IMPORTANT:
    * You must specify supported algorithms for your application. See
    * https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40
    * for a list of spec-compliant algorithms.
    */
    $jwt = JWT::encode($token, $key);
    $decoded = JWT::decode($jwt, $key, array('HS256'));

    //print_r($decoded);

    /*
    NOTE: This will now be an object instead of an associative array. To get
    an associative array, you will need to cast it as such:
    */

    $decoded_array = (array) $decoded;

    /**
    * You can add a leeway to account for when there is a clock skew times between
    * the signing and verifying servers. It is recommended that this leeway should
    * not be bigger than a few minutes.
    *
    * Source: http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#nbfDef
    */
    JWT::$leeway = 60; // $leeway in seconds
    $decoded = JWT::decode($jwt, $key, array('HS256'));
    
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