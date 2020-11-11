<?php
/**
 * Created by PhpStorm.
 * User: Shawnchen
 * Date: 11/29/16
 * Time: 10:34 AM
 */
require dirname(__FILE__)."/dbman/includes/functions.php";
$dbc = new DbConn;
$tbl_games = $dbc->tbl_games;
$query = "select name, dir from ".$tbl_games." order by name";
$res = $dbc->conn->query($query);

while($row = $res->fetch_array()){
    $rows[] = $row;
}

echo "<ul>";
echo "<li><h4>Games</h4></li>";
//echo "<li><a href='index.php?task=addGame'>Add game</a></li><br/>";

if(!empty($rows)) {
    foreach ($rows as $row) {
        # echo "<li><a href='".$row['dir']."'>\".$row['name'].\"</a></li>";
        $name = $row['name'];
        $dir  = $row['dir'];
        echo "<li><a href='$dir'>$name</a></li>";
    }
}

echo"</ul>";
// $res->close();
