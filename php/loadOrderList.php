<?php

    try{
        require_once("generalConnectDB.php");
   

        $sql = "SELECT ORDER_NO FROM `order_list` WHERE ORDER_NO=(SELECT MAX(ORDER_NO) FROM `order_list`);";

        $loadorderList = $pdo->prepare($sql);
        $loadorderList->execute();
        $data = $loadorderList->fetch(PDO::FETCH_ASSOC);
       
        echo json_encode($data);

    }catch (PDOException $e){
        echo $e->getMessage();
    }




?>