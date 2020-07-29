<?php

    try{
        require_once("generalConnectDB.php");
   

        $data = json_decode($_POST["data"]); 
        // $testdata = json_encode($data);
        $ORDER_NO = $data->ORDER_NO;
        $CUS_PHONE = $data->CUS_PHONE;
        $PAY_NO = $data->PAY_NO;
        $EMP_NO = $data->EMP_NO;
        $BONUS_NAME = $data->BONUS_NAME;
        $ORDER_TAX_ID = $data->ORDER_TAX_ID;
        $ORDER_DEVICE_NO = $data->ORDER_DEVICE_NO;
        $ORDER_INNOUT = $data->ORDER_INNOUT;
        $ORDER_NUM = $data->ORDER_NUM;
        $ORDER_TTL_PRICE = $data->ORDER_TTL_PRICE;
        $ORDER_DATE = $data->ORDER_DATE;
        
        $sql = "INSERT INTO order_list
                VALUES('$ORDER_NO','$CUS_PHONE','$PAY_NO','$EMP_NO','$BONUS_NAME',
                       '$ORDER_TAX_ID','$ORDER_DEVICE_NO','$ORDER_INNOUT','$ORDER_NUM',
                       '$ORDER_TTL_PRICE','$ORDER_DATE');";      

        $loadorderList = $pdo->prepare($sql);
        $loadorderList->execute();
    
        // echo $loadorderList_NO;

    }catch (PDOException $e){
        echo $e->getMessage();
    }





?>