var MapFile = require('./map');
var TunnelFile = require('./tunnel');
var Vue = require('./lib/vue.js');
var SaverFile = require('./saver');
var Saver = SaverFile();
var Map = MapFile(4);
var Tunnel = TunnelFile(20);

var game = new Vue({
    el: '#gameArea',
    data: {
        size : 4,
        maxSize: 10,
        sizes : [4,5,6,7,8,9,10],
        nodes: Map.nodes,
        hedges: Map.hedges,
        vedges: Map.vedges,
        instr: false,
        winnerName: "",
        gameStatus: "mode selection",
        guessRound: 1,
        gameRound: 1,
        mode : "PvP",
        difficulty : "Normal",
        scoreOne: 0,
        scoreTwo: 0
    },

    watch :{
        size: function (newSize) {
            Map = MapFile(newSize);
            this.nodes = Map.nodes;
            this.hedges = Map.hedges;
            this.vedges = Map.vedges;
            this.size = parseInt(newSize);
        }
    },

    methods: {
        //Game logic
        startGame: function () {
            this.scoreTwo = 0;
            this.scoreOne = 0;
            Tunnel = TunnelFile(parseInt(this.size));
            Tunnel.resetTunnel();
            Map.totalClearBoard();
            if(this.mode == "AI"){
                Tunnel.easyTunnel(Map);
                alert("The computer has built a tunnel, detection start now!");
                this.gameStatus = "node/edge detection";
                this.gameRound = 2;
            } else {
                alert("It's player one's turn to build a tunnel, player two, please look away");
                this.gameStatus = "tunnel building";
            }
        },

        //When player click a edge, it may means that player is trying to build a tunnel or make a guess or make a final guess
        edgeClick: function (edge) {
            if(this.gameStatus == "tunnel building" || this.gameStatus == "tunnel guess") {
                Map.selectEdge(edge);
                if (this.gameStatus == "tunnel building") {
                    Tunnel.selectEdge(edge);
                } else if (this.gameStatus == "tunnel guess") {
                    Tunnel.finalSelectEdge(edge);
                }
            } else if (this.gameStatus == "node/edge detection") {
                Map.prepare(edge);
                Tunnel.prepareEdge(edge);
            }
        },

        //After each round of guess, we need to reveal the result of guesses.
        finishGuess: function () {
            if (this.gameRound == 1) {
                this.gameRound++;
                this.guessRound = 1;
                this.scoreOne = Tunnel.finalGuess();
                if (this.scoreOne == -1){
                    this.scoreOne = 10000;
                }
                alert("PlayerTwo as detector:"
                    + this. scoreOne +
                    "Player two, please build your tunnel now. Player ont please look away!");
                Map.totalClearBoard();
                Tunnel.resetTunnel();
                this.gameStatus = "tunnel building";
            } else {
                this.scoreTwo = Tunnel.finalGuess();
                if (this.scoreTwo == -1){
                    this.scoreTwo = 10000;
                }
                if (this.mode == "PvP") {
                    alert("PlayerTwo as detector:" + this.scoreOne + ". PlayerOne as detector:" + this.scoreTwo);
                } else {
                    alert("Your score:" + this.scoreTwo);
                }
                this.endGame();
            }
        },

        //Node can be clicked only when it is guessing.
        nodeClick: function (node) {
            if(this.gameStatus == "node/edge detection" && this.gameRound < 4) {
                Map.prepare(node);
                Tunnel.prepareNode(node);
            }
        },

        //When the guess if finished, we need to check the result, calculate the score.
        finishPrepare: function () {
            Map.clearBoard();
            this.guessRound ++;
            //console.log(guessRound);

            var result = Tunnel.guessResult(this.difficulty == "Easy");
            var goodNodes = result.goodNodes;
            var goodEdges = result.goodEdges;
            var badNodes = result.badNodes;
            var badEdges = result.badEdges;

            for(var i = 0; i < goodEdges.length; i++){
                Map.reveal(goodEdges[i],"good");
            }
            for(var i = 0; i < goodNodes.length; i++){
                Map.reveal(goodNodes[i],"good");
            }
            for(var i = 0; i < badEdges.length; i++){
                Map.reveal(badEdges[i],"bad");
            }
            for(var i = 0; i < badNodes.length; i++){
                Map.reveal(badNodes[i],"bad");
            }

            if (this.guessRound > 3) {
                this.gameStatus = "tunnel guess";
                alert("choose your final guess!");
                return;
            }
        },

        //Helper functions
        maxEdge: function () {
            return Tunnel.getSize();
        },

        saveScore: function () {
            var minScore = Math.min(this.scoreTwo, this.scoreOne);
            Saver.saveScore(this.winnerName, minScore);
            console.log(minScore);
            console.log(this.winnerName);
            this.gameStatus = "mode selection";
            this.scoreTwo = 0;
            this.scoreOne = 0;
        },

        getWinner: function () {
            if(this.mode == "PvP") {
                if (this.scoreOne > this.scoreTwo) {
                    return "Player One";
                } else if (this.scoreOne == this.scoreTwo) {
                    return "Player One && Player Two";
                } else {
                    return "Player Two";
                }
            } else {
                return "You";
            }
        },

        endGame: function () {
            this.gameRound = 1;
            this.guessRound = 1;
            this.gameStatus = "game end";
            Map.totalClearBoard();
        },

        clearBoard: function () {
            Tunnel.resetTunnel();
            Map.clearBoard();
        },

        gotoBegin: function () {
            Map.totalClearBoard();
            Tunnel.resetTunnel();
            this.gameStatus = "mode selection";

        },

        gotoDetect: function(){
            if(Tunnel.isValid(this.size)) {
                Map.clearBoard();
                this.gameStatus = "node/edge detection";
                alert("It's guess round now");
            } else {
                alert("Your tunnel is invalid. It must start on the top edge, end on the bottom edge, and be a single simple path.");
            }
        },

        isValid: function () {
            return Tunnel.isValid(this.size);
        },

        edgeLeft: function () {
            return Tunnel.edgeLeft();
        },

        //Show/Hide logic for html element
        showSaveButton: function () {
            return (this.scoreOne > 0 || this.scoreTwo > 0) && this.gameStatus == "game end";
        },

        showEdgeInfo: function () {
            return this.gameStatus == "tunnel building";
        },

        showGuessInfo: function () {
            return this.gameStatus == "node/edge detection";
        },

        showModeSelect: function () {
            return this.gameStatus == "mode selection";
        },

        showFinishGuessInfo: function () {
            return this.gameStatus == "tunnel guess";
        },

        showInstr: function(){
            return this.instr;
        },

        showBasicInfoPvP: function () {
            return this.mode == "PvP";
        },

        showBasicInfoAI: function () {
            return this.mode == "AI";
        },

        changeInstr: function () {
            this.instr = !this.instr;
        },
    }
});