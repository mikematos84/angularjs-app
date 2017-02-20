<?php

Router::route('user', [
    'get' => function(){
        $response = [];
        Response::json($response);
    }
]);

Router::route('user/(\d+)', [
    'get' => function($id){
        Database::query('SELECT * FROM channels', [], function($resp){
            Response::json($resp);
        });
    },
    'post' => function($id){
        //Database::query('INSERT INTO channels (name, active) VALUES (?,?)', ['Mike',1], function($resp){
        //    Response::json($resp);
        //});

        $db = Database::connect();
        $stmt = $db->Prepare('INSERT INTO channels (name, active) VALUES (?,?)');
        $response = $db->Execute($stmt, ['Mike',1]);
        $response->insertID = $db->Insert_ID();
        Response::json($response);
        $db->Close();
    }
]);

Router::route('user/(\w+)/(\d+)', [
    'get' => function($action, $id){
        $response = [];
        $response['action'] = $action;
        $response['id'] = $action;
        Response::json($response);
    }
]);

Router::route('user/([\w+\W+]*)', [
    'get' => function($post){
        $response = [];
        $response['post'] = $post;
        Response::json($response);
    }
]);
