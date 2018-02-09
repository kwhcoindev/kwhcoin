<?php

require("util.php");

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

?>