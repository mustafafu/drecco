<?php
class LoginForm extends DbConn
{
    public function checkLogin($myusername, $mypassword)
    {   $mypassword = crypt($mypassword, CRYPT_BLOWFISH);
        $conf = new GlobalConf;
        $ip_address = $conf->ip_address;
        $login_timeout = $conf->login_timeout;
        $max_attempts = $conf->max_attempts;
        $timeout_minutes = $conf->timeout_minutes;
        list($attempts, $lastlogin) = checkAttempts($myusername);
        $curr_attempts = $attempts;

        $datetimeNow = date("Y-m-d H:i:s");
        $oldTime = strtotime($lastlogin);
        $newTime = strtotime($datetimeNow);
        $timeDiff = $newTime - $oldTime;

        try {

            $db = new DbConn;
            $tbl_members = $db->tbl_members;
            $err = '';

        } catch (mysqli_sql_exception $e) {

            $err = "Error: " . $e->getMessage();

        }

        $stmt = $db->conn->prepare("SELECT password, verified FROM ".$tbl_members." WHERE username = ?");
        $stmt->bind_param('s', $myusername);
        $stmt->execute();

        // Gets query result
        $stmt->bind_result($pwd, $ver);
        $stmt->fetch();

        if ($curr_attempts >= $max_attempts && $timeDiff < $login_timeout) {

            //Too many failed attempts
            $success = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Maximum number of login attempts exceeded... please wait ".$timeout_minutes." minutes before logging in again</div>";

        } else {

             //If max attempts not exceeded, continue
            // Checks password entered against db password hash
            if ($mypassword === $pwd && $ver == '1') {

                //Success! Register $myusername, $mypassword and return "true"
                $success = 'true';
                    session_start();

                    $_SESSION['username'] = $myusername;

            } elseif ($mypassword === $pwd && $ver == '0') {

                //Account not yet verified
                $success = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Your account has been created, but you cannot log in until it has been verified</div>";

            } else {

                //Wrong username or password
                $success = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Wrong Username or Password</div>";

            }
        }
        return $success;
    }

    public function insertAttempt($username)
    {
        try {
            $db = new DbConn;
            $conf = new GlobalConf;
            $tbl_attempts = $db->tbl_attempts;
            $ip_address = $conf->ip_address;
            $login_timeout = $conf->login_timeout;
            $max_attempts = $conf->max_attempts;

            $datetimeNow = date("Y-m-d H:i:s");
            list($attempts, $lastlogin) = checkAttempts($username);
            $curr_attempts = $attempts;

            $stmt = $db->conn->prepare("INSERT INTO ".$tbl_attempts." (ip, attempts, lastlogin, username) values(?, 1, ?, ?)");
            $stmt->bind_param("sss", $ip_address, $datetimeNow, $username);
            $stmt->execute();
            $curr_attempts++;
            $err = '';

        } catch (mysqli_sql_exception $e) {

            $err = "Error: " . $e->getMessage();

        }

        //Determines returned value ('true' or error code)
        $resp = ($err == '') ? 'true' : $err;

        return $resp;

    }

    public function updateAttempts($username)
    {
        try {
            $db = new DbConn;
            $conf = new GlobalConf;
            $tbl_attempts = $db->tbl_attempts;
            $ip_address = $conf->ip_address;
            $login_timeout = $conf->login_timeout;
            $max_attempts = $conf->max_attempts;
            $timeout_minutes = $conf->timeout_minutes;

            $att = new LoginForm;
            list($attempts, $lastlogin) = checkAttempts($username);
            $curr_attempts = $attempts;

            $datetimeNow = date("Y-m-d H:i:s");
            $oldTime = strtotime($lastlogin);
            $newTime = strtotime($datetimeNow);
            $timeDiff = $newTime - $oldTime;

            $err = '';
            $sql = '';

            if ($curr_attempts >= $max_attempts && $timeDiff < $login_timeout) {

                if ($timeDiff >= $login_timeout) {

                    $sql = "UPDATE ".$tbl_attempts." SET attempts = ?, lastlogin = ? where ip = ? and username = ?";
                    $curr_attempts = 1;

                }

            } else {

                if ($timeDiff < $login_timeout) {

                    $sql = "UPDATE ".$tbl_attempts." SET attempts = ?, lastlogin = ? where ip = ? and username = ?";
                    $curr_attempts++;

                } elseif ($timeDiff >= $login_timeout) {

                    $sql = "UPDATE ".$tbl_attempts." SET attempts = ?, lastlogin = ? where ip = ? and username = ?";
                    $curr_attempts = 1;

                }

                $stmt2 = $db->conn->prepare($sql);
                $stmt2->bind_param("isss", $curr_attempts, $ip_address, $datetimeNow, $username);
                $stmt2->execute();

            }

        } catch (mysqli_sql_exception $e) {

            $err = "Error: " . $e->getMessage();

        }

        //Determines returned value ('true' or error code) (ternary)
        $resp = ($err == '') ? 'true' : $err;

        return $resp;

    }

}
