<?php
    session_start();
    session_destroy();
    header("Refresh:0; url=../");
//    header("location:main_login.php");
