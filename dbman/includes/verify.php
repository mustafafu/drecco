<?php
class Verify extends DbConn
{
    public function verifyUser($uid, $verify)
    {
        try {
            $vdb = new DbConn;
            $tbl_members = $vdb->tbl_members;
            $verr = '';

        // prepare sql and bind parameters
        $vstmt = $vdb->conn->prepare('UPDATE '.$tbl_members.' SET verified = ? WHERE id = ?');
        $vstmt->bind_param('ii', $verify, $uid);
        $vstmt->execute();

        } catch (mysqli_sql_exception $v) {

            $verr = 'Error: ' . $v->getMessage();

        }

    //Determines returned value ('true' or error code)
    $resp = ($verr == '') ? 'true' : $verr;

        return $resp;

    }
}
