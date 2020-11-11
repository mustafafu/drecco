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
<!--            <li><a href="games/empty">Empty Template</a></li>-->
        </ul>
        <?php include $base."leftMenuGame.php"; ?>

    </nav>
    <article>
        <h1 id="gameName">No Tipping</h1>
        <h3 id="groupName">TheRons</h3>
        <h3>Instruction:</h3>
        <div class="jumbotron">
            <p> You are given uniform, flat board which is <strong> m </strong> meters long weighing <strong> w </strong> kg. Consider it ranging from <strong>-m/2 </strong> to <strong> m/2 </strong>. We place two supports of equal heights at positions -3 and -1 and a 3 kilogram block at position -4. The No Tipping game is a two person game that works as follows: </p>

            <p> <strong> Stage 1: </strong> Two players each start with <strong> k </strong> blocks, the blocks consisting of weights 1 kg through k kg (where total number of blocks is less than length of board). The players alternate placing blocks onto the board in turns until they have no blocks remaining. If after any placement, the placed block causes the board to tip, then the player who placed the block loses. If the board never tips, the game moves on to the second stage.</p>

            <p> <strong> Stage 2: </strong> In this stage, players remove blocks one at a time in turns. After each play, if the block that was removed causes the board to tip, the player who removed the last block loses.</p>

            <p> <strong> How is Tipping Calculated? </strong> As the game proceeds, the net torque around each support is displayed. This is computed by the weight on the board * the distance to each support (board weight included). A clockwise force represents negative torque and counterclockwise represents positive torque. For no tipping to occur, the left support must be negative and the right support must be positive.</p>

            <p> <strong> Rules: </strong> 
                <p> - No player may place a block on top of another</p>
                <p> - Cannot place the same weight twice </p>
                <p> - Cannot remove weight from unoccupied space </p>
            </p>

            <p> <strong> Instructions </strong> 
                <p> - Press pop-up to access game window. </p>
                <p> - ADDING PHASE: When it is your turn (player 1), click on the weight number located near your name, and then on a 'tick' on the board to select the position to place this weight. Then click "submit move" to end your turn. </p>
                <p> - REMOVING PHASE: Select a 'tick' on the board to indicate which position you want to remove a weight from. Then click "submit move" to end your turn. </p>
            </p>

            <p> <strong> Note: </strong> For best experience, maximize window as much as possible. </p>
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
            getScore("NoTipping");
            ?>
        </div>
        <h3>Play game in pop up window:<h3>
        <form id="gameSettings" class="well"></form>
        <h4>Screenshot:</h4>
        <img src="./games/NoTipping/NoTipping.png" width="100%" heigth="100%"></img>
    </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    newWindowBtn(1000,1000,"./games/NoTipping/game.html",[]);
</script>
</body>
</html>
