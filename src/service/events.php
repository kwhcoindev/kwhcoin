<?php

session_start();

require("util.php");
require("dbproperties.php");

class TblEvents {
	public $start_date;
	public $end_date;
	public $title;
	public $address;
	public $city;
	public $state;
	public $zip;
	public $country;
	public $description;
	public $created_at;
	public $updated_at;
	public $update_by;
	public $deleted;
}

$status = 200;
$list = array();
$msg = "";


header('Content-Type: application/json');

cors();

if( isset($_GET["list"]) ){
	$pdo = null;

	try{

	    $pdo = new PDO ("mysql:host=$hostname;dbname=$dbname","$username","$pw");

	        $sql = "SELECT * from `events`";

	        $stmt = $pdo->prepare($sql);
	        $stmt->execute();
	        $list = $stmt->fetchAll(PDO::FETCH_CLASS, "TblEvents");

	        $stmt->closeCursor();
	        unset($stmt);

	} catch (Exception $e) {
	        $msg = $e->getMessage();
	        $status = 500;
	}
	unset($pdo);

	echo json_encode(array("status"=> $status, "message"=> $msg, "data"=> $list));
}

?>
