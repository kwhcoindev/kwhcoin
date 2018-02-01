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

$dir_iterator = new RecursiveDirectoryIterator(__DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "whitepapers" . DIRECTORY_SEPARATOR . "*.pdf");
$iterator = new RecursiveIteratorIterator($dir_iterator, RecursiveIteratorIterator::SELF_FIRST);
$list = array();

foreach ($iterator as $file) {
    if ($file->isFile()) {

    	$fileName = substr( $file->getPathname(), $file->getPathname().lastIndexOf(DIRECTORY_SEPARATOR)+1 );
    	$lang = $fileName.substr( $fileName, $fileName.indexOf("(")+1, $fileName.indexOf(")") - $fileName.indexOf("(") -1);

    	$list[] = array("lang"=> $lang, "url"=> "whitepapers/". "date"=> date("mdY", $file->getMTime()) )
    }
}

}catch(Exception $e){
	echo json_encode(array( "status"=>500, "message"=> $e->getMessage() ));
    return;
}

echo json_encode(array("status"=> $status, "message"=> "SUCCESS", "list"=> $list));

?>