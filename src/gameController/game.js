import UIManager from './UIManager.js';
import StateManager from './stateManager.js';
import { Player } from '../objects/player.js';
import { Enemy } from '../objects/enemy.js';
import InputHandler from '../utils/inputHandler.js';

export default class Game {
    constructor() {
        this.gameContainer = document.getElementById('game-container');
        this.uiManager = new UIManager(this);
        this.stateManager = new StateManager();

        this.player = null;
        this.enemy = null;
        this.inputHandler = new InputHandler();

        this.init();
    }

    init() {
        this.uiManager.createMainMenu();
    }

    startGame() {
        this.uiManager.hideMainMenu();
        this.stateManager.setRunning();

        this.player = new Player(this.gameContainer);
        this.enemy = new Enemy(this.gameContainer);

        this.gameLoop();
    }

    gameLoop(){
        if (!this.stateManager.isRunning()) return;

        this.update();
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    udpate() {
        this.player.update(this.inputHandler.keys);
        this.enemy.update();

        if (this.player.isDestroyed()) {
            this.uiManager.showGameOverScreen(this.stateManager.score);
            this.stateManager.SetGameOver();
        }
    }

    render() {
        this.player.render();
        thie.enemy.render();
    }

    pauseGame() {
        this.stateManager.setPaused();
        this.uiManager.showPauseMenu();
    }

    resumeGame() {
        this.stateManager.setRunning();
        this.uiManager.hidePauseMenu();
        this.gameLoop();
    }
}

new Game();