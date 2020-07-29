<?php 

try{ 
    require_once("generalConnectDB.php");
   
    
    $cusPhone = $_POST["customer"];   

    // //搜尋會員
    $customer_sql = "SELECT CUS_PHONE,CUS_ID,CUS_LAST,CUS_GEN,CUS_POINT 
                     FROM   customer
                     WHERE  CUS_PHONE = '$cusPhone' AND CUS_ID = 1;";
    
    $customer = $pdo->query($customer_sql);
    $customerArr = array();
    while($row = $customer->fetch(PDO::FETCH_ASSOC)){
        $customerArr = $row;
    }

    echo json_encode($customerArr);
    
    }catch (PDOException $e){
        echo $e->getMessage();

    }


?>
