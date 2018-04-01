<?php

session_start();

require("dbproperties.php");

require("util.php");
require_once('vendor/autoload.php');

use \Firebase\JWT\JWT;

class codeset {
    public $code_desc;
    public $code_value;
}

$output = null;

$env = "staging";

$config = array(
		"sandbox"=> array(
			"endpoint"=> "https://pluginst.identitymind.com/sandbox/auth",
			"jsLib"=> "https://cd1st.identitymind.com/sandbox/idm.min.js",
			"apiKey"=> "QbtE36WyI791R4SvjjylA8e7n5gmLdSX68xft93S"
		),
		"staging"=> array(
			"endpoint"=> "https://pluginst.identitymind.com/api/auth",
			"jsLib"=> "https://cd1st.identitymind.com/idm.min.js",
			"apiKey"=> "11GctO12uL9QeEtgFkcSe50BbuGwtFVY41GyZJpg"
		),
		"production"=> array(
			"endpoint"=> "https://plugin.identitymind.com/api/auth",
			"jsLib"=> "https://cdn1.identitymind.com/idm.min.js",
			"apiKey"=> "11GctO12uL9QeEtgFkcSe50BbuGwtFVY41GyZJpg"
		)
	);

if( isset($_GET["getToken"]) ){
	
	// Get cURL resource
	$curl = curl_init();
	// Set some options - we are passing in a useragent too here
	curl_setopt_array($curl, array(
	    CURLOPT_RETURNTRANSFER => 1,
	    CURLOPT_URL => $config[$env]["endpoint"],
		CURLOPT_HTTPHEADER=> array(
			"x-api-key: ". $config[$env]["apiKey"],
	    )
	));

	// Send the request & save response to $resp
	$resp = curl_exec($curl);
	// Close request to clear up some resources

	if(!$resp||$resp===null){
	    $output = array("error"=> curl_error($curl) . " - Code: " . curl_errno($curl));
	} else {
		$resp = json_decode($resp, true);
		//var_dump($resp);
		$output = array("token"=>$resp["token"], "jsLib"=> $config[$env]["jsLib"]);
	}

	curl_close($curl);

	header('Content-Type: application/json');
	cors();

	echo json_encode($output);

}
else if( isset($_GET["validate"]) ) {
	$cert = file_get_contents("/apps/.idm_key");

	if ( isset($_POST["data"]) ) {
		try {

			$jwt = $_POST["data"];

			//$config = Factory::fromFile('config/config.php', true);

			/*
			 * decode the jwt using the key from config
			 */
			//$secretKey = base64_decode($config->get('jwtKey'));
			$decoded = JWT::decode($jwt, $cert, array('RS256'));

			$decoded_array = (array) $decoded;
			#$asset = base64_encode(file_get_contents('http://lorempixel.com/200/300/cats/'));

			$msg = "Thank you for your interest in KWHCoin! Below is the Pre-Sale Token address. If you have questions on how to use the address, please review our Pre-Sale ICO Instructions.";
			$status = 200;

			/*
			 * return protected asset
			 */
			if( $decoded_array["kyc_result"] == "ACCEPT" ){
				
				$pdo = new PDO ("mysql:host=$hostname;dbname=$dbname","$username","$pw");

				/*$pdo->beginTransaction();

				$keys = array_keys($data);
				$fields = '`'.implode('`, `',$keys).'`';

				#here is my way
				$placeholder = substr(str_repeat('?,',count($keys)),0,-1);

				$stmt = $pdo->prepare("INSERT INTO `kyc_details`($fields) VALUES($placeholder)");
				$stmt->execute(array_values($data));

				$stmt->closeCursor();
				unset($stmt);

				$pdo->commit();*/

				$sql = "SELECT code_desc, code_value FROM codeset where code_type = 'token' ORDER BY seq";
				$stmt = $pdo->prepare($sql);
				$stmt->execute();
				$tokens = $stmt->fetchAll(PDO::FETCH_CLASS, "codeset");

				$stmt->closeCursor();
				unset($stmt);

				unset($pdo);
				
				header('Content-type: application/json');
				echo json_encode(array("status"=> $status, "message"=> $msg, "tokens"=> $tokens));

			} else {
				header('Content-type: application/json');
				echo json_encode(array("status"=> 403, "message"=> "Thank you for your interest in KWHCoin! Unfortunately we are unable to identify your details. If you have questions, please reach us out at contact@kwhcoin.com."));				
			}
			//header('Content-type: application/json');
			//echo json_encode(array("status"=>200,"data"=> $decoded->kyc_result));
			//echo json_encode(array("status"=>200,"data"=> $decoded));

		} catch (Exception $e) {
			/*
			 * the token was not able to be decoded.
			 * this is likely because the signature was not able to be verified (tampered token)
			 */
			//echo $e; 
			header('Content-type: application/json');
			echo json_encode(array("status"=>500, "error"=>$e->message));
		}
	} else {
		/*
		 * No token was able to be extracted from the authorization header
		 */
		//header('HTTP/1.0 400 Bad Request');
		header('Content-type: application/json');		
		echo json_encode(array("status"=>400, "error"=>"HTTP/1.0 400 Bad Request"));
	}

}

?>