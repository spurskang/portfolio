<?php
 
try{ 
    require_once("generalConnectDB.php");
   
    //搜尋紅利規則
    $bonusRule_sql = "SELECT BONUS_NAME 
                      FROM bonus_rule;";

    $bonusRule = $pdo->query($bonusRule_sql);
    $bonusRuleArr = array();
    while($pdoRow = $bonusRule->fetch(PDO::FETCH_ASSOC)){
        $bonusRuleArr[] = $pdoRow;
    }
    $sendBackbonusRule = array_pop($bonusRuleArr[0]); 
    
    print_r($sendBackbonusRule);

    



    }catch (PDOException $e){
        echo $e->getMessage();

    }

?>
