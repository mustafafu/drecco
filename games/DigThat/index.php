<!DOCTYPE html>
<html>
<head>
    <?php $base = "../../" ?>
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
        </ul>
        <?php include $base."leftMenuGame.php"; ?>
    </nav>
    <article>
        <h1 id="gameName">Dig That</h1>
        <h3 id="groupName">Team WA</h3>
        <h3>Instruction:</h3>
        <div id="gameDesc" class="jumbotron">
            <strong>Overview:</strong> <br/>
            <p> Dig That is a two-player game between a Badguy and a Detector.
                The Badguy builds an explosive tunnel under the city and it is the role of the Detector to detect the tunnel.
                Two people can play, or one person can play Detector and the computer will be the Badguy.</p>
            <strong>Phases:</strong> <br/>
            <ol>
                <li> The Detector looks away from the screen while the Badguy builds a tunnel.
                    Maximum length of the tunnel is randomly generated,
                    and will be specified before building begins.
                    The tunnel needs to be a simple path with a start and end node on the top and bottom rows respectively.
                    In order to construct the tunnel, the Badguy needs to click on the edges he wants to be a part of his tunnel.
                    When he is content with the tunnel, he clicks on the "I finished my tunnel" button in the info panel and the tunnel will disappear. </li>
                <li> Now the Detector can begin detecting by placing probes on any number of intersections or edges. When the Detector is done,
                    click the "Done placing first round of probes" button.
                    If a given probe is on top of a part of the tunnel,
                    the probe will turn green. Repeat this process up to two more times. </li>
                <li> The Detector selects what she believes is the location of the tunnel.
                    When she is done, she clicks on the "Ready to submit final guess" button. </li>
            </ol>
            <p>If the Detector correctly detected the tunnel, her score is (intersection probes + edge probes) she used. If she incorrectly detected the tunnel, then she gets a score of infinity. Now the two players reverse roles. The winner is the player with the lowest score. </p>
        </div>
        <h3>Leaderboard:</h3>
	<div id="scoreArea", class="jumbotron">
	<?php 
	    include $base."getScore.php";
	    /*
	    * arg1: gameName, should be the same as the dir name 
	    * arg2: if your score is sortable, pass 1 if higher score is better, 0
	    *       if smaller score is better. Otherwise no need to pass variable
	    */
	    getScore("DigThat", 0);
	?>
	</div>
        <h3>Settings</h3>
        <form id="gameSettings" class="well">
            <h3> If you want to play in a separate window, press popup </h3>
        </form>
        <iframe src="games/DigThat/iframe.html" class="game" width="900" height="1200"></iframe>
    </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    newWindowBtn(800,800,"games/DigThat/iframe.html", ['textBoxDemo', 'btnDemo', 'selectDemo']);
</script>
</body>
</html>
