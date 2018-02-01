<?php

session_start();

require("util.php");
require("dbproperties.php");

function checkField($data, $f){
	if( !isset($data[$f]) || strlen($data[$f]) === 0 )
		return $f;
	else
		return "";
}

class codeset {
    public $code_desc;
    public $code_value;
}

$msg = "Thank you for your participation! A member of our team will get back to you as soon as possible to discuss your project. Be sure to tell your friends and colleagues all about KWHCoin!";
$status = 200;
$tokens = null;
$data = null;

header('Content-Type: application/json');
cors();

//Form post validation
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
	echo json_encode(array( "status"=>500, "message"=>"Invalid request." ));
    return;
}

try{
	$data = json_decode(file_get_contents('php://input'), true);
	//Input field validation
	$missing = "";
	$inpFields = array("name", "email", "city_state", "country", "type_of_project", "project_desc", "how_did_you_hear_about_us", "organized_meet_up");
	foreach( $inpFields as $f ){
		$missing .= checkField($data, $f);
	}

	if( strlen($missing) > 0 ){
		echo json_encode(array( "status"=>500, "message"=>"Missing input fields" ));
	    return;
	}
}catch(Exception $e){
	echo json_encode(array( "status"=>500, "message"=> $e->getMessage() ));
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

	$stmt = $pdo->prepare("INSERT INTO `join_us`($fields) VALUES($placeholder)");
	$stmt->execute(array_values($data));

	$stmt->closeCursor();
	unset($stmt);
	
	$pdo->commit();

	
	// Multiple recipients
	$to = "contact@KWHCoin.com"; // note the comma

    $encoding = "utf-8";

    // Preferences for Subject field
    $subject_preferences = array(
        "input-charset" => $encoding,
        "output-charset" => $encoding,
        "line-length" => 76,
        "line-break-chars" => "\r\n"
    );

	// Subject
	$subject = "Join us form submitted";

    // Mail header
    $header = "Content-type: text/html; charset=".$encoding." \r\n";
    $header .= "From: ".$name." <".$email."> \r\n";
    $header .= "MIME-Version: 1.0 \r\n";
    $header .= "Content-Transfer-Encoding: 8bit \r\n";
    $header .= "Date: ".date("r (T)")." \r\n";
    $header .= iconv_mime_encode("Subject", $subject, $subject_preferences);

	// Message
	$message = '
	<html>
	<head>
	  <title>Join us form submitted</title>
	</head>
	<body>
	  <table>
	    <tr>
	      <th>Name</th><td>$name</td>
	    </tr>
	    <tr>
	      <th>Email</th><td>$email</td>
	    </tr>
	    <tr>
	      <th>City and State/Province</th><td>$data["city_state"]</td>
	    </tr>
	    <tr>
	      <th>Country</th><td>$data["country"]</td>
	    </tr>
	    <tr>
	      <th>Type of Project</th><td>$data["type_of_project"]</td>
	    </tr>
	    <tr>
	      <th>Brief Project Description</th><td>$data["project_desc"]</td>
	    </tr>
	    <tr>
	      <th>How Did You Hear About KWHCoin?</th><td>$data["how_did_you_hear_about_us"]</td>
	    </tr>
	    <tr>
	      <th>Would you be interested in organizing a meetup in your local community with other alternative energy enthusiasts and participants?</th><td>$data["organized_meet_up"]</td>
	    </tr>
	  </table>
	</body>
	</html>
	';


	if( ! mail( $to, $subject, $message, $header ) ){
		$status = 500;
		$msg = "Failed to send the message. Please try later";
	}
	
	
} catch (Exception $e) {
	$msg = $e->getMessage();
	$status = 500;
	if(isset($pdo)) $pdo->rollback();
}
unset($pdo); 

echo json_encode(array("status"=> $status, "message"=> $msg, "tokens"=> $tokens));

?>