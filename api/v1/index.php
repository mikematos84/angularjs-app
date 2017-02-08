<?php 

require __DIR__ . '/router.php';

Router::route('user/(\d+)', function($id){
  echo $id;
});

Router::route('user/(\w+)/(\d+)', function($action, $id){
  echo $action;
  echo $id;
});

Router::execute($_REQUEST['route']);