/// <reference path="../managers/collision.ts" />
/// <reference path="../game.ts" />


module states {
    export function playState() {
        background.update();
        bullet.update();
        plane.update();

        for (var count = 0; count < constants.CLOUD_NUM; count++) {
            clouds[count].update();
        }

        collision.update();
        scoreboard.update();

        if (scoreboard.lives <= 0) {
            stage.removeChild(game);
            plane.destroy();
            game.removeAllChildren();
            game.removeAllEventListeners();
            currentState = constants.GAME_OVER_STATE;
            changeState(currentState);
        }
    }

    // play state Function
    export function play(): void {
        // Declare new Game Container
        game = new createjs.Container();

        // Instantiate Game Objects
        background = new Background(stage, game);
        bullet = new Bullet(stage, game);
        plane = new Plane(stage, game);

        // Show Cursor
        stage.cursor = "none";

        // Create multiple clouds
        for (var count = 0; count < constants.CLOUD_NUM; count++) {
            clouds[count] = new Cloud(stage, game);
        }

        // Display Scoreboard
        scoreboard = new Scoreboard(stage, game);

        // Instantiate Collision Manager
        collision = new managers.Collision(plane, bullet, clouds, scoreboard);

        stage.addChild(game);
    }
}