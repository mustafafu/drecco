<?php


/*
* getScore, show the best 10 scores if score is sortable, otherwise show the most recent 
* 10 scores 
*  
* gameName: should be the same as the game dir name
* orderFlag: if your score is sortable, pass 1 if higher score is better, 0
*       if smaller score is better. Otherwise no need to pass this variable
*  
*/

function getScore($gameName, $orderFlag){
    require 'dbman/config.php';
 
    $dbc = new DbConn();
    $query_gid = "select gid from ".$dbc->tbl_games." where name=?";
 
    try {
        $stmt_gid = $dbc->conn->prepare($query_gid);
        $stmt_gid->bind_param("s", $gameName);
        $stmt_gid->execute();
        $stmt_gid->bind_result($gid);
        if(!$stmt_gid->fetch()){
            echo "<h4>no such game found, check the gamename</h4>";
            return;
        }
    } catch(mysqli_sql_exception $e){
        echo $e->getMessage();
    }
    

    $dbc = new DbConn();

    if(!isset($orderFlag)){
    	$query = "select uid, timestamp, role, score from " . $dbc->tbl_scores . " where gid=? order by timestamp desc limit 10";
    } else{
        if($orderFlag == 0){
	    echo 'Smaller score is better<br>'; 
	    $query = "select uid, timestamp, role, CONVERT(score, SIGNED INTEGER) as score_int from " . $dbc->tbl_scores . " where gid=? order by score_int limit 10";
	} else{
	    echo 'Higher score is better<br>'; 
	    $query = "select uid, timestamp, role, CONVERT(score, SIGNED INTEGER) as score_int from " . $dbc->tbl_scores . " where gid=? order by score_int desc limit 10";
	}
    }

    try {
        $stmt = $dbc->conn->prepare($query);
        $stmt->bind_param("i", $gid);
        $stmt->execute();
        $stmt->bind_result($usrid, $ts, $player, $score);
        echo '<table border="1" id="theScores" cellpadding="2">';
        echo '<tr><td><b>Game</b></td><td><b>Time</b></td><td><b>Username</b></td><td><b>Player</b></td><td><b>Score</b></td>';
        while($stmt->fetch()){
            $dbc_new = new DbConn();
            $query_usr = "select username from " .$dbc_new->tbl_members. " where id=?";
            $stmt_usr = $dbc_new->conn->prepare($query_usr);
            $stmt_usr->bind_param("s", $usrid);
            $stmt_usr->execute();
            $stmt_usr->bind_result($usr);
            if(!$stmt_usr->fetch()){
                echo "<h4>No user found</h4>";
                echo "</table>";
                return;
            }
            echo '<tr><td>';
            echo $gameName;
            echo '</td><td>';
            echo $ts;
            echo '</td><td>';
            echo $usr;
            echo '</td><td>';
            echo $player;
            echo '</td><td>';
            echo $score;
            echo '</td></tr>';
        }
    	echo "</table>";
    } catch (mysqli_sql_exception $e){
        echo $e->getMessage();
    }
}

?>
