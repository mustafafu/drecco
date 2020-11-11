var $ = require('jQuery');
module.exports = function () {
    return{
        saveScore: function (playerName, score) {
            $.get( "dbman/save.php",
                { gamename: "DigThat", playername: playerName, score: score},
                function() {
            }).done(function() {
                alert("Success");
            }).fail(function() {
                alert("Score save error");
            });
        }
    }
};