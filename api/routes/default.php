<?php 

$router->get('/', function () {
    echo '<h1>bramus/router</h1><p>Try these routes:<p><ul><li>/hello/<em>name</em></li><li>/blog</li><li>/blog/<em>year</em></li><li>/blog/<em>year</em>/<em>month</em></li><li>/blog/<em>year</em>/<em>month</em>/<em>day</em></li><li>/movies</li><li>/movies/<em>id</em></li></ul>';
});

$router->before('GET|POST', '.*', function(){
    if(!isset($_SESSION['user'])){
        Response::json(['redirect' => 'login']);
        exit();
    }
});

$router->get('/users', function(){
    global $db;
    $stmt = $db->prepare('SELECT * FROM users');
    $results = $db->getAll($stmt);
    Response::json($results);
});

$router->get('/users/(\d+)', function ($id) {
    global $db;
    $stmt = $db->prepare('SELECT * FROM users WHERE id=?');
    $results = $db->getAll($stmt, [$id]);
    Response::json($results);
});
