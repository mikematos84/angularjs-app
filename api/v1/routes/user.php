<?php 

Router::route('user', [
    'get' => function(){
        echo json_encode([]);
    }
]);

Router::route('user/(\d+)', [
    'get' => function($id){
        echo json_encode([
            'id' => $id
        ]);
    }
]);

Router::route('user/(\w+)/(\d+)', [
    'get' => function($action, $id){
        echo json_encode([
            'action' => $action,
            'id' => $id
        ]);
    }
]);

Router::route('user/([\w+\W+]*)', [
    'get' => function($post){
        echo json_encode([
            'post' => $post
        ]);
    }
]);
