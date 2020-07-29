<?php 
try{
    


   require_once("generalConnectDB.php");

    $orderListData = json_decode($_POST["orderList"]);

    $ORDER_NO = $orderListData->ORDER_NO;
    $CUSPHONE = $orderListData->CUS_PHONE;
    $PAY_NO = $orderListData->PAY_NO;
    $EMP_NO = $orderListData->EMP_NO;
    $BONUS_NAME = $orderListData->BONUS_NAME;
    $ORDER_TAX_ID = $orderListData->ORDER_TAX_ID;
    $ORDER_DEVICE_NO = $orderListData->ORDER_DEVICE_NO;
    $ORDER_INNOUT = $orderListData->ORDER_INNOUT;
    $ORDER_NUM = $orderListData->ORDER_NUM;
    $ORDER_TTL_PRICE = $orderListData->ORDER_TTL_PRICE;
    $ORDER_DATE = $orderListData->ORDER_DATE;

    // echo json_encode($orderListData);
    $sql = "UPDATE order_list 
            SET ORDER_NO = $ORDER_NO, CUS_PHONE_NUMBER = '$CUSPHONE', PAY_NO = $PAY_NO, EMP_NO = $EMP_NO, BONUS_NAME = '$BONUS_NAME',
                ORDER_TAX_ID = '$ORDER_TAX_ID', ORDER_DEVICE_NO = '$ORDER_DEVICE_NO', ORDER_INNOUT = '$ORDER_INNOUT',
                ORDER_NUM = $ORDER_NUM, ORDER_TTL_PRICE = $ORDER_TTL_PRICE, ORDER_DATE = '$ORDER_DATE'
            WHERE ORDER_NO = $ORDER_NO; 
            ";

    $bonusRule = $pdo->prepare($sql);
    $bonusRule->execute();

    // echo "<script> alert('送出成功');
    //         location.href='./posHomeTab.html'
    //       </script>" ;

  

}catch (PDOException $e){
    echo "錯誤行號" , $e->getLine();
    echo "錯誤原因", $e->getMessage();

}






?>
