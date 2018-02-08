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

$msg = "Thank you for your interest in KWHCoin! Below is the Pre-Sale Token address. If you have questions on how to use the address, please review our Pre-Sale ICO Instructions.";
$status = 200;
$tokens = null;

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
        $inpFields = array("first_name", "last_name", "dob_day", "dob_month", "dob_year", "street", "city", "zip", "country");
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

        $stmt = $pdo->prepare("INSERT INTO `kyc_details`($fields) VALUES($placeholder)");
        $stmt->execute(array_values($data));

        $stmt->closeCursor();
        unset($stmt);

        $pdo->commit();

    $sql = "SELECT code_desc, code_value FROM codeset where code_type = 'token' ORDER BY seq";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    $tokens = $stmt->fetchAll(PDO::FETCH_CLASS, "codeset");

        $stmt->closeCursor();
        unset($stmt);


} catch (Exception $e) {
        $msg = $e->getMessage();
        $status = 500;
        if(isset($pdo)) $pdo->rollback();
}
unset($pdo);

echo json_encode(array("status"=> $status, "message"=> $msg, "tokens"=> $tokens));

?>
