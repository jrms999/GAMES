/*
	fix for lacking of .bind in Opera, Safari and some IEs
	https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
*/
if (!Function.prototype.bind) {  
	Function.prototype.bind = function (oThis) {  
	if (typeof this !== "function") {  
		// closest thing possible to the ECMAScript 5 internal IsCallable function  
		throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");  
	}  
	var fSlice = Array.prototype.slice,  
		aArgs = fSlice.call(arguments, 1),   
		fToBind = this,   
		fNOP = function () {},  
		fBound = function () {  
		return fToBind.apply(this instanceof fNOP  
			? this  
			: oThis || window,  
			aArgs.concat(fSlice.call(arguments)));  
		};
		fNOP.prototype = this.prototype;  
		fBound.prototype = new fNOP();  
		return fBound;  
	};  
};

GAME.Utils = {};
GAME.$id = function(id) { return document.getElementById(id); };

GAME.Utils.Alert = function(title, message, id) {
	var div = GAME.$id('message'),
		idHTML = '';
	if(title) { // show
		if(id) idHTML = '<span id="box-'+id+'"></span>';
		div.style.zIndex = '20';
		div.innerHTML = '<div class="box"><div><h4>'+title+'</h4><p>'+message+'</p>'+
			idHTML+'</div></div><div class="shadow"></div>';
	}
	else { // hide
		div.style.zIndex = '5';
	}
};

GAME.Utils.NewBullet = function() {
	var newBullet = new Mibbu.spr('img/bullet.png', 2, 4, 0, 0);
	newBullet.width = 2;
	newBullet.height = 4;
	newBullet.hit = false;
	newBullet.speed(0);
	newBullet.position(-50, -50, 2);
	return newBullet;
};

GAME.Utils.ActivateBullet = function() {
	var bullet = GAME.inactive.BULLETS.shift();
	var posX = GAME.player.position().x + parseInt(GAME.player.width/2)-1,
		posY = GAME.player.position().y;
	bullet.left = posX;
	bullet.top = posY;
	bullet.position(posX, posY, 2).speed(0);
	bullet.hit = true;
	GAME.state.points -= 10;
	GAME.$id('points').innerHTML = GAME.state.points;
	for(var e=0; e<GAME.ENEMIES.length; e++) {
		GAME.CollisionDetection.Add(bullet, GAME.ENEMIES[e]);
	}
	return bullet;
};

GAME.Utils.NewEnemy = function() {
	var newEnemy = new Mibbu.spr('img/enemies.png', GAME.enemy.width, GAME.enemy.height, 1, 2);
	newEnemy.position(-150, -150, 2);
	newEnemy.movement = 0;
	newEnemy.hit = false;
	newEnemy.width = GAME.enemy.width;
	newEnemy.height = GAME.enemy.height;
	return newEnemy;
};

GAME.Utils.ActivateEnemy = function(posX, posY, type) {
	var enemy = GAME.inactive.ENEMIES.shift();
	enemy.change('img/enemies.png', GAME.enemy.width, GAME.enemy.height, 1, 2);
	enemy.animation(type);
	enemy.speed(GAME.enemy.speed);
	enemy.type = type;
	enemy.left = posX;
	enemy.top = posY;
	enemy.position(posX, posY, 2);
	enemy.hit = true;
	return enemy;
}

GAME.Utils.LinkBackToMenu = function(id) {
	GAME.$id(id).onclick = function() {
		GAME.$id(id).style.zIndex = '5';
	};
};

GAME.Utils.NewLevel = function() {
	GAME.enemy.deadline = 0;
	var diff = parseInt((GAME.background.width-(GAME.Config.enemyWidth*(GAME.enemy.width+10)))/2),
		enemyCounter = 0;

	GAME.player.position(~~((GAME.background.width-GAME.player.width)/2),
		GAME.background.height-GAME.player.height-GAME.state.borderBottom, 5).speed(0);
	if(GAME.BULLETS.length) {
		for(var i=0; i<GAME.BULLETS.length; i++) {
			GAME.BULLETS[i].top = -50;
			GAME.BULLETS[i].left = -50;
			GAME.BULLETS[i].position(-50,-50);
			GAME.inactive.BULLETS.push(GAME.BULLETS[i]);
		}
		GAME.BULLETS = [];
	}
	if(GAME.ENEMIES.length) {
		for(var i=0; i<GAME.ENEMIES.length; i++) {
			GAME.ENEMIES[i].top = -150;
			GAME.ENEMIES[i].left = -150;
			GAME.ENEMIES[i].position(-150,-150);
			GAME.inactive.ENEMIES.push(GAME.ENEMIES[i]);
		}
	}
	GAME.ENEMIES = [];

	var type = (GAME.state.level < 12) ? GAME.state.level-1 : 11;
	var enemyHeight = GAME.Config.types[type].length;
	var enemyCount = enemyHeight*GAME.Config.enemyWidth;
	if(enemyCount > GAME.inactive.ENEMIES.length) {
		var enemyDiff = enemyCount-GAME.inactive.ENEMIES.length;
		for(var e = 0; e<enemyDiff; e++) {
			GAME.inactive.ENEMIES.push(GAME.Utils.NewEnemy());
		}
	}
	for(var i = 0; i < GAME.Config.types[type].length; i++) {
		for(var j = 0; j < GAME.Config.enemyWidth; j++) {
			var posX = j*(GAME.enemy.width+10)+diff,
				posY = i*(GAME.enemy.height+10)+GAME.state.borderTop,
				animationType = GAME.Config.types[type][i];
			GAME.ENEMIES[enemyCounter] = GAME.Utils.ActivateEnemy(posX, posY, animationType);
			enemyCounter++;
		}
	}
	GAME.$id('level').innerHTML = GAME.state.level;
	if(GAME.state.level < 12)
		GAME.enemy.speed -= 2;
};

GAME.Utils.RemoveLife = function() {
	GAME.player.lives--;
	if(!GAME.player.lives) { // game over
		GAME.$id('lives').innerHTML = '';
		var winText = GAME.Lang[GAME.state.lang].winText;
		var winTextWithScore = winText.replace(/sss/gi,GAME.state.points);
		GAME.Utils.Alert(GAME.Lang[GAME.state.lang].winTitle, winTextWithScore, 'winner');
		GAME.keyboard = null;
	}
	else {
		var livesHTML = '';
		for(var l=0; l<GAME.player.lives; l++) {
			livesHTML += '<li>|</li>';
		}
		GAME.$id('lives').innerHTML = livesHTML;
		GAME.Utils.Alert(GAME.Lang[GAME.state.lang].killedTitle,GAME.Lang[GAME.state.lang].killedText,'killed');
		GAME.Utils.NewLevel();
	}
};

/* Collision Detection */
GAME.CollisionDetection = function() {};
GAME.CollisionDetection.table = [];

GAME.CollisionDetection.Add = function(obj1, obj2) {
	GAME.CollisionDetection.table.push({obj1:obj1, obj2:obj2});
};
GAME.CollisionDetection.CheckAll = function() {
	var t = GAME.CollisionDetection.table;
	if(t && t.length) {
		for (var i=0; i<t.length; i++) {
			var obj1 = t[i].obj1,
				obj2 = t[i].obj2,
				fn = t[i].fn;
			var o1_Top = obj1.top,
				o1_Bottom = obj1.top+obj1.height,
				o1_Left = obj1.left,
				o1_Right = obj1.left+obj1.width,
				o2_Top = obj2.top,
				o2_Bottom = obj2.top+obj2.height,
				o2_Left = obj2.left,
				o2_Right = obj2.left+obj2.width;

			if( !( (o1_Top <= o2_Top) || (o1_Bottom >= o2_Bottom)
				|| (o1_Left <= o2_Left) || (o1_Right >= o2_Right) ) && obj1.hit && obj2.hit ) {
				for(var i=0; i<GAME.BULLETS.length; i++) {
					if(GAME.BULLETS[i].id() == obj1.id()) {
						GAME.BULLETS[i].top = -50;
						GAME.BULLETS[i].left = -50;
						GAME.BULLETS[i].position(-50,-50);
						GAME.inactive.BULLETS.push(GAME.BULLETS[i]);
						GAME.BULLETS.splice(i,1);
					}
				}
				var enemyTab = [];
				for(var i=0; i<GAME.ENEMIES.length; i++) {
					if(GAME.ENEMIES[i].id() == obj2.id()) {
						var enemy = GAME.ENEMIES[i];
						enemy.change('img/explosion.png', 30, 30, 0, 3);
						enemy.speed(5).animation(0).frame(0).zone(30,30,0,0);
						enemy.hit = false;
						GAME.inactive.ENEMIES.push(enemy);
						GAME.state.points += GAME.Config.pointsDiff[enemy.type];
						GAME.$id('points').innerHTML = GAME.state.points;
						enemy.callback(function(){
							enemy.top = -enemy.height;
							enemy.position(enemy.position().x,enemy.top);
							enemy.callback(function(){},1000);
							if(!GAME.ENEMIES.length) {
								GAME.state.level += 1;
								GAME.Utils.NewLevel();
								if(GAME.state.level == 10) {
									var anim = GAME.player.animation();
									GAME.player.animation((anim += 1) % 2);
									GAME.Utils.Alert(GAME.Lang[GAME.state.lang].unlockedTitle, GAME.Lang[GAME.state.lang].unlockedText, 'newrocket');
								}
								else {
									GAME.Utils.Alert(GAME.Lang[GAME.state.lang].nextLevelTitle, GAME.Lang[GAME.state.lang].nextLevelText, 'nextlevel');
								}
								GAME.Config.active = false;
								Mibbu.off();
							}
						}, 1);
						GAME.ENEMIES[i] = enemy;
					}
					else {
						enemyTab.push(GAME.ENEMIES[i]);
					}
				}
				GAME.ENEMIES = enemyTab;
			}
		}
	}
};