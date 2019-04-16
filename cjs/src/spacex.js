(function (window) {

    window.game = window.game || {}

    function OrbDestroyer() {
        this.initialize();
    }

    var p = OrbDestroyer.prototype;

    p.currentGameStateFunction;
    p.currentGameState;
    p.currentScene;

    p.initialize = function () {
        canvas = document.getElementById('canvas');
        stage = new createjs.Stage(canvas);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.on('tick', this.onTick, this);
        this.changeState(game.GameStates.MAIN_MENU);
    }
    p.changeState = function (state) {
        this.currentGameState = state;
        switch (this.currentGameState) {
            case game.GameStates.MAIN_MENU:
                this.currentGameStateFunction = this.gameStateMainMenu;
                break;
            case game.GameStates.LEVEL_1:
                this.currentGameStateFunction = this.gameStatelevel1;
                break;
            case game.GameStates.LEVEL_2:
                this.currentGameStateFunction = this.gameStateLevel2;
                break;
            case game.GameStates.LEVEL_3:
                this.currentGameStateFunction = this.gameStateLevel3;
                break;
			case game.GameStates.RUN_SCENE:
                this.currentGameStateFunction = this.gameStateRunScene;
                break;
            case game.GameStates.GAME_OVER:
                this.currentGameStateFunction = this.gameStateGameOver;
                break;
        }
    }
    p.onStateEvent = function (e, data) {
        this.changeState(data.state);
    }
    p.gameStateMainMenu = function () {
        var scene = new game.start();
        scene.on(game.GameStateEvents.GAME, this.onStateEvent, this, false, { state: game.GameStates.GAME });
        stage.addChild(scene);
        stage.removeChild(this.currentScene);
        this.currentScene = scene;
        this.changeState(game.GameStates.RUN_SCENE);
    }
    p.gameStatelevel1 = function () {
        var scene = new game.level1();
        scene.on(game.GameStateEvents.GAME_OVER, this.onStateEvent, this, false, { state: game.GameStates.GAME_OVER });
		scene.on(game.GameStateEvents.LEVEL_2, this.onStateEvent, this, false, { state: game.GameStates.LEVEL_2 });
        stage.addChild(scene);
        stage.removeChild(this.currentScene);
        this.currentScene = scene;
        this.changeState(game.GameStates.RUN_SCENE);
    }
	p.gameStatelevel2 = function () {
        var scene = new game.level2();
        scene.on(game.GameStateEvents.GAME_OVER, this.onStateEvent, this, false, { state: game.GameStates.GAME_OVER });
		scene.on(game.GameStateEvents.LEVEL_3, this.onStateEvent, this, false, { state: game.GameStates.LEVEL_3 });
        stage.addChild(scene);
        stage.removeChild(this.currentScene);
        this.currentScene = scene;
        this.changeState(game.GameStates.RUN_SCENE);
    }
	p.gameStateLevel3 = function () {
        var scene = new game.level3();
        scene.on(game.GameStateEvents.GAME_OVER, this.onStateEvent, this, false, { state: game.GameStates.GAME_OVER });
        stage.addChild(scene);
        stage.removeChild(this.currentScene);
        this.currentScene = scene;
        this.changeState(game.GameStates.RUN_SCENE);
    }
    p.gameStateGameOver = function () {
        var scene = new game.end();
        stage.addChild(scene);
        scene.on(game.GameStateEvents.MAIN_MENU, this.onStateEvent, this, false, { state: game.GameStates.MAIN_MENU });
        scene.on(game.GameStateEvents.GAME, this.onStateEvent, this, false, { state: game.GameStates.GAME });
        stage.removeChild(this.currentScene);
        this.currentScene = scene;
        this.changeState(game.GameStates.RUN_SCENE);
    }
    p.gameStateRunScene = function () {
        if (this.currentScene.run) {
            this.currentScene.run();
        }
    }
    p.run = function () {
        if (this.currentGameStateFunction != null) {
            this.currentGameStateFunction();
        }
    }
    p.onTick = function (e) {
        this.run();
        stage.update();
    }

    window.game.OrbDestroyer = OrbDestroyer;

}(window));