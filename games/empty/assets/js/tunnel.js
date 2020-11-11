var tunnel = [];
var nodePrepare = [];
var edgePrepare = [];
var finalTunnel = [];
var size;
var mapLength;
var connectedNode = function (node, edge) {
  if(edge.type == "hedge"){
      var result = edge.x ==  node.x && (edge.y == node.y || edge.y + 1 == node.y);
      return result;
  } else {
      result = edge.y == node.y && (edge.x == node.x || edge.x + 1 == node.x);
      return result;
  }
};

var isValidLastEdge = function (map, edge) {
    return map[edge.type + 's'].length - 1 == edge.x;
};


var findShortestPathLength = function (map, start) {
    var queue = [];
    start.level = 0;
    queue.push(start);

    //Refresh bfs color for every node;
    for (var i = 0; i < map.hedges.length; i++){
        for (var j = 0; j < map.hedges[i].length; j++) {
            map.hedges[i][j].bfsColor = 0;
        }
    }

    for (var i = 0; i < map.vedges.length; i++){
        for (var j = 0; j < map.vedges[i].length; j++) {
            map.vedges[i][j].bfsColor = 0;
        }
    }

    while (queue.length > 0){
        var currentEdge = queue.shift();
        if(isValidLastEdge(map, currentEdge)){
            return currentEdge.level;
        }
        findAvailableNext(map, currentEdge).map(
            function (edge) {
                var color = edge.bfsColor;
                if (color == 0) {
                    edge.level = currentEdge.level + 1;
                    edge.bfsColor = 1;
                    queue.push(edge);
                }
            }
        );
        currentEdge.color = 2;
    }
    return -1;
};

var findAvailableNext = function (map, current) {
    var result = [];
    for (var i = 0; i < map.hedges.length; i++){
        for (var j = 0; j < map.hedges[i].length; j++){
            if (connectedEdge(current, map.hedges[i][j])){
                var connectedEdges = tunnel.filter(
                    function (edge) {
                        return connectedEdge(edge, map.hedges[i][j]);
                    }
                );
                if (tunnel.indexOf(map.hedges[i][j]) < 0 && connectedEdges.length <= 1){
                    result.push(map.hedges[i][j]);
                }
            }
        }
    }

    for (var i = 0; i < map.vedges.length; i++){
        for (var j = 0; j < map.vedges[i].length; j++){
            if (connectedEdge(current, map.vedges[i][j])){
                connectedEdges = tunnel.filter(
                    function (edge) {
                        return connectedEdge(edge, map.vedges[i][j]);
                    }
                );
                if (tunnel.indexOf(map.vedges[i][j]) < 0 && connectedEdges.length <= 1){
                    result.push(map.vedges[i][j]);
                }
            }
        }
    }
    return result;
};

var buildPath = function (map, start, sizeLeft) {
    var currentEdge = start;
    while(sizeLeft > 0) {
        var next = findAvailableNext(map, currentEdge).filter(
            function (edge) {
                tunnel.push(edge);
                var len = findShortestPathLength(map, edge);
                tunnel.pop();
                return len < sizeLeft - 1;
            }
        );
        var maxRandomLength = next.length;
        if (isValidLastEdge(map, currentEdge)){
            maxRandomLength++;
        }
        var randomIndex = Math.floor(Math.random() * (maxRandomLength));
        if (randomIndex == next.length){
            return;
        } else {
            currentEdge = next[randomIndex];
            tunnel.push(currentEdge);
            sizeLeft--;
        }
    }
};

var connectedEdge = function (edgeOne, edgeTwo) {
    if(edgeOne.type == edgeTwo.type){
        if(edgeOne.type == "hedge") {
            return edgeOne.x == edgeTwo.x && Math.abs(edgeOne.y - edgeTwo.y) == 1;
        } else {
            return edgeOne.y == edgeTwo.y && Math.abs(edgeOne.x - edgeTwo.x) == 1;
        }
    } else {
        if(edgeOne.type == "vedge"){
            return connectedEdge(edgeTwo, edgeOne);
        } else {
            return (edgeOne.x == edgeTwo.x || edgeOne.x - edgeTwo.x == 1)
            && (edgeOne.y == edgeTwo.y || edgeOne.y - edgeTwo.y == -1)
        }
    }
};

var tryGo = function (startEdge){
    var edgesLeft = tunnel.slice();
    var iterateEdge = startEdge;
    var result = [startEdge];
    while(edgesLeft.length > 0){
        var options = edgesLeft.filter(
            function (edge) {
                return connectedEdge(iterateEdge, edge);
            }
        );
        //console.log(iterateEdge.x, iterateEdge.y, iterateEdge.type);
        if(options.length != 1){
            return result;
        } else {
            result.push(options[0]);
            edgesLeft = edgesLeft.filter(
                function(edge){
                    return edge != iterateEdge;
                }
            );
            iterateEdge = options[0];
        }
    }
    return result;
};

module.exports = function (length) {
    mapLength = length;
    size = Math.floor(Math.random() * (4 * length - 2 * length)) + 2 * length;
    tunnel = [];
    return{
        //Adding tunneling APIs
        getSize: function () {
            return size;
        },

        edgeLeft: function () {
            return size - tunnel.length;
        },

        finishGuess: function () {
            alert("123");
        },

        isValid: function (length) {
            var i;
            for(i = 0; i < tunnel.length; i++){
                var result = tryGo(tunnel[i]);
                if(result[0].x < result[result.length - 1]){
                    result.reverse();
                }
                if(result.length == tunnel.length){
                    if(result[0].x == 0) {
                        var lastEdge = result[result.length - 1];
                        if(lastEdge.type == "hedge"){
                            return lastEdge.x == length;
                        } else {
                            var last2ndEdge = result[result.length - 2];
                            return lastEdge.x == length - 1 && last2ndEdge.x != length;
                        }
                    }
                }
            }
            return false;
        },

        easyTunnel: function (map) {
            while(tunnel.length) {
                tunnel.pop();
            }
            var randomIndex = Math.floor(Math.random() * (length));
            var randomStart = map.hedges[0][randomIndex];
            tunnel.push(randomStart);
            while(!isValidLastEdge(map, tunnel[tunnel.length - 1])) {
                tunnel = [];
                tunnel.push(randomStart);
                buildPath(map, randomStart, size - 1);
            }
        },

        finalGuess: function () {
            var tunnelLeft = finalTunnel.filter(
                function (edge) {
                    return tunnel.filter(
                        function (newEdge) {
                            return newEdge == edge;
                        }
                    ).length > 0;
                }
            );
            if (tunnelLeft.length == finalTunnel.length && tunnelLeft.length > 0) {
                return edgePrepare.length + nodePrepare.length;
            } else {
                return -1;
            }
        },

        finalSelectEdge: function(edge) {
            if (finalTunnel.indexOf(edge) < 0 && finalTunnel.length < size) {
                finalTunnel.push(edge);
                //console.log(finalTunnel);
                return true;
            } else {
                if (finalTunnel.indexOf(edge) >= 0) {
                    finalTunnel = finalTunnel.filter(
                        function (myEdge) {
                            return myEdge != edge;
                        }
                    );
                    //console.log(finalTunnel);
                    return true;
                }
                return false;
            }
        },


        selectEdge: function (edge) {
            if(tunnel.indexOf(edge) < 0 && tunnel.length < size) {
                tunnel.push(edge);
                return true;
            } else {
                if (tunnel.indexOf(edge) >= 0){
                    tunnel = tunnel.filter(
                        function (myEdge) {
                            return myEdge != edge;
                        }
                    );
                    return true;
                }
                return false;
            }
        },

        //Guess Part APIs
        prepareEdge: function (edge) {
            if (edge.selected == 0) {
                if (edgePrepare.indexOf(edge) < 0) {
                    edgePrepare.push(edge);
                    edge.selected = 1;
                }
            } else if (edge.selected == 1) {
                edgePrepare = edgePrepare.filter(function (myEdge) {
                    return myEdge != edge;
                });
                edge.selected = 0;
            }
        },

        prepareNode: function (node) {
            if (node.selected == 0) {
                if (nodePrepare.indexOf(node) < 0) {
                    nodePrepare.push(node);
                    node.selected = 1;
                }
            } else if (node.selected == 1){
                    nodePrepare = nodePrepare.filter(function (myNode) {
                        return myNode != node;
                    });
                    node.selected = 0;
            }
        },

        guessResult: function (isEasyMode) {
            var goodEdges = edgePrepare.filter(
                function (prepareEdge) {
                    prepareEdge.selected = 2;
                    return tunnel.indexOf(prepareEdge) >= 0;
                }
            );

            if(isEasyMode){
                tunnel.map(function (edge) {
                        var connectEdges = edgePrepare.filter( function(edgeTwo){
                            return connectedEdge(edge, edgeTwo);
                        });
                        var connectNodes = nodePrepare.filter( function(node){
                            return connectedNode(node, edge);
                        });
                        if(connectEdges.length > 0 || connectNodes.length > 0 && goodEdges.indexOf(edge) < 0){
                            goodEdges.push(edge);
                            edge.selected = 2;
                        }
                    }
                )
            }

            var badEdges = edgePrepare.filter(
                function (edge) {
                    return goodEdges.indexOf(edge) < 0;
                }
            );
            var goodNodes = nodePrepare.filter(
                function (node) {
                    node.selected = 2;
                    var searchResult = tunnel.filter(
                        function (edge) {
                            return connectedNode(node, edge);
                        }
                    );
                    return searchResult.length > 0;
                }
            );

            var badNodes = nodePrepare.filter(
                function (node) {
                    return goodNodes.indexOf(node) < 0;
                }
            );

            return {
                goodEdges: goodEdges,
                badEdges: badEdges,
                goodNodes: goodNodes,
                badNodes: badNodes
            };
        },

        resetTunnel: function () {
            var n = nodePrepare.length;
            for(var i = 0; i < n; i++){
                nodePrepare[i].selected = 0;
            }
            n = edgePrepare.length;
            for(var i = 0; i < n; i++){
                edgePrepare[i].selected = 0;
            }
            finalTunnel.length = 0;
            nodePrepare.length = 0;
            edgePrepare.length = 0;
            tunnel.length = 0;
        }
    }
};