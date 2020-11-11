<?php
class NewUserForm extends DbConn
{
    public function createUser($usr, $uid, $email, $pw)
    {
        try {

            $db = new DbConn;
            $tbl_members = $db->tbl_members;
            // prepare sql and bind parameters
            $stmt = $db->conn->prepare("SELECT username FROM ".$tbl_members." WHERE username=?");
            $stmt->bind_param('s',$usr);
            $stmt->execute();
            $stmt->bind_result($exist);
            $stmt->fetch();
            if ($exist != '') {
                return "Error: SQLSTATE[23000]";
            }
            $db = new DbConn;
            $stmt = $db->conn->prepare("INSERT INTO ".$tbl_members." (id, username, password, email)
            VALUES (?,?,?,?)");
            $stmt->bind_param('ssss',$uid, $usr, $pw, $email);
            $stmt->execute();
            $err = '';
//            echo "INSERT INTO ".$tbl_members." (id, username, password, email)
//            VALUES (".$uid.",".$usr.",".$pw.",".$email.")";
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
}
