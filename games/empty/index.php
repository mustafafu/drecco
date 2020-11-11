<!DOCTYPE html>
<html>
<head>
    <?php $base = "../../" ?>
<!--    <base href="http://cims.nyu.edu/~by653/hps/">-->
    <base href="../../">
    <script src="js/jquery-2.2.4.min.js"></script>
    <script src="js/facebox.js"></script>
    <script src="js/gameSettings.js"></script>
    <link rel="stylesheet" type="text/css" href="css/facebox.css"/>
    <link rel="stylesheet" type="text/css" href="css/main.css"/>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            $('a[rel*=facebox]').facebox()
        })
    </script>
</head>
<body>
<div class="container">
    <?php include $base."header.php"; ?>
    <nav>
        <ul>
        <li><a href="">Home</a></li>
            <li><a href="games/empty">Empty Template</a></li>
        </ul>
        <?php include $base."leftMenuGame.php"; ?>
    </nav>
    <article>
        <h1 id="gameName"></h1>
        <h3 id="groupName"></h3>
        <h3>Instruction:</h3>
        <div id="gameDesc" class="jumbotron">
        </div>
	<div id="scoreArea", class="jumbotron">
	<?php 
	    include $base."getScore.php";
	    /*
	    * arg1: gameName, should be the same as the dir name 
	    * arg2: if your score is sortable, pass 1 if higher score is better, 0
	    *       if smaller score is better. Otherwise no need to pass variable
	    *       
	    */
	    // TODO: uncomment this in real use
	    // getScore($gameName, $orderFlag);
	?>
	</div>
        <h3>Settings</h3>
        <form id="gameSettings" class="well">
        </form>
        <iframe src="games/empty/iframe.html" class="game" width="800" height="800"></iframe>
    </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    initInfo("TEST", "TEST GROUP", "TEST DESCRIPTION");
    newTextBox("testbox",'textBoxDemo');
    var choices = ['PvP','PvAI','AIvP'];
    newButtonGroup('mode',choices,'btnDemo');
    newSelect('anotherMode',choices,'selectDemo');
    newWindowBtn(800,800,"games/empty/iframe.html", ['textBoxDemo', 'btnDemo', 'selectDemo']);
</script>
</body>
</html>
