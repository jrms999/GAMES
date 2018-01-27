(function (kar, window, undefined) {
    'use strict';

    // Private variables:
    var $car = $('.car'),
        arrowKeysPressed = {},
        arrowKey = {
            up: 38,
            right: 39,
            down: 40,
            left: 37
        },
        carState = {
            idle: 0,
            driving: 1,
            up: 2,
            down: 4,
            left: 8,
            right: 16,
            lightsOn: 32
        },
        currentCarState = carState.idle,
        nextCarState,
        carPosition = {
            top: 0,
            left: 0
        },
        carPositionChange = {
            top: 0,
            left: 0
        },
        positionIncrement = 6;
    
    // Events:
    $(document).on('keydown', function (e) {
        if (isArrowKey(e.which))
            arrowKeysPressed[e.which] = true;
    });

    $(document).on('keyup', function (e) {
        if (isArrowKey(e.which))
            arrowKeysPressed[e.which] = false;
    });

    $(document).on('keypress', function (e) {
        if (e.which == 108 || e.which == 76) // l or L
            if (currentCarState & carState.lightsOn)
                currentCarState &= ~carState.lightsOn;
            else
                currentCarState |= carState.lightsOn;
    });

    // Private Methods:
    function isArrowKey(code) {
        return code == arrowKey.up || code == arrowKey.right || code == arrowKey.down || code == arrowKey.left;
    }

    function numberOfArrowKeysPressed() {
        var total = 0;
        for (var i in arrowKeysPressed)
            if (arrowKeysPressed[i])
                total++;
        return total;
    }

    function update() {
        var pressed = numberOfArrowKeysPressed();
        nextCarState = currentCarState;
        carPositionChange.top = 0;
        carPositionChange.left = 0;

        if (pressed <= 2 && pressed > 0) {
            nextCarState |= carState.driving;
            for (var i in arrowKeysPressed) {
                var value = arrowKeysPressed[i];
                switch (i * 1) {
                    case arrowKey.left:
                        if (value) {
                            nextCarState |= carState.left;
                            carPositionChange.left -= positionIncrement;
                        }
                        else
                            nextCarState &= ~carState.left;
                        break;
                    case arrowKey.right:
                        if (value) {
                            nextCarState |= carState.right;
                            carPositionChange.left += positionIncrement;
                        }
                        else
                            nextCarState &= ~carState.right;
                        break;
                    case arrowKey.up:
                        if (value) {
                            nextCarState |= carState.up;
                            carPositionChange.top -= positionIncrement;
                        }
                        else
                            nextCarState &= ~carState.up;
                        break;
                    case arrowKey.down:
                        if (value) {
                            nextCarState |= carState.down;
                            carPositionChange.top += positionIncrement;
                        }
                        else
                            nextCarState &= ~carState.down;
                        break;
                }
            }
        }
        else {
            nextCarState &= ~carState.driving;
        }

        if (carPositionChange.top) {
            // if top has changed, check if change is valid
        }

        if (carPositionChange.left) {
            // if left has changed, check if change is valid
        }
    }

    function render() {
        //if (nextCarState != currentCarState) {
            currentCarState = nextCarState;

            if (currentCarState & carState.driving) {
                $car.addClass('driving');

                if(carPositionChange.left)
                    $car.css('left', $car.position().left + carPositionChange.left);

                if(carPositionChange.top)
                    $car.css('top', $car.position().top + 9.5 + carPositionChange.top);

            } else {
                $car.removeClass('driving');
                $('.control').not('.lights').removeClass('active');
            }

            if (currentCarState & carState.lightsOn) {
                $car.addClass('lights-on');
                $('.control.lights').addClass('active');
                $('.world').addClass('dark');
            } else {
                $car.removeClass('lights-on');
                $('.control.lights').removeClass('active');
                $('.world').removeClass('dark');
            }

            if (currentCarState & carState.left) {
                $car.addClass('left');
                $('.control.left').addClass('active');
            } else {
                $car.removeClass('left');
                $('.control.left').removeClass('active');
            }

            if (currentCarState & carState.right) {
                $car.addClass('right');
                $('.control.right').addClass('active');
            } else {
                $car.removeClass('right');
                $('.control.right').removeClass('active');
            }

            if (currentCarState & carState.up) {
                $car.addClass('up');
                $('.control.up').addClass('active');
            } else {
                $car.removeClass('up');
                $('.control.up').removeClass('active');
            }

            if (currentCarState & carState.down) {
                $car.addClass('down');
                $('.control.down').addClass('active');
            } else {
                $car.removeClass('down');
                $('.control.down').removeClass('active');
            }
        //}

        $('.status .state').text('Car State: ' + currentCarState);
    };

    // Game loop:
    window.animate = (function () {
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
              window.setTimeout(callback, 1000 / 60);
          };
    })();

    (function loop() {
        animate(loop);
        update();
        render();
    })();

})(window.kar = window.kar || {}, window);