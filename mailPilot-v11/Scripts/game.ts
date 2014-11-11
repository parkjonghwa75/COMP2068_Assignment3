/// <reference path="managers/asset.ts" />
/// <reference path="managers/collision.ts" />
/// <reference path="states/gameover.ts" />
/// <reference path="states/menu.ts" />
/// <reference path="states/play.ts" />
/// <reference path="constants.ts" />

var stage: createjs.Stage;
var game: createjs.Container;
var queue;

// Game Objects
var plane: Plane;
var bullet: Bullet;
var background: Background;
var background2: Background2;

// Cloud Array
var clouds = [];

// Game Constants
var CLOUD_NUM: number = 3;

// Scroll Speed
var SCROLL_SPEED: number = 3;

// Bullet Item Speed
var BULLET_ITEM_SPEED: number = 10;

var scoreboard: Scoreboard;

var collision: managers.Collision;

var tryAgain: Button;
var playButton: Button;

var currentState: number;
var currentStateFunction;

function preload(): void {
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

function init(): void {
    stage = new createjs.Stage(document.getElementById("canvas"));
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    //gameStart();
    
    currentState = constants.MENU_STATE;
    changeState(currentState);
}

function gameLoop(event): void {
    currentStateFunction();
    stage.update();
}

// Plane Class
class Plane {
    image: createjs.Bitmap;
    stage: createjs.Stage;
    game: createjs.Container;
    width: number;
    height: number;
    engineSound: createjs.SoundInstance;

    constructor(stage: createjs.Stage, game: createjs.Container) {
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

    update() {
        this.image.y = stage.mouseY;
        
    }
    destroy() {
        this.engineSound.stop();
        game.removeChild(this.image);
    }
}

// bullet Class
class Bullet {
    image: createjs.Bitmap;
    stage: createjs.Stage;
    game: createjs.Container;
    width: number;
    height: number;
    dx: number;
    probabilityBullet: number;

    constructor(stage: createjs.Stage, game: createjs.Container) {
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

    reset() {
        this.image.x = stage.canvas.width+1000;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
    }

    update() {
        this.image.x -= this.dx;
        if (this.image.x <= -this.width-3000) {
            this.reset();
        }
    }
    destroy() {
        game.removeChild(this.image);
    }
}

// Cloud Class
class Cloud {
    image: createjs.Bitmap;
    stage: createjs.Stage;
    game: createjs.Container;
    width: number;
    height: number;


    dx: number;
    constructor(stage: createjs.Stage, game: createjs.Container) {
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

    reset() {
        this.image.x = 1000;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
        this.dx = Math.floor(Math.random() * 10 + 1);
    }

    update() {

        this.image.x -= this.dx;
        if (this.image.x <= -this.width) {
            this.reset();
        }
    }
    destroy() {
        game.removeChild(this.image);
    }
}

// Background Class
class Background {
    image: createjs.Bitmap;
    stage: createjs.Stage;
    game: createjs.Container;
    width: number;
    height: number;
    dx: number;

    constructor(stage: createjs.Stage, game: createjs.Container) {
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

    reset() {
        this.image.x = 0;
    }

    update() {
        this.image.x -= this.dx;
        if (this.image.x <= -1275) {
            this.image.x = 1275;
        }
    }
}

// Background2 Class
class Background2 {
    image: createjs.Bitmap;
    stage: createjs.Stage;
    game: createjs.Container;
    width: number;
    height: number;
    dx: number;

    constructor(stage: createjs.Stage, game: createjs.Container) {
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

    reset() {
        this.image.x = 1275;
    }

    update() {
        this.image.x -= this.dx;
        if (this.image.x <= -1275) {
            this.reset();
        }
    }
}


class Scoreboard {
    stage: createjs.Stage;
    game: createjs.Container;
    lives: number;
    score: number;
    label: createjs.Text;
    labelText: string = "";
    width: number;
    height: number;
    constructor(stage: createjs.Stage, game: createjs.Container) {
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

    update() {
        this.labelText = "Lives: " + this.lives.toString() + " Score: " + this.score.toString();
        this.label.text = this.labelText;
    }

    destroy() {
        stage.removeChild(this.label);
    }
}


class Button extends createjs.Sprite {
    constructor(x: number, y: number, buttonIDString: string) {
        super(managers.Assets.atlas, buttonIDString);
        this.regX = this.getBounds().width / 2;
        this.regY = this.getBounds().height / 2;
        this.x = x;
        this.y = y;
        this.setButtonListeners();
    }

    setButtonListeners() {
        this.cursor = 'pointer';
        this.on('rollover', this.onButtonOver);
        this.on('rollout', this.onButtonOut);
    }

    onButtonOver() {
        this.alpha = 0.8;
    }

    onButtonOut() {
        this.alpha = 1;
    }
}

function changeState(state: number): void {
    // Launch Various "screens"
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

class Label extends createjs.Text {
    constructor(x: number, y: number, labelText: string) {
        super(labelText, constants.LABEL_FONT, constants.LABEL_COLOUR);
        this.regX = this.getBounds().width / 2;
        this.regY = this.getBounds().height / 2;
        this.x = x;
        this.y = y;
    }
}