<?php
/**
 * Created by PhpStorm.
 * User: boyuan
 * Date: 11/29/16
 * Time: 1:52 PM
 */
class NewSaveData extends DbConn
{
    public function save($usr, $game, $data)
    {
        try {

            $db = new DbConn;
            $tbl_saves = $db->tbl_saves;
            $tbl_games = $db->tbl_games;
            $tbl_members = $db->tbl_members;

            $stmt = $db->conn->prepare("SELECT gid FROM ".$tbl_games." WHERE name = ?");
            $stmt->bind_param('s', $game);
            $stmt->execute();
            $stmt->bind_result($gid);
            $stmt->fetch();

            $db = new DbConn;
            $stmt = $db->conn->prepare("SELECT id FROM ".$tbl_members." WHERE username = ?");
            $stmt->bind_param('s', $usr);
            $stmt->execute();
            $stmt->bind_result($uid);
            $stmt->fetch();
            // prepare sql and bind parameters
            $datetimeNow = date("Y-m-d H:i:s");

            $db = new DbConn;
            $stmt = mysqli_query($db->conn, "SELECT lastgame FROM " . $tbl_saves . " WHERE uid = ".$uid." AND gid = ".$gid);
            if (mysqli_num_rows($stmt) > 0) {
                $db = new DbConn;
                $stmt = $db->conn->prepare("UPDATE " . $tbl_saves . " SET save = ?, lastgame = ? WHERE uid = ? AND gid = ?");
                $stmt->bind_param('sssi', $data, $datetimeNow, $uid, $gid);
                $stmt->execute();
            } else {
//            $base_url = 'http://' . $_SERVER['SERVER_NAME'];
//            $signin_url = substr($base_url . $_SERVER['PHP_SELF'], 0, -(6 + strlen(basename($_SERVER['PHP_SELF']))));
//            echo $base_url;
//            echo "<p/>";
//            echo $signin_url;
//            echo "<p/>";
//            echo $_SERVER['PHP_SELF'];
//            echo "<p/>";
//            echo basename($_SERVER['PHP_SELF']);
//            echo "<p/>";
//            echo stream_resolve_include_path('dbconn.php');
//            echo "<p/>";
                $db = new DbConn;
                $stmt = $db->conn->prepare("INSERT INTO " . $tbl_saves . "(save, lastgame, uid, gid) VALUES (?,?,?,?)");
                $stmt->bind_param('sssi', $data, $datetimeNow, $uid, $gid);
                $stmt->execute();
            }
            $err = '';

        } catch (mysqli_sql_exception $e) {

            $err = "Error: " . $e->getMessage();

        }
        //Determines returned value ('true' or error code)
        if ($err == '') {

            $success = 'true';

        } else {

            $success = $err;

        };

        return $success;

    }

    public function load($usr, $game)
    {
        try {

            $db = new DbConn;
            $tbl_saves = $db->tbl_saves;
            $tbl_games = $db->tbl_games;
            $tbl_members = $db->tbl_members;

            $stmt = $db->conn->prepare("SELECT gid FROM ".$tbl_games." WHERE name = ?");
            $stmt->bind_param('s', $game);
            $stmt->execute();
            $stmt->bind_result($gid);
            $stmt->fetch();
            $db = new DbConn;
            $stmt = $db->conn->prepare("SELECT id FROM ".$tbl_members." WHERE username = ?");
            $stmt->bind_param('s', $usr);
            $stmt->execute();
            $stmt->bind_result($uid);
            $stmt->fetch();
            // prepare sql and bind parameters

            $db = new DbConn;
            $stmt = $db->conn->prepare("SELECT save FROM " . $tbl_saves . " WHERE uid = ? AND gid = ?");
            $stmt->bind_param("si", $uid, $gid);
            $stmt->execute();
            $stmt->bind_result($data);
            $stmt->fetch();
            $err = '';

        } catch (mysqli_sql_exception $e) {

            $err = "Error: " . $e->getMessage();

        }
        //Determines returned value ('true' or error code)
        if ($err == '') {

            $success = 'true';

        } else {

            $success = $err;

        };

        return array($data, $success);

    }
}
