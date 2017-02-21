<?php

Router::route('user', [
    'get' => function(){
        $response = [];
        Response::json($response);
    }
]);

Router::route('user/(\d+)', [
    'get' => function($id){
        Database::query('SELECT * FROM users', [], function($resp){
            Response::json($resp);
        });
    },
    'post' => function($id){
        $db = Database::connect();
        $stmt = $db->Prepare('INSERT INTO users (login_id, password) VALUES (?,?)');
        $response = $db->Execute($stmt, ['mikematos84@gmail.com', 'open(this)']);
        $response->insertID = $db->Insert_ID();
        Response::json($response);
        $db->Close();
    },
    'put' => function($id){
        if(isset($id) == false){
            Response::json(['error' => 'No ID was passed']);
        }

        $db = Database::connect();
        $stmt = $db->Prepare('UPDATE users SET password=? WHERE id=?');
        $response = $db->Execute($stmt, ['open(this)', $id]);
        $response->insertID = $db->Insert_ID();
        Response::json($response);
        $db->Close();
    },
    'delete' => function($id){
        if(isset($id) == false){
            Response::json(['error' => 'No ID was passed']);
        }

        $db = Database::connect();
        $stmt = $db->Prepare('DELETE FROM users WHERE id=?');
        $response = $db->Execute($stmt, [$id]);
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
