<?php
session_start();
if (isset($_SESSION['username'])) {
    setcookie('username', $_SESSION['username'], time() + (86400 * 30), "/");
    header("location:../index.php");
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
      <base href="http://cims.nyu.edu/~mfo254/drecco/">
    <meta charset="utf-8">
    <title>Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link href="css/bootstrap.css" rel="stylesheet" media="screen">
    <link href="css/form.css" rel="stylesheet" media="screen">
  </head>

  <body>
    <div class="container">

      <form class="form-signin" name="form1" method="post" action="dbman/checklogin.php">
        <h2 class="form-signin-heading">Please sign in</h2>
        <input name="myusername" id="myusername" type="text" class="form-control" placeholder="Username" autofocus>
        <input name="mypassword" id="mypassword" type="password" class="form-control" placeholder="Password">
        <!-- The checkbox remember me is not implemented yet...
        <label class="checkbox">
          <input type="checkbox" value="remember-me"> Remember me
        </label>
        -->
        <button name="Submit" id="submit" class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
<!--        <button name="Register" id="reg" class="btn btn-lg btn-primary btn-block" type="button" onclick="parent.location='./signup.php'">Register</button>-->

        <div id="message"></div>
      </form>

    </div> <!-- /container -->

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="js/jquery-2.2.4.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script type="text/javascript" src="dbman/js/bootstrap.js"></script>
    <!-- The AJAX login script -->
    <script src="dbman/js/login.js"></script>

  </body>
</html>
