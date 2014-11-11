/// <reference path="managers/collision.ts" />
/// <reference path="constants.ts" />
var stage;
var queue;

// Game Objects
var plane;
var bullet;
var background;
var background2;

// Cloud Array
var clouds = [];

// Game Constants
var CLOUD_NUM = 3;

// Scroll Speed
var SCROLL_SPEED = 3;

// Bullet Item Speed
var BULLET_ITEM_SPEED = 10;

function preload() {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "plane", src: "images/p_47222.png" },
        { id: "bullet", src: "images/bullet.png" },
        { id: "cloud", src: "images/cloud_PNG16.png" },
        { id: "background", src: "images/reSize_background.png" },
        { id: "background2", src: "images/reSize_background.png" },
        { id: "sound1", src: "sounds/engine.ogg" },
        { id: "bulletGet", src: "sounds/Explosion.wav" },
        { id: "cloudHit", src: "sounds/Hit_Hurt.wav" }
    ]);
}

function init() {
    stage = new createjs.Stage(document.getElementById("canvas"));
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    gameStart();
}

function gameLoop(event) {
    background.update();
    background2.update();
    bullet.update();
    plane.update();

    for (var count = 0; count < CLOUD_NUM; count++) {
        clouds[count].update();
    }

    stage.update();
}

// Plane Class
var Plane = (function () {
    function Plane() {
        this.image = new createjs.Bitmap(queue.getResult("plane"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.image.x = 100;

        stage.addChild(this.image);
    }
    Plane.prototype.update = function () {
        this.image.y = stage.mouseY;
        createjs.Sound.play('sound1', createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 1);
    };
    return Plane;
})();

// bullet Class
var Bullet = (function () {
    function Bullet() {
        this.image = new createjs.Bitmap(queue.getResult("bullet"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.dx = BULLET_ITEM_SPEED;
        stage.addChild(this.image);
        this.reset();
    }
    Bullet.prototype.reset = function () {
        this.image.x = stage.canvas.width + 1000;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
    };

    Bullet.prototype.update = function () {
        this.image.x -= this.dx;
        if (this.image.x <= -this.width - 3000) {
            this.reset();
        }
    };
    return Bullet;
})();

// Cloud Class
var Cloud = (function () {
    function Cloud() {
        this.image = new createjs.Bitmap(queue.getResult("cloud"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        stage.addChild(this.image);
        this.reset();
    }
    Cloud.prototype.reset = function () {
        this.image.x = 1000;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
        this.dx = Math.floor(Math.random() * 10 + 1);
    };

    Cloud.prototype.update = function () {
        this.image.x -= this.dx;
        if (this.image.x <= -this.width) {
            this.reset();
        }
    };
    return Cloud;
})();

// Background Class
var Background = (function () {
    function Background() {
        this.image = new createjs.Bitmap(queue.getResult("background"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = SCROLL_SPEED;
        stage.addChild(this.image);
        this.reset();
    }
    Background.prototype.reset = function () {
        this.image.x = 0;
    };

    Background.prototype.update = function () {
        this.image.x -= this.dx;
        if (this.image.x <= -1275) {
            this.image.x = 1275;
        }
    };
    return Background;
})();

// Background2 Class
var Background2 = (function () {
    function Background2() {
        this.image = new createjs.Bitmap(queue.getResult("background"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = SCROLL_SPEED;
        stage.addChild(this.image);
        this.reset();
    }
    Background2.prototype.reset = function () {
        this.image.x = 1275;
    };

    Background2.prototype.update = function () {
        this.image.x -= this.dx;
        if (this.image.x <= -1275) {
            this.reset();
        }
    };
    return Background2;
})();

function gameStart() {
    background = new Background();
    background2 = new Background2();
    bullet = new Bullet();
    plane = new Plane();

    for (var count = 0; count < CLOUD_NUM; count++) {
        clouds[count] = new Cloud();
    }
}

var Scoreboard = (function () {
    function Scoreboard(stage, game) {
        this.labelText = "";
        this.stage = stage;
        this.game = game;
        this.lives = constants.PLANE_LIVES;
        this.score = 0;
        this.label = new createjs.Text(this.labelText, constants.LABEL_FONT, constants.LABEL_COLOUR);
        this.update();
        this.width = this.label.getBounds().width;
        this.height = this.label.getBounds().height;

        game.addChild(this.label);
    }
    Scoreboard.prototype.update = function () {
        this.labelText = "Lives: " + this.lives.toString() + " Score: " + this.score.toString();
        this.label.text = this.labelText;
    };

    Scoreboard.prototype.destroy = function () {
        stage.removeChild(this.label);
    };
    return Scoreboard;
})();
//# sourceMappingURL=game.js.map
