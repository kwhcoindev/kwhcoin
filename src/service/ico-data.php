<?php

session_start();

require("util.php");
require("dbproperties.php");

class TblIcoMaster {
        public $cmwTicker;
        public $coinAddress;
        public $coinConstant;
        public $coinCurrent;
        public $coinName;
        public $coinPlatformTicker;
        public $coinTicker;
        public $coinTotal;
        public $date;
        public $id;
        public $insertDate;
        public $updateby;
}

$status = 200;
$list = array();
$msg = "";


header('Content-Type: application/json');

cors();

//Form post validation
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        echo json_encode(array( "status"=>500, "message"=>"Invalid request." ));
    return;
}

$pdo = null;

try{

    $pdo = new PDO ("mysql:host=$hostname;dbname=$dbname","$username","$pw");

        $pdo->beginTransaction();

        $keys = array_keys($data);
        $fields = '`'.implode('`, `',$keys).'`';

        #here is my way
        $placeholder = substr(str_repeat('?,',count($keys)),0,-1);

        $sql = "SELECT cmw_ticker as cmwTicker, coin_address as coinAddress, coin_const as coinConstant, coin_current as coinCurrent, coin_name as coinName, coin_platform_ticker as coinPlatformTicker, coin_ticker as coinTicker, (coin_const+coin_current) as coinTotal, updated_datetime as date, ico_id as id, insert_datetime as insertDate, updated_by updateBy from `tbl_ico_master`";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $list = $stmt->fetchAll(PDO::FETCH_CLASS, "TblIcoMaster");

        $stmt->closeCursor();
        unset($stmt);

} catch (Exception $e) {
        $msg = $e->getMessage();
        $status = 500;
        if(isset($pdo)) $pdo->rollback();
}
unset($pdo);

echo json_encode(array("status"=> $status, "message"=> $msg, "data"=> $list));

?>
