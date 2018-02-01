<?php

session_start();

require("util.php");


$status = 200;

header('Content-Type: application/json');
cors();

//Form post validation
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
	echo json_encode(array( "status"=>500, "message"=>"Invalid request." ));
    return;
}

try{

$basedir = str_ireplace("service", "whitepapers", __DIR__);

$dir_iterator = new RecursiveDirectoryIterator($basedir . DIRECTORY_SEPARATOR);
$iterator = new RecursiveIteratorIterator($dir_iterator, RecursiveIteratorIterator::SELF_FIRST);
$list = array();

foreach ($iterator as $file) {
    if ($file->isFile()) {
    	$fileName = $file->getFilename();
		$start = strpos($fileName, "(");
		$end = strpos($fileName, ")");
		
		if( $start !== false && $end !== false ){
			$lang = substr( $fileName, $start+1, $end - $start -1);
			$list[] = array("lang"=> $lang, "url"=> "whitepapers/" .$fileName, "date"=> date("mdY", $file->getMTime()) );
		}
    }
}

}catch(Exception $e){
	echo json_encode(array( "status"=>500, "message"=> $e->getMessage() ));
    return;
}

echo json_encode(array("status"=> $status, "message"=> "SUCCESS", "list"=> $list));

?>