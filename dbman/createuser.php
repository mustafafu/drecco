<?php
require dirname(__FILE__).'/config.php';
require dirname(__FILE__).'/includes/functions.php';
ini_set('display_errors', true); ini_set('display_startup_errors', true); error_reporting(E_ALL);

//Pull username, generate new ID and hash password
$newid = uniqid(rand(), false);
$newuser = $_POST['newuser'];
$newpw = crypt($_POST['password1'], CRYPT_BLOWFISH);
$pw1 = $_POST['password1'];
$pw2 = $_POST['password2'];

	//Enables moderator verification (overrides user self-verification emails)
if (isset($admin_email)) {

	$newemail = $admin_email;

} else {

	$newemail = $_POST['email'];

}
//Validation rules
if ($pw1 != $pw2) {

	echo '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Password fields must match</div><div id="returnVal" style="display:none;">false</div>';

} elseif (strlen($pw1) < 4) {

	echo '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Password must be at least 4 characters</div><div id="returnVal" style="display:none;">false</div>';

} elseif (!filter_var($newemail, FILTER_VALIDATE_EMAIL) == true) {

	echo '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Must provide a valid email address</div><div id="returnVal" style="display:none;">false</div>';

} else {
	//Validation passed
	if (isset($_POST['newuser']) && trim($_POST['newuser']) != false && isset($_POST['password1']) && trim($_POST['password1']) != false) {

		//Tries inserting into database and add response to variable

		$a = new NewUserForm;

		$response = $a->createUser($newuser, $newid, $newemail, $newpw);

		//Success
		if ($response == 'true') {

			echo '<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'. $signupthanks .'</div><div id="returnVal" style="display:none;">true</div>';

			//Send verification email
			$m = new MailSender;
			$m->sendMail($newemail, $newuser, $newid, 'Verify');

		} else {
			//Failure
			mySqlErrors($response);

		}
	} else {
		//Validation error from empty form variables
		echo 'An error occurred on the form... try again';
	}
};
