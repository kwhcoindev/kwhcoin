<?php

session_start();

require("util.php");

function checkField($data, $f){
	if( !isset($data[$f]) || strlen($data[$f]) === 0 )
		return $f;
	else
		return "";
}


$msg = "Thank you for your message. It has been sent.";
$status = 200;

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
	$inpFields = array("name", "message", "email");
	foreach( $inpFields as $f ){
		$missing .= checkField($data, $f);
	}

	if( strlen($missing) > 0 ){
		echo json_encode(array( "status"=>500, "message"=>"Missing required fields" ));
	    return;
	}

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
	$subject = "Customer support request";

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
	  <title>Customer support request</title>
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
	      <th>Message</th><td>$message</td>
	    </tr>
	  </table>
	</body>
	</html>
	';


	if( mail( $to, $subject, $message, $header ) === false ){
		$status = 500;
		$msg = "Failed to send the message. Please try later";
	}
	
} catch (Exception $e) {
	$msg = $e->getMessage();
	$status = 500;
}

echo json_encode(array("status"=> $status, "message"=> $msg));

?>
