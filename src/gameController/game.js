import {createMenu, createPauseMenu, createGameOverScreen} from './menu.js';
import StateManager from './stateManager.js';
import Ship  from '../objects/player.js';
import InputHandler from '../utils/inputHandler.js';
import FPSManager from './FPSManager.js';
import EnemyFormation from '../objects/enemy.js'
// import { SHIP, BEAM, GAME } from "../utils/constants.js";

export default class Game {
    constructor() {
        this.stateManager = new StateManager();
        this.running = false;
        this.score = 0;
        this.fpsManager = new FPSManager(); // Initialize FPS Manager
        this.gameContainer = document.getElementById('game-container');
        this.inputHandler = new InputHandler();
        this.ship = new Ship(this.gameContainer, this);
        this.beams = [];
        this.enemy = null;

        // this.enemies = new EnemyFormation(this.gameContainer);

        this.menuScreen = createMenu(() => this.startGame());
        this.pauseMenu = createPauseMenu(
            () => this.resumeGame(),
            () => this.restartGame(),
            () => this.toggleFPSDisplay()
        );
        this.gameOverScreen = createGameOverScreen(
            () => this.restartGame(),
            () => window.location.reload()
        );
        this.menuScreen.style.display = "block"; // Initially show the menu

        // A reference to the animation frame request (used to stop it during pause)
        this.animationFrameRequest = null;

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.handlePauseResume();
            }
        });

        this.gameLoop(performance.now());

        // add enemy formation
        this.enemies = new EnemyFormation(this.gameContainer);

        this.enemies.pause();
    }

     handlePauseResume() {
        if (this.stateManager.isRunning()) {
            this.pauseGame();
        } else if (this.stateManager.isPaused()) {
            this.resumeGame();
        }
    }

    startGame() {
        this.menuScreen.style.display = "none";
        this.stateManager.setRunning();
        this.running = true;
        this.score = 0;

        this.enemies.resume();

        // Player/enemies initialization

        this.gameLoop(performance.now());
        this.adjustScoreboardFontSize();

        window.addEventListener('resize', () => this.adjustScoreboardFontSize());
    }

    adjustScoreboardFontSize() {
        const container = document.getElementById('scoreBoard-gameContainer');
        const scoreBoard = document.getElementById('scoreBoard');
    
        const fontSize = container.clientWidth * 0.03;
        const scoreBoardItems = scoreBoard.querySelectorAll('span');
    
        scoreBoardItems.forEach(item => {
            item.style.fontSize = `${fontSize}px`;
        });
    }

    handleKeyPress() {
        if (this.inputHandler.isKeyPressed("ArrowLeft") && this.stateManager.isRunning()) {
            this.ship.moveLeft();
        } else if (this.inputHandler.isKeyPressed("ArrowRight") && this.stateManager.isRunning()) {
            this.ship.moveRight();
        } else if (this.inputHandler.isKeyPressed("ArrowUp" ) && this.stateManager.isRunning()) {
            this.ship.moveUp();
        } else if (this.inputHandler.isKeyPressed("ArrowDown") && this.stateManager.isRunning()) {
            this.ship.moveDown();
        }
        if (this.inputHandler.isKeyPressed(" ") && this.stateManager.isRunning() && this.ship.canShoot) {
            this.ship.shoot();
            this.ship.canShoot = false;
            setTimeout(() => this.ship.canShoot = true, this.ship.shootCooldown);
        }
    }

    restartGame() {
        console.log('RESTART GAME')
        // problem, doesnt restart the game
        this.pauseMenu.style.display = "none";
        this.gameOverScreen.style.display = "none";
        this.stateManager.resetGame();
        this.startGame();
    }

    gameLoop(timestamp) {
        const dt = this.fpsManager.update(timestamp); // Update FPS Manager

        if (this.running && dt > 0) {
            this.updateGame();
            this.renderGame();
        }

        this.handleKeyPress();

        // Request the next animation frame only if the game is running
        if (this.running) {
            this.animationFrameRequest = requestAnimationFrame((ts) => this.gameLoop(ts));
        }
    }

    updateGame() {
        // console.log(`[ENEMIES]: ${this.enemies.enemyWidth}/${this.enemies.update}`)
        this.beams.forEach((beam, index) => {

            // this.enemies.checkCollisions(beam);

            beam.update();
            
            if (!beam.beam.parentElement) {
                this.beams.splice(index, 1);
            }
        });
        // Add collision check
        this.checkCollisions();
    }

    renderGame() {
        this.ship.render();
        this.beams.forEach((beam) => beam.render());
    }

    toggleFPSDisplay() {
        this.fpsManager.toggleFPSDisplay(); // Toggle FPS visibility
    }

    pauseGame() {
        this.running = false;  // Stop game loop
        this.stateManager.setPaused();
        this.pauseMenu.style.display = "block";
        this.enemies.pause();
        // Cancel the ongoing animation frame when paused
        cancelAnimationFrame(this.animationFrameRequest);
    }

    resumeGame() {
        this.running = true;  // Continue game loop
        this.stateManager.setRunning();
        this.pauseMenu.style.display = "none";
        this.enemies.resume();
        // Restart the game loop with the next frame
        this.gameLoop(performance.now());
    }

    gameOver() {
        this.running = false;
        // this.stateManager.setPaused();
        this.stateManager.setGameOver();
        this.enemies.pause();

        this.gameOverScreen.style.display = "block";
        cancelAnimationFrame(this.animationFrameRequest);
        // document.getElementById("finalScore").textContent = `Score: ${this.score}`;
    }

    // Add these methods to the Game class
    checkCollisions() {
        // Beam to Enemy Collisions
        this.beams.forEach((beam, beamIndex) => {
            this.enemies.enemies.forEach((enemy, enemyIndex) => {
                if (this.isColliding(beam.beam, enemy)) {
                    // Remove beam
                    beam.remove();
                    this.beams.splice(beamIndex, 1);

                    // Remove enemy
                    enemy.remove();
                    this.enemies.enemies.splice(enemyIndex, 1);

                    // Increment score
                    this.score += 10;
                }
            });
        });

        // Enemy to Ship Collision
        this.enemies.enemies.forEach(enemy => {
            if (this.isColliding(this.ship.ship, enemy)) {
                this.gameOver();
            }
        });
    }

    isColliding(rect1, rect2) {
        const r1 = rect1.getBoundingClientRect();
        const r2 = rect2.getBoundingClientRect();

        return !(
            r1.top > r2.bottom ||
            r1.bottom < r2.top ||
            r1.right < r2.left ||
            r1.left > r2.right
        );
    }
}