<?php

try{
   
    require_once("generalConnectDB.php");
   
    // $pdo_1 = new PDO($dsn, $user, $password, $options);


    //接收前端傳來的資料
    $tabData = json_decode($_POST["tabData"]); 
    

    //關閉安全模式
    
    //TRUNCATE 用來刪除一個表格中所有的紀錄
    $TRUNCATE_sql = "TRUNCATE `table`";
    $CLEAR_TAB = $pdo->prepare($TRUNCATE_sql);
    $CLEAR_TAB->execute();
    
    
    
    for($i=0;$i<count($tabData);$i++){
       
        //TAB_STAT_NO 找出餐桌狀態編號
        $start = stripos($tabData[$i]->bgc, '(');
        $stop = stripos($tabData[$i]->bgc, ')');
        $sbs = substr($tabData[$i]->bgc, $start, $stop); //去除RGB

        $RStart = stripos($sbs, '(')+1;
        $REnd = stripos($sbs, ',')-1;
        $RLength = $REnd-$RStart;
        $R = substr($sbs, $RStart, $RLength+1); //Red

        $GStart = stripos($sbs, ',')+2; 
        $GEnd = strripos($sbs, ',')-1;  
        $GLength = $GEnd-$GStart;
        $G = substr($sbs, $GStart, $GLength+1); //Green

        $BStart = strripos($sbs, ' ')+1;
        $BEnd = stripos($sbs, ')')-1;
        $BLength = $BEnd-$BStart;
        $B = substr($sbs, $BStart, $BLength+1); //Blue

        $FHex = '#'.dechex($R).dechex($G).dechex($B);
        
        //選出TAB_STAT_NO
        $sql = "SELECT TAB_STAT_NO 
                FROM   tabstat
                WHERE  TAB_SHOW = '$FHex';";
        $TAB_STAT_NO = $pdo->query($sql);
        $ArrTAB_STAT = array();
        while($row = $TAB_STAT_NO->fetch(PDO::FETCH_ASSOC)){
            $ArrTAB_STAT[] = $row;
                        
        }
        $SEND_TAB_STAT_NO = array_pop($ArrTAB_STAT[count($ArrTAB_STAT)-1]);
        
        // print_r($SEND_TAB_STAT_NO);
        
        //$TAB_SHAPE_NO 找出餐桌形狀編號
        $LENG = $tabData[$i]->height;
        $WIDTH = $tabData[$i]->width;
        
        $TAB_LENG_END = stripos($LENG,'p');
        $TAB_LENG = substr($LENG,0,$TAB_LENG_END);
        
        $TAB_WIDTH_END = stripos($WIDTH,'p');
        $TAB_WIDTH = substr($WIDTH,0,$TAB_WIDTH_END);
        
        settype($TAB_LENG,"int");    
        settype($TAB_WIDTH,"int");

        $sql = "SELECT TAB_SHAPE_NO 
                FROM   tabshape
                WHERE  TAB_LENG = $TAB_LENG AND TAB_WIDTH = $TAB_WIDTH;";
                       
        $TAB_SHAPE_NO = $pdo->query($sql);
        $ArrT = array();
        while($row = $TAB_SHAPE_NO->fetch(PDO::FETCH_ASSOC)){
            $ArrT[] = $row;
        }
        $SEND_TAB_SHAPE_NO = array_pop($ArrT[count($ArrT)-1]);
        // print_r($SEND_TAB_SHAPE_NO);   
        
        $SEND_TAB_NUM  = $tabData[$i]->number;
        $SEND_TAB_POSX = $tabData[$i]->x;
        $SEND_TAB_POSY = $tabData[$i]->y;

        // print_r($SEND_TAB_NUM);
        $Insert_sql = " INSERT INTO `table` VALUES (NULL,'$SEND_TAB_STAT_NO','$SEND_TAB_SHAPE_NO','$SEND_TAB_NUM','$SEND_TAB_POSX','$SEND_TAB_POSY');";
        $TEST_INSERT = $pdo->prepare($Insert_sql);
        $TEST_INSERT->execute();
    }


    echo json_encode($tabData);
    
    
}catch (PDOException $e){
    echo $e->getMessage();
}

?>