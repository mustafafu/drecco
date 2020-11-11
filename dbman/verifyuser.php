<!DOCTYPE html>
<html>
  <head>
      <base href="http://cims.nyu.edu/~mfo254/drecco">
    <link href="css/bootstrap.css" rel="stylesheet" media="screen">
    <link href="css/main.css" rel="stylesheet" media="screen">
    <meta charset="UTF-8">
    <title>Verify User</title>
  </head>
  <body>
<?php
require dirname(__FILE__).'/includes/functions.php';
include dirname(__FILE__).'/config.php';

//Pulls variables from url. Can pass 1 (verified) or 0 (unverified/blocked) into url
$uid = $_GET['uid'];
$verify = $_GET['v'];
$e = new SelectEmail;
list($email, $username) = $e->emailPull($uid);

$v = new Verify;

if (isset($uid) && trim($uid) != false && isset($verify) && trim($verify) != false) {

    //Updates the verify column on user
    $vresponse = $v->verifyUser($uid, $verify);

    //Success
    if ($vresponse == 'true') {
        echo $activemsg;

        //Send verification email
        $m = new MailSender;
        $m->sendMail($email, $username, $uid, 'Active');
    } else {
        //Echoes error from MySQL
        echo $vresponse;
    }
} else {
    //Validation error from empty form variables
    echo 'An error occurred... click <a href="index.php">here</a> to go back.';
};

?>
</body>
</html>
