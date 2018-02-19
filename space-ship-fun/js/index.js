var $ship = $('#ship'),
    posX,
    posY,
    shipSpeed = 1900,
    bulletType = 1,
    bulletSpeed = 350,
    fireRate = 150,
    keys = {},
    prevGameTime = new Date().getTime();

addDust(20);

$(window)
  .keydown(function(e) { keys[e.which] = true; })
  .keyup(function(e) { keys[e.which] = false; })
  .on('keydown', function(event) {
    
    if (keys[84]) { // t = toggle controls
      $('#controls').toggleClass("open");
    }
  
    if (keys[32]) { // space = fire
      var gameTime = new Date().getTime();
      if ((gameTime - prevGameTime) > fireRate) {
        shoot();
        prevGameTime = gameTime;
      }
    }
    
    if (keys[68]) { // d = wings
      $ship.toggleClass("closed");
      if ($ship.hasClass("closed")) {
        changeSpeed(1500);
      }
      else {
        changeSpeed();
      }
    }
  
    if (keys[70]) { // f = boost
      if (!$ship.hasClass("closed")) {
        $ship.addClass("boost");
        changeSpeed(1000);
        setTimeout(function() {
          $ship.removeClass("boost");
          changeSpeed();
        }, 2000);
      }
    }
  
    if (keys[83]) { // s = next weapon
      changeBullet();
    }
    if (keys[49]) { // weapon 1
      changeBullet(1);
    }
    if (keys[50]) { // weapon 2
      changeBullet(2);
    }
    if (keys[51]) { // weapon 3
      changeBullet(3);
    }
    if (keys[52]) { // weapon 4
      changeBullet(4);
    }
    if (keys[53]) { // weapon 5
      changeBullet(5);
    }
    if (keys[54]) { // weapon 6
      changeBullet(6);
    }
    if (keys[55]) { // weapon 7
      changeBullet(7);
    }
    if (keys[56]) { // weapon 8
      changeBullet(8);
    }
    if (keys[57]) { // weapon 9
      changeBullet(9);
    }
  })
  .on('mousemove', function(event) {
    posX = (event.clientX),
    posY = (event.clientY - ($ship.height() / 2));
    $ship.css({
      left: posX,
      top: posY
    });
  })
;

function changeBullet(x) {
  if (x) {
    bulletType = x;
  }
  else {
    if (bulletType < 9) {
      bulletType += 1;
    }
  }
  switch (bulletType) {
    case 1: 
      fireRate = 350;
      break;
    case 2:
      fireRate = 300;
      break;
    case 3:
      fireRate = 200;
      break;
    case 4:
      fireRate = 150;
      break;
    case 5:
      fireRate = 150;
      break;
    case 6:
      fireRate = 125;
      break;
    case 7:
      fireRate = 300;
      break;
    case 8:
      fireRate = 200;
      break;
    case 9:
      fireRate = 10;
      break;
    default:
      fireRate = 350;
      break;
  }
}

function shoot() {
  var $bullet = $('<div class="bullet type' + bulletType + '"></div>');
  $bullet.appendTo($('#environment'));
  $bullet
    .css({
      left: posX - ($bullet.width() / 2),
      top: posY
    })
    .animate({
      top: 0
    }, bulletSpeed)
  ;
  setTimeout(function(event) {
    $bullet.remove();
  }, bulletSpeed);
}

function addDust(x) {
  for (i = 0; i <= x; i++) {
    var $particle = $('<div class="dust"></div>'),
        pos = Math.floor(Math.random() * $(window).width()),
        delay = Math.random() * 2000;
    console.log(delay);
    $particle
      .css({
        animationDelay: delay + "ms",
        animationDuration: shipSpeed,
        left: pos
      })
      .appendTo('#environment');
    ;
    changeSpeed();
  }
}

function changeSpeed(x) {
  shipSpeed = "1900ms";
  if (x) {
    shipSpeed = x + "ms";
  }
  $('div.dust').css({
    animationDuration: shipSpeed
  });
}