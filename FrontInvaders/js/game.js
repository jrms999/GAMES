"use strict";
var GAME = {};

GAME.Init = function() {
	Mibbu.init().hitsOff(); /* my own collision detection, see utils.js for details */
	var preload = {};
	preload.player = new Mibbu.spr('img/player.png', 40, 40, 0, 1),
	preload.enemy = new Mibbu.spr('img/enemies.png', 30, 30, 1, 2),
	preload.explosion = new Mibbu.spr('img/explosion.png', 30, 30, 0, 3),
	preload.background = new Mibbu.bg('img/bg.jpg', 6, 90, {x:0,y:0});

	GAME.keyboard = new GAME.Input();
	GAME.$id('menu-start').onclick = function() { GAME.Menu('game', preload); };
	GAME.$id('menu-howto').onclick = function() { GAME.Menu('instructions'); };
	GAME.$id('menu-about').onclick = function() { GAME.Menu('about'); };
	GAME.Utils.LinkBackToMenu('howTo');
	GAME.Utils.LinkBackToMenu('about');
	
	GAME.$id('container').style.width = GAME_WIDTH;
	GAME.$id('container').style.height = GAME_HEIGHT;
};

GAME.Menu = function(id, preload) {
	switch(id) {
		case 'game': {
			GAME.$id('game').style.zIndex = '20';
			GAME.$id('statbar').style.zIndex = '21';
			GAME.Start(preload);
			break;
		}
		case 'instructions': {
			GAME.$id('howTo').style.zIndex = '20';
			break;
		}
		case 'about': {
			GAME.$id('about').style.zIndex = '20';
			break;
		}
		default: {;}
	}
};

GAME.Start = function(preload) {
	window.focus();
	GAME.player = preload.player;
	GAME.background = preload.background;
	GAME.enemy = preload.enemy;
	GAME.explosion = preload.explosion;

	GAME.background.width = GAME_WIDTH;
	GAME.background.height = GAME_HEIGHT;
	GAME.player.width = 40;
	GAME.player.height = 40;
	GAME.enemy.width = 30;
	GAME.enemy.height = 30;
	GAME.explosion.width = 30;
	GAME.explosion.height = 30;

	GAME.background.speed(0).dir(90).on();
	GAME.explosion.position(-GAME.explosion.width,-GAME.explosion.height, 1).speed(0);
	GAME.enemy.position(-GAME.enemy.width, -GAME.enemy.height, 4).speed(0);

	GAME.enemy.dirX = 7;
	GAME.enemy.dirY = 0;

	GAME.state = {};
	GAME.state.frameCount = 0;
	GAME.state.level = 1;
	GAME.state.points = 0;
	GAME.state.borderTop = 80;
	GAME.state.borderBottom = 15;
	GAME.state.lang = 'en';

	GAME.player.lives = 3;
	GAME.player.hit = true;

	GAME.BULLETS = [];
	GAME.ENEMIES = [];
	GAME.Config.active = true;
	GAME.Config.pointsDiff = [50,70,100];
	GAME.Config.types = [
		[0],
		[0],
		[0,0],
		[0,0],
		[1,0,0],
		[1,0,0],
		[1,1,0,0],
		[1,1,0,0],
		[2,1,1,0,0],
		[2,1,1,0,0],
		[2,2,1,1,0,0],
		[2,2,1,1,0,0]
	];

	GAME.enemy.speed = 30;
	GAME.inactive = {};
	GAME.inactive.BULLETS = [];
	for(var b = 0; b<GAME.Config.bulletLimit; b++) {
		GAME.inactive.BULLETS[b] = GAME.Utils.NewBullet();
	}
	GAME.inactive.ENEMIES = [];
	GAME.Utils.NewLevel();
	Mibbu.on();

	var gameLoop = function(){
		GAME.state.frameCount++;
		GAME.keyboard.frame();

		if(GAME.BULLETS.length) {
			for(var b=0; b<GAME.BULLETS.length; b++) {
				var newY = GAME.BULLETS[b].position().y - GAME.Config.bulletSpeed;
				if(newY <= 40) {
					GAME.BULLETS[b].top = -50;
					GAME.BULLETS[b].left = -50;
					GAME.BULLETS[b].position(-50,-50);
					GAME.inactive.BULLETS.push(GAME.BULLETS[b]);
					GAME.BULLETS.splice(b,1);
				}
				else {
					GAME.BULLETS[b].top = newY;
					GAME.BULLETS[b].position(GAME.BULLETS[b].position().x, newY);
				}
			}
		}

		/* enemy movement */
		if(!(GAME.state.frameCount % GAME.enemy.speed)){
			var offScreenRight = false,
				offScreenLeft = false;
			for(var i = 0; i < GAME.ENEMIES.length; i++) {
			if(GAME.Config.active) {
				if(GAME.ENEMIES[i].position().x > GAME.background.width-2*GAME.enemy.width) {
					offScreenRight = true;
				}
				if(GAME.ENEMIES[i].position().x < GAME.enemy.width) {
					offScreenLeft = true;
				}
				var enemyBottomPosition = GAME.ENEMIES[i].top+GAME.ENEMIES[i].height;
				if(enemyBottomPosition > GAME.enemy.deadline) {
					GAME.enemy.deadline = enemyBottomPosition;
				}
				if(GAME.enemy.deadline >= GAME.player.position().y+(GAME.enemy.height/3)) {
					GAME.Config.active = false;
					Mibbu.off();
					GAME.Utils.RemoveLife();
				}
			}
			}
			if(offScreenLeft || offScreenRight) {
				GAME.enemy.dirX = -GAME.enemy.dirX;
				GAME.enemy.dirY += 15;
			}
			for(var i = 0; i < GAME.ENEMIES.length; i++) {
				GAME.ENEMIES[i].position(GAME.ENEMIES[i].position().x += GAME.enemy.dirX,
					GAME.ENEMIES[i].position().y += GAME.enemy.dirY);
				GAME.ENEMIES[i].left += GAME.enemy.dirX;
				GAME.ENEMIES[i].top += GAME.enemy.dirY;
			}
			GAME.enemy.dirY = 0;
		}
	}
	Mibbu.hook(gameLoop);
	Mibbu.hook(GAME.CollisionDetection.CheckAll);
};