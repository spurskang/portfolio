<?php

try{
    require_once("generalConnectDB.php");
   

    $sql = "SELECT TAB_NAME,TAB_SHOW,TAB_STAT_NO
            FROM   tabstat;";
    $Select_sql = $pdo->query($sql);
    $SelectArr = array();
    while($row = $Select_sql->fetch(PDO::FETCH_ASSOC)){
        $SelectArr[] = $row;                   
    }
    
    echo json_encode($SelectArr);


}catch (PDOException $e){
    echo $e->getMessage();
}

?>