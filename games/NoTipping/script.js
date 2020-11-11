function setup() {
    width = document.getElementById('game-container').offsetWidth - 100;
    containerHeight = window.innerHeight;
    height = width * 3 / 4 - width / 6;
    canvas = createCanvas(width, Math.max(height, containerHeight * 3 / 4)); // ~4:3 aspect ratio
    canvas.parent('game-container');

    button = createButton('Submit move');
    button.position(width - 150, height - 50);
    button.parent('game-container');
    button.attribute('class', 'btn btn-success')
    button.mousePressed(nextTurn);
}

var canvas;
var boardState = [];
var boardColor = [];
var boardSize = -1;
var boardWeight = -1;
var inGame = false;
var done = false;
var numStones;
var turn = 0;
var selectedWeight = -1;
var selectedTile = -1;
var maxDist = 12;
var game;
var message = '';
var extra = 50;
var tipping = false;
var maxTip = 32;
var currTip = 0;
var numberTextSize = 24;
var leftTorque = 0;
var rightTorque = 0;

function draw() {
    background(220);
    fill(255);
    //rect(20, 200, width-40, 20);
    if(inGame) {
        strokeWeight(0);
        drawMessage();
        drawPlayers();
        drawUnusedWeights();
        drawTorque();
        if(!tipping) {
            strokeWeight(0);
            drawTable();
            drawTiles();
            strokeWeight(1);
        } else{
            tipBoard();
        }
    }
}

    /*
     * Properties is an object containing all necessary information for game.
     *
     * - numberOfWeights: number of weights in the game
     * - boardLength: length of the board
     * - boardWeight: the weight of the board
     * - player1: Gives the name for player 1.
     * - player2: Gives the name for player 2.
     * - time: Amount of time that each player has
     */
function startGame() {
    message = '';
    player1 = document.getElementById("player-1").value;
    player2 = document.getElementById("player-2").value;
    numStones = document.getElementById("number-of-weights").value;
    boardSize = document.getElementById("size-of-board").value;
    boardWeight = document.getElementById('weight-of-board').value;

    if(boardSize < 2 * numStones + 2) {
            document.getElementById('error-message').innerText = "Board size is too small. Number of weights must be less than or equal to half length of the board.";
            document.getElementById('error-container').style.display = 'block';
            inGame = false;
            return;
    }

    game = new Game({
        player1: player1,
        player2: player2,
        numberOfWeights: numStones,
        boardLength: boardSize,
        boardWeight: boardWeight,
        time: 120
    });

    done = false;
    leftTorque = game.board.leftTorque;
    rightTorque = game.board.rightTorque;
    currTip = 0;
    tipping = false;
    boardState = [];
    boardColor = [];
    selectedTile = -1;
    selectedWeight = -1;
    turn = 0;

    for(var i = 0; i < boardSize; i++) {
        boardState.push(0);
        boardColor.push(0);

    }

    var defaultBlock = boardSize/2;
    defaultBlock-=4;
    boardColor[defaultBlock] = 3;
    boardState[defaultBlock] = 3;

    inGame = true;
}

function drawTable() {

    var start = 60;
    var length = width - 168;
    fill(0);
    stroke(0);
    var step = length / boardSize;
    rect(start, 3 * height/4, length - step, 3);
    // INDICES FOR TICK MARKS

    for(var i = 0; i < boardSize; ++i) {
        strokeWeight(0);
        var size =1;
        if(selectedTile == i) {
            stroke(0,0,0);
            fill(0,255,0);
            size = 3;
        }else{
            stroke(0,0,0);
        }

        // console.log(i, start + i * step, 3 * height / 4 - 10, size, 20)
        strokeWeight(1);
        if(selectedTile == i) {
            rect(start + i * step - .75, 3 * height / 4 - 10, size, 20);
        } else {
            rect(start + i * step, 3 * height / 4 - 10, size, 20);     // strokeWeight affects the green
        }
        textSize(numberTextSize);
        stroke(0);
        if(i % 5 == 0) {
            strokeWeight(0);
            fill(0);
            text(i - (boardSize / 2), start + i * step, 3 * height / 4 + 60);
            strokeWeight(1);
        }

    }

    strokeWeight(0);
    fill(color('rgba(130, 121, 113, 1)'));
    triangle(start + (boardSize / 2 - 3.0) * step + 1.25, 3 * height / 4, start + (boardSize / 2 - 3.125) * step + 1.25, 3 * height / 4 + 40, start +(boardSize / 2 - 2.875) * step + 1.25, 3 * height / 4 + 40);
    rect(start + (boardSize / 2 - 3.125) * step + 1.25, height, step / 4, - (height / 4) + 40);

    // UPSIDE DOWN RECTANGLES
    // triangle(start + (boardSize / 2 - 3) * step, 3 * height / 4 + 40, start + (boardSize / 2 - 3.75) * step, 3 * height / 4, start + (boardSize/2 - 2.25) * step, 3 * height / 4);

    // triangle(start + (boardSize / 2 - 1) * step, 3 * height / 4 + 40, start + (boardSize / 2 - 1.75) * step, 3 * height / 4, start + (boardSize/2 - 0.25) * step, 3 * height / 4);

    triangle(start + (boardSize / 2 - 1) * step + 1.25, 3 * height / 4, start + (boardSize / 2 - 1.125) * step + 1.25, 3 * height / 4 + 40, start + (boardSize / 2 - .875) * step + 1.25, 3 * height / 4 + 40);
    rect(start + (boardSize / 2 - 1.125) * step + 1.25, height, step / 4, - (height / 4) + 40);
}

function tipBoard() {
    var start = 60;
    var length = width - 168;
    fill(0);
    stroke(0);
    var step = length / boardSize;
    translate(currTip * 10,0);
    rotate((PI/200) * currTip);
    rect(start, 3 * height/4, length - step, 3);
    currTip++;
    if(currTip > maxTip) {
        currTip = maxTip;
    }
}

function drawTiles() {
            var start = 60;
            var length = width -168;
            var flip = 30;
            var step = length/boardSize;
            for( var i =0; i < boardSize; ++i) {
                if ( boardState[i] == 0)continue;
                if (boardColor[i] == 1) {
                    fill(255, 0, 0);
                    stroke(255,0,0);
                }else if(boardColor[i] == 2) {
                    fill(0, 0, 255);
                    stroke(0,0,255);
                }else{
                    fill(0,0,0);
                }
                textSize(numberTextSize);
                rect(start + i * step - 10, 3 * height /4 - 20 - (boardState[i] * 10), 20,boardState[i] * 10);
                text(boardState[i], start + i * step - 3, 3 * height /4 - 30 - (boardState[i] * 10));
        }
}

function drawPlayers() {
            // Player 1 Text
    textSize(30);
    fill(255,0,0);
    stroke(255,0,0);
    text(player1, width/4, 60);
            // Player 2 Text
    fill(0,0,255);
    stroke(0,0,255);
    text(player2, width -(width/3), 60);
}

function mouseClicked() {
    var start = 10;
    var length = width - 168;
    var step = length/10/2;
    var right = 0;
    var down = 120;
    var half = maxDist /2;
    for(var i = 1; i <= numStones; i++) {
        var x = half + start + right * step;
        x+= extra;
        var y = down-half;
        var dx = x - mouseX;
        if(dx <0) dx = 0 - dx;

        var dy = y - mouseY;
        if(dy <0) dy = 0 - dy;

        if(dx <maxDist && dy < maxDist && turn == 0) {
            selectedWeight = i;
            break;
        }

        right = right + 2;

        if( right >= 10 ) {
            right = 0;
            down = down + 30;
        }
    }

    start = (width/2)+10;
    down = 120;
    right = 0;

    for(var i = 1; i <= numStones; i++) {
        var x = half + start + right * step;
        x+=extra;
        var y = down-half;
        var dx = x - mouseX;
        if(dx < 0) dx = 0 - dx;

        var dy = y - mouseY;
        if(dy < 0) dy = 0 - dy;

        if(dx <maxDist && dy < maxDist && turn ==1) {
            selectedWeight = i;
            break;
        }
        right = right + 2;
        if(right >= 10 ) {
            right = 0;
            down = down + 30;
        }
    }

    start = 60;
    step = length/boardSize;
    for(var i = 0; i < boardSize; ++i) {
        var x = half + start + i * step;
        var y = half + 3 * height/4 -10;
        var dx = mouseX - x;
        var dy = mouseY - y;
        if(dx < 0) dx = 0 - dx;
        if(dy < 0) dy = 0 - dy;

        if(dx < maxDist && dy < maxDist) {
            selectedTile = i;
        }
    }
}

  function drawUnusedWeights() {
    textSize(numberTextSize);
    fill(255,0,0);

    var start = 10;
    var length = width - 168;
    var step = length/10/2;
    var right = 0;
    var down = 120;

    for(var i = 1; i <= numStones; ++i) {
        var found = false;
        for(var j = 0; j < boardSize; ++j) {
            if (boardState[j] == i && boardColor[j] == 1) {
                found = true;
            }
        }
        if (!found ) {
            if(selectedWeight == i && turn == 0) {
                fill(0,255,0);
                stroke(0,0,0);
                textSize(numberTextSize + 4);
                strokeWeight(1);

            }else{
                fill(255,0,0);
                stroke(255,0,0);
                strokeWeight(0);
            }
            text(i, (start+right*step) + extra, down );
            textSize(numberTextSize);
            strokeWeight(0);
        }
        right = right + 2;
        if(right >= 10 ) {
            right = 0;
            down = down + 30;
        }
    }
    fill(0,0,255);
    stroke(0,0,255);
    start = (width / 2)+10;
    down = 120;
    right = 0;
    for(var i = 1; i <= numStones; ++i) {
        var found = false;
        for( var j = 0; j <= boardSize; ++j) {
            if( boardState[j] == i && boardColor[j] == 2) {
                found = true;
            }
        }
        if(!found) {
            if(selectedWeight == i && turn ==1) {
                fill(0,255,0);
                stroke(0,0,0);
                textSize(numberTextSize +4);
                strokeWeight(1);
            }else{
                fill(0,0,255);
                stroke(0,0,255);
            }
            text(i, (start + right * step) + extra, down);
            textSize(numberTextSize);
            strokeWeight(0);
        }
        right = right + 2;

        if( right >= 10 ) {
            right = 0;
            down = down + 30;
        }
    }
}

function nextTurn() {
    //logic for next turn
    /* important variables
        turn = current player turn. 0 = player1. 1 = player2
        selectedTile = the current location that the current player will choose to place or remove a weight
        selectedWeight = the current weight that the current player has chosen
        boardColor = array that tells you if a player has placed a weight on a tile. boardColor[i] can be 0,1,2. 0 = tile is empty. 1 = player 1 has placed a weight. 2 = player 2 has placed a weight.
        numStones = number of weights. number of stones.
        boardSate = array  that tells you the current weight placed on the board. boardStae[i] can be 1  to numStones. boardState[0] means there is no weight here, every other value means that there is a stone of weight boardState[i] at index 'i'.
    */

    if(done) return;
    if(game.gameState === 'Placing Weights') {
        message = game.placeWeight(Number(selectedWeight), Number(selectedTile) - Number(game.board.boardLength) / 2);
        boardState[selectedTile] = selectedWeight;
        boardColor[selectedTile] = turn+1;
    } else {
        message = game.removeWeight(Number(selectedTile) - Number(game.board.boardLength) / 2);
        boardState[selectedTile] = 0;
    }

    leftTorque = game.board.leftTorque;
    rightTorque = game.board.rightTorque;

    if(message.indexOf("Tipping") != -1) { // TIP BOARD
        console.log('Board has tipped');
        tipping = true;
	game.gameOver = true;
    }

    turn ^= 1;
    selectedTile = -1;
    selectedWeight = -1;
    drawUnusedWeights();

    // IN PROD
    if(game.gameOver) {
        gameOver();
	game.gameOver = false;
	done = true;
    }

}

function drawMessage() {
    fill(0,0,0);
    stroke(0,0,0);
    strokeWeight(1);
    textSize(30);
    textAlign(CENTER, CENTER);

    text(message, width / 2, height / 2 - 50);
}

function drawTorque() {
    fill(255, 153, 0 );
    stroke(255, 153, 0 );
    strokeWeight(1);
    textSize(24);

    textAlign(CENTER, CENTER);

    text(leftTorque, (boardSize / 2 - 3) * ((width - 168) / boardSize) + 20, 15 * height / 16);
    text(rightTorque, 120 + (boardSize / 2 - 1) * ((width - 168) / boardSize) - 20, 15 * height / 16);
}

function gameOver() {
    $.get('https://cims.nyu.edu/drecco2016/games/NoTipping/saveScore.php', {
        score: game.players[turn].name,
        gamename: 'NoTipping',
        playername: game.players[0].name + ' vs ' + game.players[1].name
    }).done(function(data) { 
        console.log("Saved success");
        console.log(data);
    }).fail(function(data) {
        console.log("Saved failure");
        console.log(data);
    });
}

/*
 * Object for the board state. Maintains following information:
 *
 * - numberOfWeights: total number of weights
 * - boardLength: the length of the board
 * - boardWeight: the size of the board
 * - leftTorque, rightTorque: the left and right torque's values.
 * - boardState[i]: An array which stores the weight if there is one at index i.
 */
class Board {

    constructor(numberOfWeights, boardLength, boardWeight) {
        if(boardLength <= 3) {
            throw "Board size is too small"
        }

        if(numberOfWeights <= 0) {
            throw "Not enough weights to play"
        }

        this.leftTorque = 0;
        this.rightTorque = 0;

        this.numberOfWeights = numberOfWeights;
        this.boardLength = boardLength;
        this.boardWeight = boardWeight;
        this.boardState = new Array(boardLength * 2 + 1);

        for(let i = -this.boardLength; i <= this.boardLength; ++i) {
            this.boardState[i] = 0;
        }

        this.boardState[-4] = 3;
    }
}

/*
 * Object for the respective player. Contains the following information:
 *
 * - name: Name of the player
 * - timeLeft: Amount of time player has left (unnecessary(?))
 * - numberOfWeights: The total number of weights
 * - containsWeights: An array containing the weights they have available to use
 */
class Player {

    constructor(name, numberOfWeights, timeLeft) {
        this.name = name;
        this.numberOfWeights = numberOfWeights;
        this.timeLeft = timeLeft;

        this.containsWeight = new Array(numberOfWeights + 1);

        for(var i = 1; i <= numberOfWeights; ++i) {
            this.containsWeight[i] = true;
        }
    }
}

class Game {

    /*
     * Properties is an object containing all necessary information for game.
     *
     * - numberOfWeights: number of weights in the game
     * - boardLength: length of the board
     * - boardWeight: the weight of the board
     * - player1: Gives the name for player 1.
     * - player2: Gives the name for player 2.
     * - time: Amount of time that each player has
     */
    constructor(properties) {
        this.numberOfWeights = properties.numberOfWeights;
        this.boardLength = properties.boardLength;
        this.boardWeight = properties.boardWeight;
        this.totalTime = properties.time;
        this.gameOver = false;
        this.gameState = 'Placing Weights';
        this.currentTurn = 0;
        this.stonesPlaced = 0;
        this.stonesRemoved = 0;

        this.players = new Array(2);
        this.players[0] = new Player(properties.player1, this.numberOfWeights, this.totalTime);
        this.players[1] = new Player(properties.player2, this.numberOfWeights, this.totalTime);

        this.board = new Board(this.numberOfWeights, this.boardLength, this.boardWeight);

        // Keeps track of who made the move at i-th spot in board
        this.moveState = new Array(this.boardLength * 2 + 1);
        for(let i = -this.boardLength; i <= this.boardLength; ++i) {
            this.moveState[i] = -1;
        }

        this.isGameOver();
    }

    /*
     *  Determines whether the game is over based on left and right torque.
     *
     */
    isGameOver() {
        // initialize with board weight
        this.board.leftTorque = 3 * this.boardWeight;
        this.board.rightTorque = 1 * this.boardWeight;

        for(var i = -this.boardLength; i <= this.boardLength; ++i) {
            this.board.leftTorque += (i + 3) * this.board.boardState[i];
            this.board.rightTorque += (i + 1) * this.board.boardState[i];
        }

        this.board.leftTorque = - this.board.leftTorque;
        this.board.rightTorque = - this.board.rightTorque;

        var gameOver = (this.board.leftTorque > 0) || (this.board.rightTorque < 0);
        return gameOver;
    }

    /*
     * Method to place a weight at a given position. Validates to see first if move
     * is valid and then places weight to see if it results in tipping.
     *
     * @see isValidPlacement
     *
     * returns a message, indicating successful removal or whether tipping has occurred.
     */
    placeWeight(weight, position) {
        message = this.isValidPlacement(weight, position);
        if(message === '') {
            this.board.boardState[position] = weight;
            this.moveState[position] = this.currentTurn;
            this.players[this.currentTurn].containsWeight[weight] = false;

            if(this.isGameOver()) {
                return 'Tipping has occurred by ' + this.players[this.currentTurn].name
            } else {
                message = this.players[this.currentTurn].name + ' placed weight ' + weight + ' at position ' + position + '.';
                this.stonesPlaced++;
                if(this.stonesPlaced == 2 * this.numberOfWeights) {
                    this.gameState = 'Removing Weights';
                    message += '\n. Stage change: Now removing weights.'
                }

                this.currentTurn ^= 1;
                return message;
            }
        } else {
            this.gameOver = true;
            return message;
        }
    }

    /*
     * Check before weight placement to see if it is a valid move:
     * - position must be within board length
     * - position at board must be empty for weight to be placed
     * - player must contain the weight that they are placing
     */
    isValidPlacement(weight, position) {
        // instead of throwing error, set game to over...
        if(position < -this.boardLength || position > this.boardLength || this.board.boardState[position] != 0) {
            return 'Invalid position from ' + this.players[this.currentTurn].name;
        }

        if(!this.players[this.currentTurn].containsWeight[weight]) {
            return 'Invalid weight from ' + this.players[this.currentTurn].name;
        }

        return '';
    }

    /*
     * Method to remove a weight from a given position. Checks for move validity
     * and then if resulting move results in tipping.
     *
     */
    removeWeight(position) {
        message = this.isValidRemoval(position);
        if(message === '') {
            var weight = this.board.boardState[position];
            this.board.boardState[position] = 0;
            this.stonesRemoved += 1;

            if (this.isGameOver()) {
                return 'Tipping has occurred by ' + this.players[this.currentTurn].name;
            } else {
                // send message to client or display.
                message = this.players[this.currentTurn].name + ' removed weight ' + weight + ' at position ' + position + '.';
                this.currentTurn ^= 1;

                if(this.stonesRemoved == 2 * this.numberOfWeights) {
                    message = "Game has ended in a tie";
                    this.gameOver = true;
                }

                return message;
            }
        } else {
            gameOver = true;
            return message;
        }
    }

    /*
     * Check before weight removal to see if it is a valid move:
     * - position selected is within board length
     * - there exists a stone in this position
     */
    isValidRemoval(position) {
        if(position < -this.boardLength || position > this.boardLength || this.board.boardState[position] == 0) {
            return 'Invalid position from ' + this.players[this.currentTurn].name;
        }

        return '';
    }

    /*
     * Update the player's time based on the amount of time that they took.
     * (May be unnecessary for 2-player games)
     */
    updateTime(turn, time) {
        this.players[this.currentTurn].timeLeft -= time;

        if(this.players[this.currentTurn].timeLeft <= 0) {
            this.gameOver = true;
            return this.players[this.currentTurn].name + ' ran out of time';
        } else {
            return this.players[this.currentTurn].name + ' has ' + this.players[this.currentTurn].timeLeft + ' time left.';
        }
    }
}
