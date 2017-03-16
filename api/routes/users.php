<?php 

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