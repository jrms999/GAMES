function Application(canvas) {
    this._canvas = canvas;
    this._canvas.focus();
    this._context = canvas.getContext("2d");
    this._context.fillStyle = "#00ffff";
    this._context.fillRect(0, 2 * 2, 320 * 2, 4 * 2);
    this._context.fillRect(0, 26 * 2, 320 * 2, 4 * 2);
    this._context.fillStyle = "#920205";
    this._context.fillRect(0, 8 * 2, 320 * 2, 16 * 2);
    this._soundPlayer = new SoundPlayer();
    this._soundPlayer.load("diamond", resourceMap["diamond.wav"]);
    this._soundPlayer.load("stone", resourceMap["stone.wav"]);
    this._soundPlayer.load("step", resourceMap["step.wav"]);
    var self = this;
    var count = 2; 
    function onload() {
        if (--count == 0) {
            self.start();
        }
    }
    this._fontImage = new Image();
    this._spriteImage = new Image();
    this._fontImage.onload = onload;
    this._spriteImage.onload = onload;
    this._fontImage.src = 'data:image/gif;base64,' + resourceMap["font.gif"];
    this._spriteImage.src = 'data:image/gif;base64,' + resourceMap["sprite.gif"];
};
Application.prototype.start = function () {
    var self = this;
    this.drawText(0, 8, "  ROOM:     TIME:        DIAMONDS:      ");
    this.drawText(0, 16, "  LIVES:    SCORE:       COLLECTED:     ");
    this._screen = [];
    for (var x = 0; x < 20; x++) {
        this._screen[x] = [];
        for (var y = 0; y < 14; y++) {
            this._screen[x][y] = 0;
        }
    }
    this._mouseDownHandler = function (e) { self.mouseDown(e); };
    this._touchStartHandler = function (e) { self.touchStart(e); };
    this._touchEndHandler = function (e) { self.touchEnd(e); };
    this._touchMoveHandler = function (e) { self.touchMove(e); };
    this._keyDownHandler = function (e) { self.keyDown(e); };
    this._keyUpHandler = function (e) { self.keyUp(e); };
    this._canvas.addEventListener("touchstart", this._touchStartHandler, false);
    this._canvas.addEventListener("touchmove", this._touchMoveHandler, false);
    this._canvas.addEventListener("touchend", this._touchEndHandler, false);
    this._canvas.addEventListener("mousedown", this._mouseDownHandler, false);
    document.addEventListener("keydown", this._keyDownHandler, false);
    document.addEventListener("keyup", this._keyUpHandler, false);
    this._blink = 0;
    this.reset();
    window.setInterval(function () { return self.interval(); }, 50);
};
Application.prototype.addKey = function (key) {
    if (key < 4) {
        this._keys[key] = true;
    }
    else if (key == Key.reset) {
        this._lives--;
        if (this._lives >= 0) {
            this.loadLevel();
        }
        else {
            this.reset();
        }
    }
};
Application.prototype.removeKey = function (key) {
    if (key < 4) {
        this._keysRelease[key] = true;
    }
};
Application.prototype.reset = function () {
    this._lives = 20;
    this._score = 0;
    this._room = 0;
    this.loadLevel();
};
Application.prototype.loadLevel = function () {
    this._level = new Level(levelData[this._room]);
    this._keys = [false, false, false, false];
    this._keysRelease = [false, false, false, false];
    this._tick = 0;
    this.paint();
};
Application.prototype.nextLevel = function () {
    if (this._room < (levelData.length - 1)) {
        this._room++;
        this.loadLevel();
    }
};
Application.prototype.isPlayerAlive = function () {
    return (this._level === null) || (this._level.isPlayerAlive());
};
Application.prototype.interval = function () {
    this._tick++;
    this._blink++;
    if (this._blink == 6) {
        this._blink = 0;
    }
    if ((this._tick % 2) === 0) {
        // keyboard
        for (var i = 0; i < 4; i++) {
            if (this._keysRelease[i]) {
                this._keys[i] = false;
                this._keysRelease[i] = false;
            }
        }
        this._level.update();
        if (this._level.movePlayer(this._keys)) {
            this.nextLevel();
        }
        else {
            this._level.move();
            // play sound
            var soundTable = ["diamond", "stone", "step"];
            for (var i = 0; i < soundTable.length; i++) {
                if (this._level.playSound(i) && this._soundPlayer.play(soundTable[i])) {
                    break;
                }
            }
        }
    }
    this._score += this._level.score;
    this._level.score = 0;
    this.paint();
};
Application.prototype.paint = function () {
    var blink = ((this._blink + 4) % 6);
    // update statusbar
    this._context.fillStyle = "#920205";
    this.drawText(9 * 8, 8, this.formatNumber(this._room + 1, 2));
    this.drawText(9 * 8, 16, this.formatNumber(this._lives, 2));
    this.drawText(19 * 8, 16, this.formatNumber(this._score, 5));
    this.drawText(19 * 8, 8, this.formatNumber(this._level.time, 5));
    this.drawText(36 * 8, 8, this.formatNumber(this._level.diamonds, 2));
    this.drawText(36 * 8, 16, this.formatNumber(this._level.collected, 2));
    // paint sprites
    for (var x = 0; x < 20; x++) {
        for (var y = 0; y < 14; y++) {
            var spriteIndex = this._level.getSpriteIndex(x, y, blink);
            if (this._screen[x][y] != spriteIndex) {
                this._screen[x][y] = spriteIndex;
                this._context.drawImage(this._spriteImage, spriteIndex * 16 * 2, 0, 16 * 2, 16 * 2, x * 16 * 2, y * (16 * 2) + (32 * 2), 16 * 2, 16 * 2);
            }
        }
    }
};
Application.prototype.drawText = function (x, y, text) {
    for (var i = 0; i < text.length; i++) {
        var index = text.charCodeAt(i) - 32;
        this._context.fillRect(x * 2, y * 2, 8 * 2, 8 * 2);
        this._context.drawImage(this._fontImage, 0, index * 8 * 2, 8 * 2, 8 * 2, x * 2, y * 2, 8 * 2, 8 * 2);
        x += 8;
    }
};
Application.prototype.formatNumber = function (value, digits) {
    var text = value.toString();
    while (text.length < digits) {
        text = "0" + text;
    }
    return text;
};
Application.prototype.keyDown = function (e) {
    if (!e.ctrlKey && !e.altKey && !e.altKey && !e.metaKey) {
        var keyMap = { "37": Key.left, "39": Key.right, "38": Key.up, "40": Key.down, "27": Key.reset };
        if (e.keyCode in keyMap) {
            this.stopEvent(e);
            this.addKey(keyMap[e.keyCode]);
        }
        else if (e.keyCode == 8 || e.keyCode == 36) {
            this.stopEvent(e);
            this.nextLevel();
        }
        else if (!this.isPlayerAlive()) {
            this.stopEvent(e);
            this.addKey(Key.reset);
        }
    }
};
Application.prototype.keyUp = function (e) {
    var keyMap = { "37": Key.left, "39": Key.right, "38": Key.up, "40": Key.down };
    if (e.keyCode in keyMap) {
        this.stopEvent(e);
        this.removeKey(keyMap[e.keyCode]);
    }
};
Application.prototype.mouseDown = function (e) {
    e.preventDefault();
    this._canvas.focus();
};
Application.prototype.touchStart = function (e) {
    e.preventDefault();
    if (e.touches.length > 3) {
        this.nextLevel();
    }
    else if ((e.touches.length > 2) || (!this.isPlayerAlive())) {
        this.addKey(Key.reset);
    }
    else {
        for (var i = 0; i < e.touches.length; i++) {
            this._touchPosition = new Position(e.touches[i].pageX, e.touches[i].pageY);
        }
    }
};
Application.prototype.touchMove = function (e) {
    e.preventDefault();
    for (var i = 0; i < e.touches.length; i++) {
        if (this._touchPosition !== null) {
            var x = e.touches[i].pageX;
            var y = e.touches[i].pageY;
            var direction = null;
            if ((this._touchPosition.x - x) > 20) {
                direction = Key.left;
            }
            else if ((this._touchPosition.x - x) < -20) {
                direction = Key.right;
            }
            else if ((this._touchPosition.y - y) > 20) {
                direction = Key.up;
            }
            else if ((this._touchPosition.y - y) < -20) {
                direction = Key.down;
            }
            if (direction !== null) {
                this._touchPosition = new Position(x, y);
                for (var i = Key.left; i <= Key.down; i++) {
                    if (direction == i) {
                        this.addKey(i);
                    }
                    else {
                        this.removeKey(i);
                    }
                }
            }
        }
    }
};
Application.prototype.touchEnd = function (e) {
    e.preventDefault();
    this._touchPosition = null;
    this.removeKey(Key.left);
    this.removeKey(Key.right);
    this.removeKey(Key.up);
    this.removeKey(Key.down);
};
Application.prototype.stopEvent = function (e) {
    e.preventDefault();
    e.stopPropagation();
};

var Key = {
    "left": 0, "right": 1, "up": 2, "down": 3, "reset": 4
}

function Base64Reader(data) {
    this._alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    this._position = 0;
    this._bits = 0;
    this._bitsLength = 0;
    this._data = data;
};
Base64Reader.prototype.readByte = function () {
    if (this._bitsLength === 0) {
        var tailBits = 0;
        while (this._position < this._data.length && this._bitsLength < 24) {
            var ch = this._data.charAt(this._position++);
            var index = this._alphabet.indexOf(ch);
            if (index < 64) {
                this._bits = (this._bits << 6) | index;
            }
            else {
                this._bits <<= 6;
                tailBits += 6;
            }
            this._bitsLength += 6;
        }
        if (this._position >= this._data.length && this._bitsLength === 0) {
            return -1;
        }
        tailBits = (tailBits === 6) ? 8 : (tailBits === 12) ? 16 : tailBits;
        this._bits = this._bits >> tailBits;
        this._bitsLength -= tailBits;
    }
    this._bitsLength -= 8;
    return (this._bits >> this._bitsLength) & 0xff;
};

var Direction = { 
    "none": 0, "left": 1, "right": 2, "up": 3, "down": 4 
};

function Ghost(position, type, direction, lastTurn) {
    this.alive = true;
    this.position = position;
    this.type = type;
    this.direction = direction;
    this.lastTurn = lastTurn;
}
Ghost.prototype.getImageIndex = function () {
    return [4, 4, 5, 6, 3][this.direction];
};

var Sprite = {
    "nothing": 0, "stone": 1, "ground": 2, "ghost180": 3, "uvexit": 4, 
    "diamond": 5, "wall": 6, "ghost90L": 7, "marker": 8, "uvstone": 9, "player": 10,
    "ghost90LR": 11, "exit": 12, "buffer": 13, "changer": 14, "ghost90R": 15,
};

function Level(data) {
    this.collected = 0;
    this.time = 5000;
    this.score = 0;
    this._map = [];
    for (var x = 0; x < 20; x++) {
        this._map[x] = [];
    }
    var reader = new Base64Reader(data);
    for (var y = 0; y < 14; y++) {
        for (var x = 0; x < 10; x++) {
            var b = reader.readByte();
            this._map[x * 2 + 1][y] = b & 0x0f;
            this._map[x * 2][y] = b >> 4;
        }
    }
    for (var i = 0; i < 5; i++) {
        reader.readByte();
    }
    var position = new Position(reader.readByte(), reader.readByte() - 2);
    this._player = new Player(position);
    this._map[this._player.position.x][this._player.position.y] = Sprite.player;
    this.diamonds = reader.readByte();
    this.diamonds = (this.diamonds >> 4) * 10 + (this.diamonds & 0x0f);
    var ghostData = [];
    for (var i = 0; i < 8; i++) {
        ghostData.push(reader.readByte());
    }
    var index = 0;
    this._ghosts = [];
    for (var y = 0; y < 14; y++) {
        for (var x = 0; x < 20; x++) {
            if (this.isGhost(x, y)) {
                var info = index & 1 !== 0 ? (ghostData[index >> 1] & 0x0f) : (ghostData[index >> 1] >> 4);
                var direction = info < 4 ? [Direction.down, Direction.up, Direction.right, Direction.left][info] : Direction.none;
                var lastTurn = index & 1 !== 0 ? Direction.right : Direction.left;
                this._ghosts.push(new Ghost(new Position(x, y), this._map[x][y], direction, lastTurn));
                index++;
            }
        }
    }
};
Level.prototype.isPlayerAlive = function () {
    return this._player.alive;
};
Level.prototype.update = function () {
    // turn buffers into nothing
    for (var y = 13; y >= 0; y--) {
        for (var x = 19; x >= 0; x--) {
            if (this._map[x][y] === Sprite.buffer) {
                this._map[x][y] = Sprite.nothing;
            }
        }
    }
    // reset sound state
    this._soundTable = [false, false, false];
};
Level.prototype.playSound = function (sound) {
    return this._soundTable[sound];
};
Level.prototype.move = function () {
    // gravity for stones and diamonds
    for (var y = 13; y >= 0; y--) {
        for (var x = 19; x >= 0; x--) {
            if (this._map[x][y] === Sprite.stone || this._map[x][y] === Sprite.diamond || this._map[x][y] === Sprite.uvstone) {
                var dx = x;
                var dy = y;
                if (this._map[x][y + 1] === Sprite.nothing) {
                    dy = y + 1;
                }
                else {
                    if (this._map[x][y + 1] === Sprite.stone || this._map[x][y + 1] === Sprite.diamond) {
                        if (this._map[x - 1][y + 1] === Sprite.nothing && this._map[x - 1][y] === Sprite.nothing) {
                            dx = x - 1;
                            dy = y + 1;
                        }
                        else if (this._map[x + 1][y + 1] === Sprite.nothing && this._map[x + 1][y] === Sprite.nothing) {
                            dx = x + 1;
                            dy = y + 1;
                        }
                    }
                    if ((this._map[x][y + 1] === Sprite.changer) && ((this._map[x][y] === Sprite.stone) || (this._map[x][y] === Sprite.uvstone)) && (this._map[x][y + 2] === Sprite.nothing)) {
                        dy = y + 2;
                    }
                }
                if (dx != x || dy != y) {
                    this._map[dx][dy] = Sprite.marker;
                }
            }
        }
    }
    for (var y = 13; y >= 0; y--) {
        for (var x = 19; x >= 0; x--) {
            if (this._map[x][y] === Sprite.stone || this._map[x][y] === Sprite.diamond || this._map[x][y] === Sprite.uvstone) {
                var dx = x;
                var dy = y;
                if (this._map[x][y + 1] === Sprite.marker) {
                    dy = y + 1;
                }
                else {
                    if ((this._map[x][y + 1] === Sprite.stone) || (this._map[x][y + 1] === Sprite.diamond) || (this._map[x][y + 1] === Sprite.nothing)) {
                        if ((this._map[x - 1][y + 1] === Sprite.marker) && ((this._map[x - 1][y] === Sprite.nothing) || (this._map[x - 1][y] === Sprite.marker))) {
                            dx = x - 1;
                            dy = y + 1;
                        }
                        else if ((this._map[x + 1][y + 1] === Sprite.marker) && ((this._map[x + 1][y] === Sprite.nothing) || (this._map[x + 1][y] === Sprite.marker))) {
                            dx = x + 1;
                            dy = y + 1;
                        }
                    }
                    if ((this._map[x][y + 1] === Sprite.changer) && ((this._map[x][y] === Sprite.stone) || (this._map[x][y] === Sprite.uvstone)) && (this._map[x][y + 2] === Sprite.marker)) {
                        dy = y + 2;
                    }
                }
                if (dx != x || dy != y) {
                    if ((dy - y) === 2) {
                        this._map[dx][dy] = Sprite.diamond;
                    }
                    else {
                        this._map[dx][dy] = this._map[x][y];
                        if (this._map[dx][dy] === Sprite.uvstone) {
                            this._map[dx][dy] = Sprite.stone;
                        }
                    }
                    this._map[x][y] = Sprite.nothing;
                    if (this._map[dx][dy + 1] === Sprite.stone || this._map[dx][dy + 1] === Sprite.diamond || this._map[dx][dy + 1] === Sprite.wall || this.isGhost(dx, dy + 1)) {
                        this._soundTable[Sound.stone] = true;
                    }
                    if (this.isPlayer(dx, dy + 1)) {
                        this._player.kill();
                    }
                    if (this.isGhost(dx, dy + 1)) {
                        this.killGhost(dx, dy + 1);
                    }
                }
            }
        }
    }
    for (var i = 0; i < this._ghosts.length; i++) {
        this.moveGhost(this._ghosts[i]);
    }
    if (this.time > 0) {
        this.time--;
    }
    if (this.time === 0) {
        this._player.kill();
    }
};
Level.prototype.movePlayer = function (keys) {
    if (this._player.alive) {
        this._player.direction = Direction.none;
        var p = this._player.position.clone();
        var d = p.clone();
        var z = d.clone();
        if (keys[Key.left]) {
            z.x--;
            this._player.direction = Direction.left;
        }
        else {
            this._player.stone[0] = false;
            if (keys[Key.right]) {
                z.x++;
                this._player.direction = Direction.right;
            }
            else {
                this._player.stone[1] = false;
                if (keys[Key.up]) {
                    z.y--;
                    this._player.direction = Direction.up;
                }
                else if (keys[Key.down]) {
                    z.y++;
                    this._player.direction = Direction.down;
                }
            }
        }
        if (!d.equals(z)) {
            if (this._map[z.x][z.y] === Sprite.nothing) {
                this.placePlayer(d.x, d.y);
            }
            if (this._map[z.x][z.y] === Sprite.diamond) {
                this.collected += 1;
                this.score += 3;
                this._soundTable[Sound.diamond] = true;
            }
            if (this._map[z.x][z.y] === Sprite.stone) {
                if ((z.x > d.x) && (this._map[z.x + 1][z.y] === Sprite.nothing)) {
                    if (this._player.stone[1]) {
                        this._map[d.x + 2][d.y] = this._map[d.x + 1][d.y];
                        this._map[d.x + 1][d.y] = Sprite.nothing;
                    }
                    this._player.stone[1] = !this._player.stone[1];
                }
                if ((z.x < d.x) && (this._map[z.x - 1][z.y] === Sprite.nothing)) {
                    if (this._player.stone[0]) {
                        this._map[d.x - 2][d.y] = this._map[d.x - 1][d.y];
                        this._map[d.x - 1][d.y] = Sprite.nothing;
                    }
                    this._player.stone[0] = !this._player.stone[0];
                }
            }
            if (this._map[z.x][z.y] === Sprite.nothing || this._map[z.x][z.y] === Sprite.ground || this._map[z.x][z.y] === Sprite.diamond) {
                this.placePlayer(z.x, z.y);
                this._map[d.x][d.y] = Sprite.buffer;
                this._soundTable[Sound.step] = true;
            }
            if (this._map[z.x][z.y] === Sprite.exit || this._map[z.x][z.y] === Sprite.uvexit) {
                if (this.collected >= this.diamonds) {
                    return true; // next level
                }
            }
            if (this.isGhost(z.x, z.y)) {
                this._player.kill();
            }
        }
        // animate player
        this._player.animate();
    }
    return false;
};
Level.prototype.isPlayer = function (x, y) {
    return (this._map[x][y] === Sprite.player);
};
Level.prototype.placePlayer = function (x, y) {
    this._map[x][y] = Sprite.player;
    this._player.position.x = x;
    this._player.position.y = y;
};
Level.prototype.isGhost = function (x, y) {
    return this._map[x][y] === Sprite.ghost90L || this._map[x][y] === Sprite.ghost90R || this._map[x][y] === Sprite.ghost90LR || this._map[x][y] === Sprite.ghost180;
};
Level.prototype.moveGhost = function (ghost) {
    if (ghost.alive) {
        var p = ghost.position.clone();
        var w = [p.clone(), p.clone(), p.clone(), p.clone()];
        if (ghost.type === Sprite.ghost180 || ghost.type === Sprite.ghost90L || ghost.type === Sprite.ghost90R) {
            if (ghost.type === Sprite.ghost180) {
                if (ghost.direction === Direction.left) {
                    w[0].x--; w[1].x++;
                }
                if (ghost.direction === Direction.right) {
                    w[0].x++; w[1].x--;
                }
                if (ghost.direction === Direction.up) {
                    w[0].y--; w[1].y++;
                }
                if (ghost.direction === Direction.down) {
                    w[0].y++; w[1].y--;
                }
            }
            else if (ghost.type === Sprite.ghost90L) {
                if (ghost.direction === Direction.left) {
                    w[0].x--; w[1].y++; w[2].y--; w[3].x++;
                }
                if (ghost.direction === Direction.right) {
                    w[0].x++; w[1].y--; w[2].y++; w[3].x--;
                }
                if (ghost.direction === Direction.up) {
                    w[0].y--; w[1].x--; w[2].x++; w[3].y++;
                }
                if (ghost.direction === Direction.down) {
                    w[0].y++; w[1].x++; w[2].x--; w[3].y--;
                }
            }
            else if (ghost.type === Sprite.ghost90R) {
                if (ghost.direction === Direction.left) {
                    w[0].x--; w[1].y--; w[2].y++; w[3].x++;
                }
                if (ghost.direction === Direction.right) {
                    w[0].x++; w[1].y++; w[2].y--; w[3].x--;
                }
                if (ghost.direction === Direction.up) {
                    w[0].y--; w[1].x++; w[2].x--; w[3].y++;
                }
                if (ghost.direction === Direction.down) {
                    w[0].y++; w[1].x--; w[2].x++; w[3].y--;
                }
            }
            for (var i = 0; i < 4; i++) {
                if (!p.equals(w[i])) {
                    var d = w[i].clone();
                    if (this.isPlayer(d.x, d.y)) {
                        this._player.kill();
                    }
                    if (this._map[d.x][d.y] === Sprite.nothing) {
                        if (d.x < p.x) {
                            ghost.direction = Direction.left;
                        }
                        if (d.x > p.x) {
                            ghost.direction = Direction.right;
                        }
                        if (d.y < p.y) {
                            ghost.direction = Direction.up;
                        }
                        if (d.y > p.y) {
                            ghost.direction = Direction.down;
                        }
                        this.placeGhost(d.x, d.y, ghost);
                        this._map[p.x][p.y] = Sprite.nothing;
                        return;
                    }
                }
            }
        }
        else if (ghost.type === Sprite.ghost90LR) {
            if (ghost.direction === Direction.left) {
                w[0].x--; w[3].x++;
                if (ghost.lastTurn === Direction.left) {
                    w[1].y--; w[2].y++;
                }
                else {
                    w[1].y++; w[2].y--;
                }
            }
            else if (ghost.direction === Direction.right) {
                w[0].x++; w[3].x--;
                if (ghost.lastTurn === Direction.left) {
                    w[1].y++; w[2].y--;
                }
                else {
                    w[1].y--; w[2].y++;
                }
            }
            else if (ghost.direction === Direction.up) {
                w[0].y--; w[3].y++;
                if (ghost.lastTurn === Direction.left) {
                    w[1].x++; w[2].x--;
                }
                else {
                    w[1].x--; w[2].x++;
                }
            }
            else if (ghost.direction === Direction.down) {
                w[0].y++; w[3].y--;
                if (ghost.lastTurn === Direction.left) {
                    w[1].x--; w[2].x++;
                }
                else {
                    w[1].x++; w[2].x--;
                }
            }
            for (var i = 0; i < 4; i++) {
                if (!p.equals(w[i])) {
                    var d = w[i].clone();
                    if (this.isPlayer(d.x, d.y)) {
                        this._player.kill();
                    }
                    if (this._map[d.x][d.y] === Sprite.nothing) {
                        var lastDirection = ghost.direction;
                        if (d.x < p.x) {
                            ghost.direction = Direction.left;
                        }
                        if (d.x > p.x) {
                            ghost.direction = Direction.right;
                        }
                        if (d.y < p.y) {
                            ghost.direction = Direction.up;
                        }
                        if (d.y > p.y) {
                            ghost.direction = Direction.down;
                        }
                        if (lastDirection === Direction.left) {
                            if (ghost.direction === Direction.down) {
                                ghost.lastTurn = Direction.left;
                            }
                            if (ghost.direction === Direction.up) {
                                ghost.lastTurn = Direction.right;
                            }
                        }
                        else if (lastDirection === Direction.right) {
                            if (ghost.direction === Direction.down) {
                                ghost.lastTurn = Direction.right;
                            }
                            if (ghost.direction === Direction.up) {
                                ghost.lastTurn = Direction.left;
                            }
                        }
                        else if (lastDirection === Direction.up) {
                            if (ghost.direction === Direction.left) {
                                ghost.lastTurn = Direction.left;
                            }
                            if (ghost.direction === Direction.right) {
                                ghost.lastTurn = Direction.right;
                            }
                        }
                        else if (lastDirection === Direction.down) {
                            if (ghost.direction === Direction.left) {
                                ghost.lastTurn = Direction.right;
                            }
                            if (ghost.direction === Direction.right) {
                                ghost.lastTurn = Direction.left;
                            }
                        }
                        this.placeGhost(d.x, d.y, ghost);
                        this._map[p.x][p.y] = Sprite.nothing;
                        return;
                    }
                }
            }
        }
    }
};
Level.prototype.placeGhost = function (x, y, ghost) {
    this._map[x][y] = ghost.type;
    ghost.position.x = x;
    ghost.position.y = y;
};
Level.prototype.killGhost = function (x, y) {
    var ghost = this.ghost(x, y);
    if (ghost.alive) {
        for (var dy = y - 1; dy <= y + 1; dy++) {
            for (var dx = x - 1; dx <= x + 1; dx++) {
                if ((dx > 0) && (dx < 19) && (dy > 0) && (dy < 13)) {
                    if (this.isPlayer(dx, dy)) {
                        this._player.kill();
                    }
                    else {
                        if (this.isGhost(dx, dy)) {
                            this.ghost(dx, dy).alive = false;
                            this.score += 99;
                        }
                        this._map[dx][dy] = Sprite.nothing;
                    }
                }
            }
        }
        ghost.kill();
    }
};
Level.prototype.ghost = function (x, y) {
    for (var i = 0; i < this._ghosts.length; i++) {
        var ghost = this._ghosts[i];
        if ((x == ghost.position.x) && (y == ghost.position.y)) {
            return ghost;
        }
    }
    return null;
};
Level.prototype.getSpriteIndex = function (x, y, blink) {
    switch (this._map[x][y]) {
        case Sprite.nothing:
        case Sprite.uvexit:
        case Sprite.buffer:
        case Sprite.marker:
        case Sprite.uvstone:
            return 0;
        case Sprite.stone:
            return 1;
        case Sprite.ground:
            return 2;
        case Sprite.diamond:
            return 13 - ((blink + 4) % 6);
        case Sprite.wall:
            return 14;
        case Sprite.exit:
            return 32;
        case Sprite.changer:
            return 33;
        case Sprite.ghost90L:
        case Sprite.ghost90R:
        case Sprite.ghost90LR:
        case Sprite.ghost180:
            return this.ghost(x, y).getImageIndex();
        case Sprite.player:
            if (x == this._player.position.x && y == this._player.position.y) {
                return this._player.getImageIndex();
            }
            return 15;
    }
};

function Player(position) {
    this._direction = Direction.none;
    this.stone = [false, false];
    this.step = 0;
    this.alive = true;
    this.position = position;
};
Player.prototype.kill = function () {
    this.alive = false;
};
Player.prototype.animate = function () {
    this.step++;
    var max = 30;
    if (this.direction == Direction.left || this.direction == Direction.right) {
        max = 6;
    }
    if (this.direction == Direction.up || this.direction == Direction.down) {
        max = 2;
    }
    this.step = (this.step >= max) ? 0 : this.step;
};

Player.prototype.getImageIndex = function () {
    if (!this.alive) {
        return 31;
    }
    else if (this.direction === Direction.left && this.step < 6) {
        return [16, 17, 18, 19, 18, 17][this.step];
    }
    else if (this.direction === Direction.right && this.step < 6) {
        return [20, 21, 22, 23, 22, 21][this.step];
    }
    else if (this.direction === Direction.up && this.step < 2) {
        return [24, 25][this.step];
    }
    else if (this.direction === Direction.down && this.step < 2) {
        return [26, 27][this.step];
    }
    return [15, 15, 15, 15, 15, 15, 15, 15, 28, 28, 15, 15, 28, 28, 15, 15, 15, 15, 15, 15, 29, 29, 30, 30, 29, 29, 15, 15, 15, 15][this.step];
};

function Position(x, y) {
    this.x = x;
    this.y = y;
};
Position.prototype.equals = function (position) {
    return (this.x == position.x && this.y == position.y);
};
Position.prototype.clone = function () {
    return new Position(this.x, this.y);
};

var Sound = {
    "diamond": 0, "stone": 1, "step": 2
};

function SoundPlayer() {
    this._soundTable = {};
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (window.AudioContext) {
        this._audioContext = new AudioContext();
    }
    else {
        this._audioElement = document.createElement('audio');
    }
};
SoundPlayer.prototype.load = function (name, data) {
    var soundTable = this._soundTable;
    if (this._audioContext) {
        var decodedData = window.atob(data);
        var length = decodedData.length;
        var buffer = new ArrayBuffer(length);
        var array = new Uint8Array(buffer);
        for (var i = 0; i < length; i++) {
            array[i] = decodedData.charCodeAt(i);
        }
        this._audioContext.decodeAudioData(buffer, function (audio) {
            soundTable[name] = audio;
        }, function () {
            console.error("decodeAudioData");
        });
    }
    else {
        soundTable[name] = "data:audio/wav;base64," + data;
    }
};
SoundPlayer.prototype.play = function (name) {
    var sound = this._soundTable[name];
    if (sound) {
        if (this._audioContext) {
            var audioBufferSource = this._audioContext.createBufferSource();
            audioBufferSource.buffer = sound;
            audioBufferSource.connect(this._audioContext.destination);
            audioBufferSource.start(0);
        }
        else {
            this._audioElement.src = sound;
            this._audioElement.play();
        }
        return true;
    }
    return false;
};

var levelData = [
    "ZmZmZmZmZmZmZmUiIiIcEmIiJlZgEmZiERJiIiZWYCJlYhESYmZmVmAlZWYiIlJiIlZgJVVWZlIiYiFWZmZmVVZWZmIiVmERElVWVmVSIVZmFSBWVlZiUiFWYRWgZlZWYlIhVmYVIGVWVmJSIVZhFSBlUhJVUiFWZhUhZVISVVIiVmZmZmZmZmZmZmYBAECcQAQLUwAAAAAAAAAA",
    "ZmZmZmZmZmZmZmoBAiIiIiIAARZmZgImZmFiVVVWYiICJlVhYiIiJmJRUSZVYWIAARZiJlZmVWFiVVVWYiZVVlVRYiIiJmImVlZVYWIiIiZiJlVmZmFiIiImYiZlVWwhIiIiJmIiZlYiJmZmIhZiIiZmIiIiIiEWYiACIiERVVVVVmZmZmZmZmZmZmYCnEA4QQEDQgAAAAAAAAAA",
    "ZmZmZmZmZmZmZmERERERERFhERZgAiIiIiIiYREWYAIiIiIiIm7u5mACZiIiIiEiIqZgAiImIiIlJSLGYAIiIiISIiElVm4iIiIiIiIiIiZgBlZWFVZmZmZmYAYGVhVWAAAAVmAGBlZlZgAAAFZgAAYGZWAAAABWYAAABmVVVVVVVmZmZmZmZmZmZmYDOEHUQRIGNgAAAAAAAAAA",
    "ZmZmZmZmZmZmZmVVVVVlFRUVFRZgAHAAYAcAAAAGYREREWIiIiIixmEREREiIiIiIiZu7u7iIiIRESImYiIiIiIiFRUiJmIiIiISImZmIiZhEREhEiIiJiIWYiIqIhESIhYSVmZmZiISIiVWUiZiISEiEiJSJiIWZRIiIRIhERYiVmZmZmZmZmZmZmYE1EGsUQULIAAAAAAAAAAA",
    "ZmZmZmZmZmZmZmFhVSIiJlVQASZqIiIlZlYiIGYmYGBgZmImAABiJmBgYGUBJgMAYmZgYGBmBmZhImUmY2BgYQZmFmBmBmBgYGY2IiVgxiZlYGBlBmAGYCYGYmBgZSFgBlBWJmViY2ZmYBZRVgZiZWABJmAmZmYmZWVlUlZgUgICBmZmZmZmZmZmZmYFrFHYTwEEICIAAAAAAAAA",
    "ZmZmZmbGZmZmZmIAAAAHAAAAAFZlZmZmZmZmZmYmYmUiIiIiIiJWVmViZmZmYmZmJiZiYmAAAPAABiZWZWJgZmZmZgYmJmJiYGAFUAYGJlZlYmAAYAYABiYmYmJmZmZmZmYmVmVlIiIiIiIiViZiZmZmamZmZmZWZQAAAAAAAAAAJmZmZmZmZmZmZmYG2E9wQgkNGDIAAAAAAAAA",
    "ZmZmZmZmZmZmZmEREREVVVa7u8ZiIiIi5VVWu7u2YwAAABVVVgu7tmIiIiLlVVYAAAZiIiIiFVVWEAAGYiIiImZmZhZmZmMQAiIiIiISIiZhEiIgIiIiEiImYRJSICIiIhIiJmEVVSAiIiISIiZhEREgIiIiEiImYqIiIyIiIiIiJmZmZmZmZmZmZmYHcEKoQwIOJiIiIiIiIiIh",
    "ZmZmZmZmZmZmZmIiIiIiIiIRIiZiEhISEhIiIiImYSEhISEhIiIiJmZmZmZmZgLiIiZiERERERHmIiImYiIiIiIiBiIiJmIiIiIiIAYiIiZiIiIiIgAGIiImYiIiIiAABiIiJmIiIiIiIiYiIiZiIiIiIiEWZmYmaiIiIiIiIiIiLGZmZmZmZmZmZmYIqEMMQwEOEQAAAAAAAAAA",
    "ZmZmZmZmZmZmZmIiIiJrAAAAAAZjADAFZmBmZgMGYiImJmAAAAYABmAANrZmJmYGMAZiIiYGMAAGBgMGYAMGBlVVVgYABmIiJgZVVTYGMAZgMAYGVVVWBgMGYiImBmZmZgYABmMABgAAAAAGMAZiIiZmZmZmZgAGaiImwAAAAAAABmZmZmZmZmZmZmYJDENERAEOFSIgMAICMCAg",
    "ZmZmZmZmZmZmZmIiIiIiIiIiIiZiIiIiIiIiIiImYiIiIiIiIiIiJmIiIiIiIiIiIiZiIiIiIiIiIiImYiIiIiIiIiIiJmIiIiIiIiIiIiZiIiIiIiIiIiIma7u7u7AAACEiJmu7u7uwAAABEiZlVVVVVVVVUiImbFVVVVVVVVIipmZmZmZmZmZmZmYQRER0UBIOJyIiIiIiIiIi",
    "ZmZmZmZmZmZmZmJiYmJiYmJiYmZiYmJiAmJiYmLGYmJiAgICYmJiBmJiAgICAgJiAgZiAgICsgICAgIGYgICsgKyAgICtmICsgICArICsgZisgICAgICsgIGYgICAmICAgICBmICAmJiYgICAmZiAmJiYmJiAmJmamJiYmJiYmJiZmZmZmZmZmZmZmYRdFDgRAEOAAAAAAAAAAAA",
    "ZmZmZmZmZmZmZmIREREREiIiJhZiIiIiIiIiIiYWYiIiIiIiIiImFmoiIiIiIiIiJiZiISEhBiIiIiImYiIiIgYiYiIiJmIiIiImImIAICZiIiEhJiJu7u7mYiIiIiIiYAAABmADAwAAAGAAAAZmYAADAABgAAAGbGUFIiIlYAAABmZmZmZmZmZmZmYS4ER8RQEGEjIgAAAAAAAA",
    "ZmZmZmZmZmZmZmISEhISEhISEhZhISEhISEhISEWYhISEhISEhISZmEhISEhISEhImZiEhISEhISEiJmYSEhISEhISZmZmIiIiIiIiIiIiZiIiImIiIiIiImYiIiJmAiIiIAtmIiIiZgZiIiIiZqIiImYG4iIiImbCIiJmBiIiIiJmZmZmZmZmZmZmYTfEUYRgENIDAAAAAAAAAA",
    "ZmZmZmZmZmZmZmsLAAICAgICAlZlVVUGAgICAgJWZmZmBgICAgICVmAAAAYyMjIyMlZgZmZmZmZmZmFWYAAABmxVIiJiJmZmZgBmZiIiYiZgAAAGZVUgAGImYGZmZmZmILBiJmAAAKZVVSAAYiZmZmYGZmYgsGImYAAABlVVIABiJmZmZmZmZmZmZmYUGEa0RgYMIyIRERIwAAAA",
    "ZmZmZmZmZmZmZmAAAlUSIhISEhZhIgJVUgISEiEmZRIAVVIiEhIhJmESAFZmIhISEhZhEgVmIiISEhIWZmAGZSIiIiIiJmFgFRVgAAAAAAZhYGZmVWMAMAA2YKBlVlVmAzAwBmZjZlZVVgMDMwZmAwZWZlYwAwA2ZszGVVVWMAAABmZmZmZmZmZmZmYVtEbsRwILMCIzMyIjIjMy",
    "ZmZmZmZmZmZmZmIVESJhFiIhIlZiFSIioiAAAmZmYhVmEgBgAAIhVmIRFhABYCIiISZiIVZgImIiMAIWZmYSBRVlYgMBJmIiElERZWIAMhZiZmZmZmZiAwEmYSERASVVESIiJm4RIiIiUiIiISZlJTAAABAAEhUWZQESUiEgDCFRVmZmZmZmZmZmZmYW7EckSQgEICMjMAAAAAAA",
    "ZmZmZmZmZmZmZmERYRFiIiwRERZiomERYAMGEREWYgJhEWAANmZVVmICYRFgAwZVVVZiAmERYDAGIiImYiJmFmMABiUiJmIiIiIiIiIiUiZiJVUiIiIiIiJWYiIiIhISIlJSJmIiIiISEiIiJSZmZmZmYmZmZmZmYwAAAABVVVVVVmZmZmZmZmZmZmYXJEkQUQIEICIzMwAAAAAA",
    "ZmZmZmZmZmZmZmBWAiYiAAVhEhZvZgYmJgUCYioWYAAGJiayAmImZmZmJiImAABiIiZiFiZmZmUAYRJmYVYlZSViAGISJmEWYmJmZgBgIiZlUAAAZQYAZRJmZiZmZmIGxmYiFmAAAAAABmYgEhZgZmZmAAYhIGZmYAVWVwAAAQADBmZmZmZmZmZmZmYYEFHASREEEgAiAAAAAAAA",
    "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",
    "ZmZmZmZmZmZmZmxlImUVERJWAVZlIiBiIlFiFiZmZSZiImYi/yIiJmIiJRFRVlZmAKZmZiYmIiIiJiImYAYmAAZmEVEiVmIiJRYCIgIiBmZiZiVWIiImViIWYiIiIiImIlYiJmAQAGBmZgBmASZlFmAQYVUiIiYmZWFVFWIiZiImVmZmZmZmZmZmZmYziFMkVBIGJQAAAAAAAAAA",
    "ZmZmZmZmZmZmZmIiIiIiIiIiIiZiIiIiIiIiIiImYiIAciBwInACJmIiAAIgACIAAiZiIlACJQAiUAImYiIiIiIiIiIiJmIiIiIiIiIiIiZiIgACIAAiAAImYiJwAiBwIgByJmIiUAIlACJQACZiIiIiIiIiIiImbKIiIiIiIiIiJmZmZmZmZmZmZmY1wFRcVQIOBiIiIiIiIiIh",
    "ZmZmZmZmZmZmZmAAdiISJSxgAHZgAAYiEVIiYAAGZQACIRUSIiUABmZmZiVSIlJmZmZgAHYiIlUAYAB2YAAGIRIiImAABmUAAiEgAiIlAAZmZmYiIAISZmZmYiUmIiICIiAAdmJVJiIiIiJgAAZiIiIiIiISYAAGagImASJQImUABmZmZmZmZmZmZmY2XFX4VQEOFyIgMAICMCAg",
    "ZmZmZmZmZmZmZmFRVRUVVRFRURZlFVFRURVVFVVWYVVVUVVVFVUVFmVRVVUVFVVVUVZhVVUVUVFRUVUWZmYmZmZmZiZmZmAAAABgAAAAAMZgAAAAYAAAAAAGYAAAAGAAAAAABmAAAAAgAAAAAAZgAAAAYBARAAAGahVVFWFVFVAVVmZmZmZmZmZmZmY3+FWUVgEOZgAAAAAAAAAA",
    "ZmZmZmZmZmZmZmERERIhERERERZhERESACIiIiImYREREiIiIiIiJmERERIiIiIiIiZiIiIiIiIiIu7mYiIiIiIiIiIiJmAAACJQAAAAAAZgAAAiVQAAAAAGYAAAIlVQAAAABmImZmYiJmbiIiZnd3d3dwAAAiImZ3fHd3AAAAIgpmZmZmZmZmZmZmY4lFYwVxIOFiIiIiIAIiIi",
    "ZmZmZmZmZmZmZmwiIiIiIiIhIiZmYiIgAHACIhEmYGIiICIiAgEiJmpiIiAiIgIiIiZgZmVgZmYGAAAGYABlYAEAdlAABmAQZWBmZgZVAAZgZmVgZ3YGVVAGYGVVYGd2BlVVBmBlVWBgAAZVVVZgZmZgZmYGZmZmYAAAAP8AAAB3dmZmZmZmZmZmZmY5MFfMVwEGJDIgAAAAAAAA",
    "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",
    "ZmZmZmZmZmZmZmJSUlVTAAAAAGZgZmJmYGYGJmBmYGMAAGAACgBgZmBgYmVgZmYmYAZgYGViUGVSUmBmYABgZmBgZmADBmBmYAAAAGBmZgZgZQAABgAAIAAGYCJmZmZmYGBgZmBlAAYGMABgYGZjYmYGAAAAAGBmYiIiIlZgY2AAxmZmZmZmZmZmZmZZZGMAZA0FFAQkIgAAAAAA",
    "ZmZmZmZmZmZmZmoAAGEAAAYiVVZiIiIlEAACIiIWYiIiEREAAAAiVmZmZmZmBmZmZmZhECJgAAAmFVFWZSIiUQAAJlFVFmZmZmVQACIiIiZiIiJlVQAiIiImYABwZmYGZmZmZmIiImAAAAYQIVZgECIgVQBSIiFWZSAibFIBFiIiJmZmZmZmZmZmZmZj4GV4ZgEDJAAAAABmZmZm",
    "ZmZmZmZmZmZmZmAAEAsAEAAAAAZgYmVmYGZmZmAGY2BmYlBsZVVgBmAQAAVgZhEWYAZgYAACZWIiImIGZVUABWpgAwBgBmZmUAJlZRUVYAZlZmUFZmIiImMGZWZmUmBiUVJgBmVmZmVgJVZVYAZlZmZmY2ZmZm4mZQAwBgAAAAAABmZmZmZmZmZmZmZkeGYQZwkINCAwEgBmZmZm",
    "ZmZmZmZmZmZmZmUhEABgAhIAAAZlIiAAYCEgAABmZSABAGFiAAAABmIAAiBlYCZmZgZgADACBWAAVVYGZmRGZmVgACFWBmAQEBBlYAEhVgZiISAgZWNRJma2YiLuImVgZmBmBmUAAAVlYGxgZgZlUABVZWBmYGYGZVUFVWoAAGAABmZmZmZmZmZmZmZlEGeoZwkONCAAAABmZmZm",
    "ZmZmZmZmZmZmZmAAAAAgAABWDBZgZmZgZmZiImYWYGVVYGVVYQZWJmBlZWBlZWIGVgZgZmVgZWZhBlYGb1VVamVVUgVmBmBmZmVmZiZmYAZgIiJmUAAwBWAGYAAAJWAAMAJeBmYSIiZSaWlpYAZlFRYWIi5eXlYGYVJVUVFSIiIlVmZmZmZmZmZmZmZnQGjYaAcIQQIwAABmZmZm",
    "ZmZmZmZmZmZmZmISIiIsIiIiISZiIiIiIiIiIiImYiIiIiIiIiIiJmIiIiIiIiIiIiZiIiIiuzsiIiImYiIiIvVfIiIiJmIiIiK1WyIiIiZiIiIie7ciIiImYiIiIiIiIiIiJmIiIiIiIiIiIiZiIiIiIiIiIiImYiIiIioiIiIiJmZmZmZmZmZmZmZpcGkQagkOAjMzMwAAAAAA",
    "ZmZmZmZmZmZmZmAABABURAAAQAZgBAAAQAQEQAAGZAQEREBEBAREVmAEAABAAAAEQEZgRAREQEBAAAAGYAAAAAAEBERERmREREBARAAAAAZgAEBAAAQEAEBWYEBARAREBERARmBAAEAABAAAAAZtREQARARAREBGagAAAAQAAABABmZmZmZmZmZmZmZwEGqoagEOAwAAAABmZmZm",
    "ZmZmZmZmZmZmZmERUSYiIiIiIiZiIiImMAAAACAGYLAABlVVVVVVVmIiIhYDAAAAAAZlVVVVVVVVVVVWYhISEhIAEhISFmEhISEhISEhISZiIiIiIiIiIiImYCIiIiIiIiIiJmMloAAAAAAAAAZgJQAAAAAAAAAGbBIiIiIiIiIiJmZmZmZmZmZmZmZyQGvgawQMKAAAAAAAAAAA",
    "ZmZmZmZmZmZmZmIiIiYRERYCIqZiEhImEREWAhImYSEhJhERFgIhJmISEiARERACIiZiIiImEWEWMwAGYDAAJmYWZiISJmIiIiIiIiIiIiZiIiIiIhISEhImZmbu7mIubmLmJmAAAABgADAAAAZlAAAAYAAAADAGZVAAAGAAMFAAxmZmZmZmZmZmZmZ1IG3AbRIDIBIiIgAAAAAA",
    "ZmZmZmZmZmZmZmEREWISEhEgCQZhERFiISEhIAkGYRERYRISESAJBmEREWIiIiIgCQZmERZiIiIiKgCWZmJmAzAAAiIiJmIiImIiIiIiIiZiIiJmZubmIiImZm7uYAawBlVVVmAAAAsGBrZRURZgAAALtjYGFVVWYAAAAAYABlFVxmZmZmZmZmZmZmZ2wG1gbg8HQCIAAAAAAAAA",
    "ZmZmZmZmZmZmZmIRwiIioiIiJlZiEWISEiISERZWYhFiEhIhIhEWVmIhJmZmIiIiJlZiIiYiIiADAAZWZiImJmViIiImVmIiJiZWYAMABlZgMAYiImZmZiFmYmZmYm7u7iICJmERESJgYAIiAiZu7u7iYGBiYgYmYiIiImBgsLACVmZmZmZmZmZmZmZ3YG4AbwoDJyIgAAAAAAAA",
    "ZmZmZmZmZmZmZmIiIhIiIqEiIhZhERIhESEiERImZVVQJVIlIlVbBmUiKyVRJSJSVSZlISAlJSUiURUWZVUgJSUlIlEVJmUiKyUiVSJRFRZlILAlIFUiURUmZREgJSslIlJVBmVVUCUABSJVUrZu7u7u7u7u7u7mbAAAAAAAAAAAxmZmZmZmZmZmZmaAQHAAAAwDdQAAAAAAAAAA"
];

<!-- BEGIN RESOURCE MAP -->
var resourceMap = {
'diamond.wav': 'UklGRvwDAABXQVZFZm10IBIAAAABAAEAQB8AAIA+AAACABAAAABkYXRhOAIAAITBhMGEwYTBhMGEwYTBhMGI/4j/iP+I/4j/iP+I/4j/iP+EwYTBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4j/hMGEwYTBhMGEwYTBhMGEwYj/iP+I/4j/iP+I/4j/iP+EwYTBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4TBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4TBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4TBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+EwYTBhMGEwYTBhMGI/4j/iP+I/4j/iP+I/4TBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/hMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+EwYTBhMGEwYTBhMGI/4j/iP+I/4j/iP+EwYTBhMGEwYTBiP+I/4j/iP+I/4j/hMGEwYTBhMGEwYj/iP+I/4j/iP+I/4TBhMGEwYTBhMGI/4j/iP+I/4j/hMGEwYTBhMGEwYj/iP+I/4j/iP+EwYTBhMGEwYj/iP+I/4j/iP+EwYTBhMGEwYj/iP+I/4j/hMGEwYTBhMGEwYj/iP+I/4j/hMGEwYTBiP+I/4j/iP+EwYTBhMGEwYj/iP+I/4TBhMGEwYj/iP+I/4TBhMGEwYj/iP+I/4TBhMGEwYj/iP+I/4TBhMGI/4j/hMGEwYTBiP+I/4TBhMGI/4TBhMGI/4j/hMGI/4TBiP+EwYj/iP9BRkFulQEAAAQLc3RyZWFtdHlwZWSB6AOEAUCEhIQTTlNNdXRhYmxlRGljdGlvbmFyeQCEhAxOU0RpY3Rpb25hcnkAhIQITlNPYmplY3QAhYQBaQOShISECE5TU3RyaW5nAZWEASsERGF0ZYaShISEBk5TRGF0ZQCVhAFkgyJTft3Wm7JBhpKEl5gSVGFibGVzQXJlQmlnRW5kaWFuhpKEhIQITlNOdW1iZXIAhIQHTlNWYWx1ZQCVhAEqhIQBY54AhpKEl5gIQ2hhbm5lbHOGkoSEhA5OU011dGFibGVBcnJheQCEhAdOU0FycmF5AJWWAZKEk5YFkoSXmANNYXiGkoScnYSEAWahgwDw+T6GkoSXmA1BRlJNU1dhdmVmb3JthpKEhIQGTlNEYXRhAJWWCIQEWzhjXX+nrj4AAAAAhpKEl5gOQUZNZWFuV2F2ZWZvcm2GkoSplgijoP91PgAAAACGkoSXmANSTVOGkoScnaahg8u8sD6GkoSXmA1BRk1heFdhdmVmb3JthpKEqZYIowDw+T4AAAAAhoaGhgA=',
'font.gif': 'R0lGODlhEACwA5EAAAAAAP///////wAAACH5BAEAAAIALAAAAAAQALADAAL/lI+py+0Po5y02ouz3jb4AH3gI4af6aGjU5Ind7XsC9dZmy74muyMbwsKh8SiBqhAHkRMmqDZTL5y0hy1N+UhlAYoc+t1drM/svFcllzBYV77yl2aq2F2vWHVYsd2bx86o6Z3JiNnJ3VoiAU3uBexptOI6JIIVvmkVwhZiIYJSVfGCKqY+Ok5YmrpqKoKxJjHdzo5tunmBCur+CqGScubSgTMiie52nmMnKxcIUxKLKgS7dLM+fxYPEu5PNQcC30tSM07OiP+HQi+rc4hGjlMTmz6ZtsWip2b5jzcvd5/aS+tXKN5f6JEEofwXjV/DBs6NHFOG0SJFB9aNFJvEaCL/xw7enS4UGPAePc+RkSHsqK7dClbrpzoMp/JGHcK3vqVpVaedjttxVLS01uvU7V8FZXjR6PBmSqALRU5dFTCkQCnKRwHlU5SoxuZHuyKFGzIoC9JjsxocxfVrxnn8euINuzTsaiwyvtCkl/IUnbr3k2bqaZXq2v/CLyLS2rgdpd0vuG6NavZwfbauvVVWKnYx9em4nNEF7BWvJRHV4u7N2zTzaj7Yl4Z+vM+wZCxenXrl7PAzK93T/ZdFfjv4aXZkpZ7PHbs2o7nupat6/lyoseZlzQZ1/q/6H+h/3xufVfk4MOzU09dvDh67+m3w2sPXzVhdevr25b//mv8cFed3v/vrd98vOEnIHH7UWaeeUUkSNuBTNmn13/s5UchgeRV6B58DEamHHgBCoehhclAeF0NG7I2UG75eJaSK/TUxdVsmrzIGHUy3mSYM2pBt8NbNzTYWncdCindZedtNGSKALbiIYK6HTkjkVIKRpCI3025YpFBNqgekFRqqeSEVkp24YegeXjiU12OB+VigW234yRJZomlMafRWF2bB+IWXk79/cnhkyQOuKRxSfGZHqKKSkhioFsSKmahIUrqYJrJgUnnn2fhFaWfmcqkp2brfTQnbJiaWuWidcp5KqurGrPmlwpGSuugBZY5KXtV9ukgmWbi6muuPYZZqqthaieqhKT/4gTni+981lxfahLo2LN3NpshWdk4yaKBwjIKbrfAZgjYsLPOVOyZncYo37BXqjhUuky+Oi+xTQ4mL3fM2qgujPoKpW288H5XqLtQ5StUrNM+iqq99P7b8KcRl2XpqB7t2mac/UpsbKaOyqrprb/2GqpoYwZcL8cbRyVwYi379DKTJs/MkkpBYIxzqyt33PDHH2dz7ckDw1pazpaJm1ee5wZ7sM43LswlvkYiSu6YVVN6da3hhgyihk5DzHPYO4+d8sRiP6101Ld9/a7KZZ8NNtk64igZYvdNG6vbcb8td9tm9x1zLmQBRXdjJXKEMMszwmO3f6nhjRx51c79cMJSIqPjX8HOEh3Ha45z7S3TWVuM7tRGjmu11p8PaGtld1BNRAEAOw==',
'sprite.gif': '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',
'step.wav': 'UklGRkgAAABXQVZFZm10IBIAAAABAAEAQB8AAIA+AAACABAAAABkYXRhIgAAAITBhMGEwYTBhMGEwYTBhMGI/4j/iP+I/4j/iP+I/4j/iP8=',
'stone.wav': 'UklGRqIBAABXQVZFZm10IBIAAAABAAEAQB8AAIA+AAACABAAAABkYXRhfAEAAITBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4TBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBhMGEwYTBiP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4j/iP+I/4TBhMGEwYj/hMGI/4TBhMGI/4TBhMGI/4j/hMGEwYj/iP+EwYTBiP+I/4TBhMGEwYj/iP+EwYTBhMGI/4j/iP+EwYTBhMGI/4j/iP+EwYTBhMGI/4j/iP+I/4TBhMGEwYj/iP+I/4j/'
};
<!-- END RESOURCE MAP -->