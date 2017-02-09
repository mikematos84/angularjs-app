<?php

class Router {
	
    /*
        any digit = (\d+)
        any word = (\w+)
        any mixture of words, decimals, hyphens, and underscores = ([\w+\W+]*)
    */

	private static $routes = array();
	
	private function __construct() {}
	private function __clone() {}
	
    public static function loadDefinedRoutes(){
        $files = array_diff(scandir(__DIR__ . '/routes'), ['.','..']);
        foreach($files as $file){
            require __DIR__ . '/routes/' . $file;
        }
    }

	public static function route($pattern, $callbacks = []) {
        $pattern = '/^' . str_replace('/', '\/', $pattern) . '$/';

        if(array_key_exists($pattern, self::$routes) == false){
            self::$routes[$pattern] = [];
        }

        foreach($callbacks as $method => $callback){
            self::$routes[$pattern][strtolower($method)] = $callback;
        }
    }

    public static function execute($route) {
        $request = strtolower($_SERVER['REQUEST_METHOD']);
        $response = [];
        
        foreach (self::$routes as $pattern => $methods) {
			if (preg_match($pattern, $route, $params)) {
				if(array_key_exists($request, $methods)){
                    array_shift($params);
                    return call_user_func_array($methods[$request], array_values($params));
                };
            }
		}

        $response['error'] = 404;
        $response['message'] = 'a "' . $request . '" request with route matching "' . $route . '" could not be found';
        echo json_encode($response);
	}
}