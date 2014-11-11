/// <reference path="managers/asset.ts" />
/// <reference path="managers/collision.ts" />
/// <reference path="states/gameover.ts" />
/// <reference path="states/menu.ts" />
/// <reference path="states/play.ts" />
/// <reference path="constants.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var stage;
var game;
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

var scoreboard;

var collision;

var tryAgain;
var playButton;

var currentState;
var currentStateFunction;

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

    //gameStart();
    currentState = constants.MENU_STATE;
    changeState(currentState);
}

function gameLoop(event) {
    currentStateFunction();
    stage.update();
}

// Plane Class
var Plane = (function () {
    function Plane(stage, game) {
        this.stage = stage;
        this.game = game;
        this.image = new createjs.Bitmap(queue.getResult("plane"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.image.x = 100;

        game.addChild(this.image);
        this.engineSound = createjs.Sound.play('sound1', createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 1);
    }
    Plane.prototype.update = function () {
        this.image.y = stage.mouseY;
    };
    Plane.prototype.destroy = function () {
        this.engineSound.stop();
        game.removeChild(this.image);
    };
    return Plane;
})();

// bullet Class
var Bullet = (function () {
    function Bullet(stage, game) {
        this.stage = stage;
        this.game = game;
        this.image = new createjs.Bitmap(queue.getResult("bullet"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.dx = BULLET_ITEM_SPEED;

        // stage.addChild(this.image);
        this.reset();
        game.addChild(this.image);
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
    Bullet.prototype.destroy = function () {
        game.removeChild(this.image);
    };
    return Bullet;
})();

// Cloud Class
var Cloud = (function () {
    function Cloud(stage, game) {
        this.stage = stage;
        this.game = game;
        this.image = new createjs.Bitmap(queue.getResult("cloud"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;

        //stage.addChild(this.image);
        this.reset();
        game.addChild(this.image);
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
    Cloud.prototype.destroy = function () {
        game.removeChild(this.image);
    };
    return Cloud;
})();

// Background Class
var Background = (function () {
    function Background(stage, game) {
        this.stage = stage;
        this.game = game;
        this.image = new createjs.Bitmap(queue.getResult("background"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = SCROLL_SPEED;
        stage.addChild(this.image);
        this.reset();
        game.addChild(this.image);
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
    function Background2(stage, game) {
        this.stage = stage;
        this.game = game;
        this.image = new createjs.Bitmap(queue.getResult("background"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = SCROLL_SPEED;
        stage.addChild(this.image);
        this.reset();
        game.addChild(this.image);
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

var Button = (function (_super) {
    __extends(Button, _super);
    function Button(x, y, buttonIDString) {
        _super.call(this, managers.Assets.atlas, buttonIDString);
        this.regX = this.getBounds().width / 2;
        this.regY = this.getBounds().height / 2;
        this.x = x;
        this.y = y;
        this.setButtonListeners();
    }
    Button.prototype.setButtonListeners = function () {
        this.cursor = 'pointer';
        this.on('rollover', this.onButtonOver);
        this.on('rollout', this.onButtonOut);
    };

    Button.prototype.onButtonOver = function () {
        this.alpha = 0.8;
    };

    Button.prototype.onButtonOut = function () {
        this.alpha = 1;
    };
    return Button;
})(createjs.Sprite);

function changeState(state) {
    switch (state) {
        case constants.MENU_STATE:
            // instantiate menu screen
            currentStateFunction = states.menuState;
            states.menu();
            break;

        case constants.PLAY_STATE:
            // instantiate play screen
            currentStateFunction = states.playState;
            states.play();
            break;

        case constants.GAME_OVER_STATE:
            currentStateFunction = states.gameOverState;

            // instantiate game over screen
            states.gameOver();
            break;
    }
}

var Label = (function (_super) {
    __extends(Label, _super);
    function Label(x, y, labelText) {
        _super.call(this, labelText, constants.LABEL_FONT, constants.LABEL_COLOUR);
        this.regX = this.getBounds().width / 2;
        this.regY = this.getBounds().height / 2;
        this.x = x;
        this.y = y;
    }
    return Label;
})(createjs.Text);
//# sourceMappingURL=game.js.map
