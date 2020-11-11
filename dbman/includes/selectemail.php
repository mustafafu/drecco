<?php
class SelectEmail extends DbConn
{
    public function emailPull($id)
    {
        try {
            $db = new DbConn;
            $tbl_members = $db->tbl_members;

            $stmt = $db->conn->prepare("SELECT email, username FROM ".$tbl_members." WHERE id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $stmt->bind_result($email, $username);
            $stmt->fetch();
            return array($email, $username);

        } catch (mysqli_sql_exception $e) {

            $result = "Error: " . $e->getMessage();

        }

        //Queries database with prepared statement
        return $result;

    }
}
