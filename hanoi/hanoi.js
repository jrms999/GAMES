var NUM_TOWERS = 3,
    NUM_DOUGHNUT = 5;
var doughnut = [];
var colors = ['red', 'green', 'blue', 'yellow', 'purple'];

function init() {
    for (var i = 0; i < NUM_DOUGHNUT; ++i) {
        doughnut[i] = new Doughnut(0, NUM_DOUGHNUT - i - 1, i, colors[i]);
    }

    integrate();
}

function integrate() {
    render();

    setTimeout(integrate, 20);
}

function Doughnut(tower, below, size, color) {
    this.tower = tower;
    this.below = below;
    this.size = size;
    this.color = color;
    this.dx = 0;
    this.dy = 0;
}

function smallestDoughnut(tower) {
    var min = NUM_DOUGHNUT;
    var minDoghnut = null;
    var found = false;

    for (var i = 0; i < NUM_DOUGHNUT; ++i) {
        if (doughnut[i].tower == tower) {
            found = true;
            if (doughnut[i].size < min) {
                min = doughnut[i].size;
                minDoghnut = doughnut[i];
            }
        }
    }

    return minDoghnut;
}

function numDoughnuts(tower) {
    var c = 0;

    for (var i = 0; i < NUM_DOUGHNUT; ++i) {
        if (doughnut[i].tower == tower) {
            c++;
        }
    }
    return c;
}
