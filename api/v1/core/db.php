<?php 

class Database{

    private static $db = null;

    /**
    * Connects to ADOdb library, returns connected instanceof
    **/
    public static function connect(){
        $file = __DIR__ . '../../../config.json';
        if(file_exists($file) == false){
            return false;
        }

        $config = json_decode(file_get_contents($file));
        require_once __DIR__ . '../../../vendor/adodb/adodb-php/adodb.inc.php';
        self::$db = NewADOConnection($config->db->driver);
        self::$db->Connect($config->db->host, $config->db->username, $config->db->password, $config->db->database);
        self::$db->SetFetchMode(ADODB_FETCH_ASSOC);
        return self::$db;
    }

    /**
    * Executes a basic query
    **/
    public static function query($sql = '', $vars = [], $callback = null){
        self::connect();

        $action = '';
        $parts = explode(' ', $sql);

        switch(strtoupper($parts[0])){
            case 'SELECT':
                $action = 'GetAll';
            break;

            case 'DELETE':
            case 'UPDATE':
            case 'INSERT':
                $action = 'Execute';
            break;
        }

        $stmt = self::$db->Prepare($sql);
        $response = self::$db->{$action}($stmt, $vars);

        if($callback != null){
            if(self::$db->Insert_ID()){
                $response->insertID = self::$db->Insert_ID();
            }
            $callback($response);
        }

        self::disconnect();
    }

    /**
    * Closes ADOdb connection to database 
    **/
    public static function disconnect(){
        if(self::$db){
            self::$db->Close();
        }
    }

}