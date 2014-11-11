/// <reference path="../managers/collision.ts" />
/// <reference path="../constants.ts" />
/// <reference path="../game.ts" />

module states {
    export function playButtonClicked(event: MouseEvent) {
        stage.removeChild(game);
        plane.destroy();
        game.removeAllChildren();
        game.removeAllEventListeners();
        currentState = constants.PLAY_STATE;
        changeState(currentState);
    }

    export function menuState() {
        background.update();
        plane.update();
    }

    export function menu() {
        var gameNameLabel: Label;

        // Declare new Game Container
        game = new createjs.Container();

        // Instantiate Game Objects
        background = new Background(stage, game);
        plane = new Plane(stage, game);

        // Show Cursor
        stage.cursor = "default";

        // Display Game Over
        gameNameLabel = new Label(stage.canvas.width / 2, 40, "MAIL PILOT");
        game.addChild(gameNameLabel);

        // Display Play Again Button
        playButton = new Button(stage.canvas.width / 2, 300, "playButton");
        game.addChild(playButton);
        playButton.addEventListener("click", playButtonClicked);

        stage.addChild(game);
    }
} 