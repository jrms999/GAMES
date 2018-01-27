(function controller() {
    var mousedown = false;
    var activeDoghnut = null;
    var mouseBeginX, mouseBeginY;

    canvas.onmousedown = function(e) {
        var x = e.clientX, y = e.clientY;

        mouseBeginX = x;
        mouseBeginY = y;

        mousedown = true;

        var tower = towerHitTest(x, y);
        var min = NUM_DOUGHNUT;

        activeDoghnut = smallestDoughnut(tower);
    };

    canvas.onmouseup = function(e) {
        var x = e.clientX, y = e.clientY;
        mousedown = false;

        if (activeDoghnut != null) {
            var oldTower = activeDoghnut.tower;
            var newTower = towerHitTest(x, y);

            activeDoghnut.tower = -1;
            activeDoghnut.below = numDoughnuts(newTower);
            activeDoghnut.tower = newTower;
            activeDoghnut.dx = activeDoghnut.dy = 0;
        }
        activeDoghnut = null;
    };

    canvas.onmousemove = function(e) {
        var x = e.clientX, y = e.clientY;
        var dx = x - mouseBeginX, dy = y - mouseBeginY;

        if (activeDoghnut != null) {
            activeDoghnut.dx = dx;
            activeDoghnut.dy = dy;
        }
    };

    init();
})();
