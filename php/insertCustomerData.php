<?php

try{
    require_once("generalConnectDB.php");

    $Data = $_POST["customerData"];

    $sql = "INSERT INTO `customer` (`CUS_PHONE`, `CUS_ID`, `CUS_STATE`)
            VALUES ('$Data', '0', '1');";      

    $insert = $pdo->prepare($sql);
    $insert->execute();


}catch(PDOException $e){

    echo $e->getMessage();

}




?>