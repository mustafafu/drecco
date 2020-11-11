var hedges = [[]];
var vedges = [[]];
var nodes = [[]];

var initMap = function (length) {
    hedges = new Array(length+1);
    vedges = new Array(length);
    nodes = new Array(length + 1);
    for (var i = 0; i < length + 1; i++) {
        nodes[i] = new Array(length + 1);
        for (var j = 0; j < length + 1; j++) {
            nodes[i][j] = {
                class: {
                    node: true,
                    probe: true,
                    prepare: false,
                    probeAnim: true,
                    bad: false
                },
                x: i,
                y: j,
                selected: 0,
                level: 0,
                bfsColor: 0
            };
        }
    }

    for (var i = 0; i < length + 1; i++) {
        hedges[i] = new Array(length);
        for (var j = 0; j < length; j++) {
            hedges[i][j] = {
                class: {
                    hedge: true,
                    edge: true,
                    animate: false,
                    final: false,
                    prepare: false,
                    reveal: false,
                    bad: false
                },
                type: "hedge",
                x: i,
                y: j,
                selected: 0,
                level: 0,
                bfsColor: 0
            };
        }
    }

    for (var i = 0; i < length; i++) {
        vedges[i] = new Array(length);
        for (var j = 0; j < length + 1; j++) {
            vedges[i][j] = {
                class: {
                    vedge: true,
                    edge: true,
                    animate: false,
                    final: false,
                    prepare: false,
                    reveal: false,
                    bad: false
                },
                type: "vedge",
                x: i,
                y: j,
                selected: 0
            };
        }
    }
};

module.exports = function(length){
    initMap(length);
    return {
        hedges: hedges,
        vedges: vedges,
        nodes: nodes,

        prepare: function (element) {
            if (!element.class.reveal && !element.class.bad) {
                element.class.prepare = !element.class.prepare;
            }
        },

        reveal: function (element, type) {
            element.class.prepare = false;
            if(type == "good"){
                element.class.reveal = true;
            } else {
                element.class.bad = true;
            }

        },

        selectEdge: function (edge) {
            edge.class.animate = !edge.class.animate;
        },

        totalClearBoard: function () {
            var i, j;
            for (i = 0; i < hedges.length; i++) {
                var line = hedges[i];
                for (j = 0; j < line.length; j++) {
                    line[j].class.animate = false;
                    line[j].class.prepare = false;
                    line[j].class.bad = false;
                    line[j].class.reveal = false;
                    line[j].selected = 0;
                }
            }

            for (i = 0; i < vedges.length; i++) {
                line = vedges[i];
                for (j = 0; j < line.length; j++) {
                    line[j].class.animate = false;
                    line[j].class.prepare = false;
                    line[j].class.bad = false;
                    line[j].class.reveal = false;
                    line[j].selected = 0;
                }

            }
            for (i = 0; i < nodes.length; i++) {
                line = nodes[i];
                for (j = 0; j < line.length; j++) {
                    line[j].class.animate = false;
                    line[j].class.prepare = false;
                    line[j].class.bad = false;
                    line[j].class.reveal = false;
                    line[j].selected = 0;
                }
            }

        },

        clearBoard: function () {
            var i, j;
            for (i = 0; i < hedges.length; i++) {
                var line = hedges[i];
                for (j = 0; j < line.length; j++) {
                    line[j].class.animate = false;
                    line[j].class.prepare = false;
                }
            }

            for (i = 0; i < vedges.length; i++) {
                line = vedges[i];
                for (j = 0; j < line.length; j++) {
                    line[j].class.animate = false;
                    line[j].class.prepare = false;
                }

            }
            for (i = 0; i < nodes.length; i++) {
                line = nodes[i];
                for (j = 0; j < line.length; j++) {
                    line[j].class.animate = false;
                    line[j].class.prepare = false;
                }
            }

        }
    }
};