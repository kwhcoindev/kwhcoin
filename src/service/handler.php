<?php 

include_once $_SERVER['DOCUMENT_ROOT'] . '/service/comp/token.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/service/comp/user.php';

session_start();

require("dbproperties.php");

$handle = $_GET["handle"];
include_once $_SERVER['DOCUMENT_ROOT'] . $root . '/service/comp/'. $handle .'.php';

try{
	header('Content-Type: application/json');
	$token = new Token();

	if($handle == "token"){
		$code = $token->getCode();
		echo "{\"status\":\"success\",\"token\":\"". $code ."\"}";
		exit();
	}else{
		$isValid = true; //$token->check($_SERVER["HTTP_A"]);

		if($isValid === true){
			
			if($handle == "login"){
				$login = new Login();
				$login->validate();
				echo $login->getResponse();
			}
			else if($handle == "logout"){
				$logout = new Logout();
				$logout->invalidate();
				echo $logout->getResponse();
			}
			else if($handle == "category"){
				$cat = new Category();
				$cat->getResponse();
			}
			else if($handle == "products"){
				$cat = new Products();
				$cat->getResponse();
			}
			else if($handle == "porders"){
				$cat = new POrders();
				$cat->getResponse();
			}
			else if($handle == "upload_status"){
				$h = new UploadStatus($_GET["process_key"]);
				$h->execute();
				echo $h->getResponse();
			}
			else if($handle == "process_upload"){
				$h = new ProcessUpload();
				$h->execute($_GET["process_key"]);
				//echo $h->getResponse();
			}
			else if($handle == "cart"){
				$mod = new Cart();

				if( $_POST["ops"] == "add" || $_POST["ops"] == "update")
					$result = $mod->add( $_POST["key"], $_POST["item"] );
				else if( $_POST["ops"] == "delete")
					$result = $mod->remove( $_POST["key"] );
				else if( $_POST["ops"] == "checkout")
					$result = $mod->checkout();
				else
					$result = $mod->get();
				echo $result;
			}
			else if($handle == "users"){
				$mod = new Users();
				if(isset($_POST["mode"]) && ($_POST["mode"] == "add" || $_POST["mode"] == "edit"))
					echo $mod->saveUser();
				else if(isset($_POST["mode"]) && $_POST["mode"] == "delete")
					echo $mod->deleteUser();
				else
					$mod->getResponse();
			}
			else if($handle == "orders"){
				$mod = new Orders();
				if(isset($_POST["mode"]) && ($_POST["mode"] == "add" || $_POST["mode"] == "edit"))
					echo $mod->saveOrder();
				else if(isset($_POST["mode"]) && $_POST["mode"] == "delete")
					echo $mod->deleteOrder();
				else
					$mod->getResponse();
			}
		} else {

			echo "{\"status\":\"error\",\"message\":\"Access not allowed\"}";

		}
	}
}catch(Exception $e){
	echo "{\"status\":\"failure\"}";
	error_log("Exception :: ".$e->code ."  ". $e->message, 3, $_SERVER['DOCUMENT_ROOT']. "/service/upload_error.log");
	exit();
}
exit();
?>