<?php
require dirname(__FILE__).'/includes/functions.php';
$type = $_GET['type'];
$usr = $_GET['user'];
$game = $_GET['game'];
$saveData = $_GET['data'];
if ($usr == '' || $game == '' || $usr == 'guest') {
    echo '404';
    return;
}
if ($usr != $_SESSION['username']) {
    echo '403';
    return;
}
$conn = new NewSaveData;
if ($type == 'save') {
    $response = $conn->save($usr, $game, $saveData);
    $data = 200;
} else if ($type = 'load') {
    list($data, $response) = $conn->load($usr, $game);
}

//Success
if ($response == 'true') {

    echo $data;

} else {
    //Failure
    mySqlErrors($response);

}
