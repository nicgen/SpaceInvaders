import {createMenu, createPauseMenu, createGameOverScreen} from './menu.js';
import { MENU_STYLE } from '../utils/constants.js';
import StateManager from './stateManager.js';
import Ship  from '../objects/player.js';
import InputHandler from '../utils/inputHandler.js';
import FPSManager from './FPSManager.js';

export default class Game {
    constructor() {
        this.stateManager = new StateManager();
        this.running = false;
        this.score = 0;

        this.gameContainer = document.getElementById('game-container');
        this.fpsManager = new FPSManager(60, 80);
        this.inputHandler = new InputHandler();

        this.ship = new Ship(this.gameContainer, this);
        this.beams = [];
        this.enemy = null;

        this.menuScreen = createMenu(() => this.startGame());
        this.pauseMenu = createPauseMenu(
            () => this.resumeGame(),
            () => this.restartGame()
        );
        this.gameOverScreen = createGameOverScreen(
            () => this.restartGame(),
            () => window.location.reload()
        );
        this.menuScreen.style.display = "block"; // Initially show the menu
    }

    startGame() {
        this.menuScreen.style.display = "none";
        this.stateManager.setRunning();
        this.running = true;
        this.score = 0;

        //player/enemies initialization

        this.gameLoop(performance.now());

        //adjust fontsize after the game launch
        this.adjustScoreboardFontSize();

        //adjust on window resize
        window.addEventListener('resize', () => this.adjustScoreboardFontSize());
    }

    adjustScoreboardFontSize() {
        const container = document.getElementById('scoreBoard-gameContainer');
        const scoreBoard = document.getElementById('scoreBoard');
    
        //calculate fontsize proportionnaly to the container's
        const fontSize = container.clientWidth * 0.03;

        //get all the elements of the scoreBoard
        const scoreBoardItems = scoreBoard.querySelectorAll('span');
    
        //adjust fontsize for each element
       scoreBoardItems.forEach(item => {
        item.style.fontSize = `${fontSize}px`;
       });
    }

    //game logic for key presse
    handleKeyPress() {
        if (this.inputHandler.isKeyPressed("ArrowLeft") && this.stateManager.isRunning()){
            this.ship.moveLeft();
        } else if (this.inputHandler.isKeyPressed("ArrowRight") && this.stateManager.isRunning()){
            this.ship.moveRight();
        }
        if (this.inputHandler.isKeyPressed(" ") && this.stateManager.isRunning() && this.ship.canShoot) {
            this.ship.shoot();
            this.ship.canShoot = false;
            setTimeout(() => this.ship.canShoot = true, this.ship.shootCooldown);

        }
        if (this.inputHandler.isKeyJustPressed("Escape")) {
            if (this.stateManager.isRunning()) {
                this.pauseGame();
            } else if (this.stateManager.isPaused()){
                this.resumeGame();
            }
        }
    }

    restartGame() {
        this.pauseMenu.style.display = "none";
        this.gameOverScreen.style.display = "none";
        this.stateManager.resetGame();
        this.startGame();
    }

    gameLoop(timestamp) {
        const dt = this.fpsManager.update(timestamp);

        if (this.running && dt > 0) {
            this.updateGame();
            this.renderGame();
        }

        this.handleKeyPress();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    // player/enemies movement mechanics
    updateGame() {
        this.beams.forEach((beam, index) => {
            beam.update();
            
            if (!beam.beam.parentElement){
                this.beams.splice(index, 1);
            }
        });
    }
    

    renderGame() {
        this.ship.render();
        this.beams.forEach((beam) => beam.render());
    }
 
    pauseGame() {
        this.running = false;
        this.stateManager.setPaused();
        this.pauseMenu.style.display = "block";
    }

    resumeGame() {
        this.running = true;
        this.stateManager.setRunning();
        this.pauseMenu.style.display = "none";

        //continue game loop
        this.gameLoop(performance.now());
    }

    gameOver() {
        this.running = false;
        this.stateManager.setGameOver();
        this.gameOverScreen.style.display = "none";
        document.getElementById("finalScore").textContent =`Score: ${this.score}`;
    }
}
