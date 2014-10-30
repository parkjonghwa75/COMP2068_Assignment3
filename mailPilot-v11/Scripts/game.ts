var stage: createjs.Stage;
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
        { id: "sound1", src: "sounds/engine.ogg" }
    ]);
}

function init(): void {
    stage = new createjs.Stage(document.getElementById("canvas"));
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    gameStart();
}

function gameLoop(event): void {
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
class Plane {
    image: createjs.Bitmap;
    width: number;
    height: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("plane"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.image.x = 100;

        stage.addChild(this.image);
    }

    update() {
        this.image.y = stage.mouseY;
        createjs.Sound.play('sound1', createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 1);
    }
}

// bullet Class
class Bullet {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dx: number;
    probabilityBullet: number;

    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("bullet"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.dx = BULLET_ITEM_SPEED;
        stage.addChild(this.image);
        this.reset();
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
}

// Cloud Class
class Cloud {
    image: createjs.Bitmap;
    width: number;
    height: number;


    dx: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("cloud"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        stage.addChild(this.image);
        this.reset();
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
}

// Background Class
class Background {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dx: number;

    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("background"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = SCROLL_SPEED;
        stage.addChild(this.image);
        this.reset();
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
    width: number;
    height: number;
    dx: number;

    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("background"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = SCROLL_SPEED;
        stage.addChild(this.image);
        this.reset();
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

function gameStart(): void {

    background = new Background();
    background2 = new Background2();
    bullet = new Bullet();
    plane = new Plane();

    for (var count = 0; count < CLOUD_NUM; count++) {
        clouds[count] = new Cloud();
    }
}