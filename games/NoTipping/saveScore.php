<?php

$game = $_GET['gamename'];
$usr = $_GET['playername'];
$score = $_GET['score'];

// echo "<h4>Get message</h4>";
saveScore($game, $usr, $score);

function saveScore($gamename, $playername, $score){
    // echo "<h5>$gamename</h5>";
    // echo "<h5>$playername</h5>";
    // echo "<h5>$score</h5>";
    // require dirname(__FILE__).'config.php';
    // require dirname(__FILE__).'includes/functions.php';
    require '../../dbman/config.php';
    require '../../dbman/includes/functions.php';

    $dbc = new Dbconn();
    $query_gid = "select gid from ".$dbc->tbl_games." where name=?";

    // echo "<h5>query:</h5>\n";
    // echo "<h5>$query_gid</h5>\n";

    try {
        $stmt_gid = $dbc->conn->prepare($query_gid);
        $stmt_gid->bind_param("s", $gamename);
        $stmt_gid->execute();
        $stmt_gid->bind_result($gid);
        if(!$stmt_gid->fetch()){
            echo "<h4>no game found</h4>\n";
        }
    } catch(mysqli_sql_exception $e){
        echo $e->getMessage();
    }
    
    // echo "<h4>Gid</h4>\n";
    // echo "<h5>$gid</h5>\n";

    $dbc = new Dbconn();
    $query_uid = "SELECT id FROM ".$dbc->tbl_members." WHERE username=?";
    // echo "<h5>query:</h5>\n";
    // echo "<h5>$query_uid</h5>\n";
    try{
        $stmt_uid = $dbc->conn->prepare($query_uid);
        if(!isset($_SESSION['username'])){
            $usrname = "guest";
	    // echo "USERNAME IS GUEST\n";
        } else{
            $usrname = $_SESSION['username'];
	    // echo "USERNAME IS $usrname\n";
        }
        $stmt_uid->bind_param("s", $usrname);
        $stmt_uid->execute();
        $stmt_uid->bind_result($uid);
	// while($stmt_uid->fetch()){
	// }
	if(!$stmt_uid->fetch()){
	    echo "<h4>no user found</h4>\n";
	}
    } catch (mysqli_sql_exception $e){
        echo $e->getMessage();
    }
    
    // echo "<h4>uid</h4>\n";
    // echo "<h5>$uid</h5>\n";

    $dbc = new Dbconn();
    date_default_timezone_set('America/New_York');
    $timestamp = date("D M j G:i:s T Y");
    $query = "insert into " . $dbc->tbl_scores . " (uid, gid, role, score, timestamp) values (?, ?, ?, ?, ?)";
    try {
        $stmt = $dbc->conn->prepare($query);
        $stmt->bind_param("sisss", $uid, $gid, $playername, $score, $timestamp);
        $stmt->execute();
    } catch (mysqli_sql_exception $e){
        echo $e->getMessage();
    }
}
