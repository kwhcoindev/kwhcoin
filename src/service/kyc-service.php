<?php

require("util.php");
require_once('vendor/autoload.php');

use Zend\Config\Config;
use Zend\Config\Factory;
use Zend\Http\PhpEnvironment\Request;


$output = null;

$env = "sandbox";

$config = array(
		"sandbox"=> array(
			"endpoint"=> "https://pluginst.identitymind.com/sandbox/auth",
			"jsLib"=> "https://cd1st.identitymind.com/sandbox/idm.min.js"
		),
		"staging"=> array(
			"endpoint"=> "https://pluginst.identitymind.com/api/auth",
			"jsLib"=> "https://cd1st.identitymind.com/idm.min.js"
		),
		"production"=> array(
			"endpoint"=> "https://plugin.identitymind.com/api/auth",
			"jsLib"=> "https://cdn1.identitymind.com/idm.min.js"
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
			'x-api-key: 11GctO12uL9QeEtgFkcSe50BbuGwtFVY41GyZJpg',
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

	/*
	 * Get all headers from the HTTP request
	 */
	$request = new Request();

	if ($request->isPost()) {
	    $authHeader = $request->getHeader('authorization');

	    /*
	     * Look for the 'authorization' header
	     */
	    if ($authHeader) {
	        /*
	         * Extract the jwt from the Bearer
	         */
	        list($jwt) = sscanf( $authHeader->toString(), 'Authorization: Bearer %s');

	        if ($jwt) {
	            try {
	                //$config = Factory::fromFile('config/config.php', true);

	                /*
	                 * decode the jwt using the key from config
	                 */
	                //$secretKey = base64_decode($config->get('jwtKey'));
	                
	                $token = JWT::decode($jwt, $cert, array('HS512'));

	                #$asset = base64_encode(file_get_contents('http://lorempixel.com/200/300/cats/'));

	                /*
	                 * return protected asset
	                 */
	                header('Content-type: application/json');
	                echo json_encode(array("status"=>200));

	            } catch (Exception $e) {
	                /*
	                 * the token was not able to be decoded.
	                 * this is likely because the signature was not able to be verified (tampered token)
	                 */
	                header('HTTP/1.0 401 Unauthorized');
	                echo json_encode(array("status"=>401, "error"=>"HTTP/1.0 401 Unauthorized"));
	            }
	        } else {
	            /*
	             * No token was able to be extracted from the authorization header
	             */
	            header('HTTP/1.0 400 Bad Request');
	            echo json_encode(array("status"=>400, "error"=>"HTTP/1.0 400 Bad Request"));
	        }
	    } else {
	        /*
	         * The request lacks the authorization token
	         */
	        header('HTTP/1.0 400 Bad Request');
	        echo json_encode(array("status"=>400, "error"=>"Token not found in request"));
	        //echo 'Token not found in request';
	    }
	} else {
	    header('HTTP/1.0 405 Method Not Allowed');
	    echo json_encode(array("status"=>405, "error"=>"HTTP/1.0 405 Method Not Allowed"));
	}	

}

?>