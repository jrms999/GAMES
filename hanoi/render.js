var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var TOWER_WIDTH = 5;
var MARGIN_HORIZONTAL = 0;
var DOUGHNUT_HEIGHT = 30;
var W = 600, H = 600; 
var TOWER_DISTANCE = (W - 2 * MARGIN_HORIZONTAL) / (NUM_TOWERS + 1);

function render() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < NUM_TOWERS; ++i) {
        renderTower(i);
    }
    for (var i = 0; i < NUM_DOUGHNUT; ++i) {
        renderDoughnut(doughnut[i]);
    }
}

function towerX(i) {
    return MARGIN_HORIZONTAL + TOWER_DISTANCE * (i + 1);
}

function renderTower(i) {
    // assert(i < NUM_TOWERS);
    var x = towerX(i); 
    
    ctx.beginPath();
    ctx.lineWidth = TOWER_WIDTH;
    ctx.moveTo(x, H);
    ctx.lineTo(x, H / 2);
    ctx.stroke();
}

function renderDoughnut(doughnut) {
    var x = towerX(doughnut.tower) + doughnut.dx;
    var y = H - doughnut.below * DOUGHNUT_HEIGHT + doughnut.dy;

    doughnutWidth = 25 * (doughnut.size + 1);
    ctx.beginPath();
    ctx.moveTo(x - doughnutWidth / 2, y);
    ctx.lineTo(x + doughnutWidth / 2, y);
    ctx.lineTo(x + doughnutWidth / 2, y - DOUGHNUT_HEIGHT);
    ctx.lineTo(x - doughnutWidth / 2, y - DOUGHNUT_HEIGHT);
    ctx.closePath();
    ctx.fillStyle = doughnut.color;
    ctx.fill();
}

function towerHitTest(x, y) {
    var min = W, mini = 0;

    for (var i = 0; i < NUM_TOWERS; ++i) {
        var m = Math.abs(towerX(i) - x);

        if (m < min) {
            min = m;
            mini = i;
        }
    }

    return mini;
}
