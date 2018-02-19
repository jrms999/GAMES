GAME.Config = {
	input: {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		SHOOT: 90, /* Z */
		PAUSE: 32, /* spacebar */
		START: 13, /* enter */
		CHANGE: 67 /* C */
	},

	active: false,
	level: 0,
	moveInterval: 3,
	bulletSpeed: 6,
	bulletLimit: 7,
	enemyWidth: 12,
	enemyHeight: 5,
	pointsDiff: 100
};

GAME.Lang = [];
GAME.Lang['pl'] = { /* maybe later */ };
GAME.Lang['en'] = {
	pausedTitle: "PAUSED",
	pausedText: "Press <strong>spacebar</strong> again to get back to the game!<br />You can also return to the <a href=''>main menu</a>.",
	nextLevelTitle: "NEXT LEVEL",
	nextLevelText: "Congratulations, You've killed all of the aliens!<br />Press <strong>spacebar</strong> to continue!",
	killedTitle: "PLAYER KILLED",
	killedText: "You were killed by the aliens!<br />Press <strong>spacebar</strong> to repeat the level!",
	unlockedTitle: "NEW ROCKET",
	unlockedText: "You've reached level 10 and unlocked new rocket!<br />Press <strong>spacebar</strong> to continue!",
	winTitle: "CONGRATULATIONS",
	winText: "You've scored <strong>sss</strong> points! You're awesome!<br />You can <a href=''>try again</a> or share Your score on <strong><a href='http://twitter.com/intent/tweet?text=I%20saved%20the%20world%20by%20killing%20evil%20explorers%20in%20this%20HTML5%20game,%20Front%20Invaders,%20and%20scored%20sss%20points!%20Try%20it%20too%20http://end3r.com/games/frontinvaders/'>Twitter</a></strong>!"
};