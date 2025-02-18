import {createMenu, createPauseMenu, createGameOverScreen} from './menu.js';
import StateManager from './stateManager.js';
import Ship  from '../objects/player.js';
import InputHandler from '../utils/inputHandler.js';
import FPSManager from './FPSManager.js';
import EnemyFormation from '../objects/enemyFormation.js'
import { GAME, SHIP, ENEMY_FORMATION, ENEMY } from '../utils/constants.js';
import LifeManager from './life.js';
import Timer from './timer.js';
import { createPixiApp } from '../animation/pixiSetup.js';
import { playIntroAnimation } from '../animation/gameAnimations/introductionAnimation.js';

export default class Game {
    constructor() {
        // First, get DOM elements
        this.gameContainer = document.getElementById('game-container');
        this.scoreContainer = document.getElementById('score');
        this.backGroundMusic = document.getElementById("backGroundMusic");

        // Then initialize PIXI
        this.app = null;

        // Initialize managers
        this.stateManager = new StateManager();
        this.fpsManager = new FPSManager();
        this.timer = new Timer("timer", 30, (state) => this.gameOver(state));

        // Set up game state
        this.running = false;
        this.score = 0;

        // Audio setup
        this.backGroundMusic.volume = 0.2;
        this.shootSound = new Audio('../../sound/laser-gun.mp3');
        this.shootSound.volume = 0.08;

        //Beam initialization
        this.beams = [];
        this.enemyBeams = [];

        // Create UI elements
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

        // Hide the menu initially
        this.menuScreen.style.display = "none";

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.handlePauseResume();
            }
        });

        this.init();
    }

    // Async init method to initialize PixiJS and other game objects
    async init() {
        this.app = await createPixiApp(); // Wait for the PixiJS app to initialize

        // Add event listener for window resize
        window.addEventListener('resize', this.onResize.bind(this));

        // Play intro animation, and once it finishes, show the menu screen
        playIntroAnimation(this.app, () => {
            this.startGameAfterIntro(); // Callback to start the game after the intro animation
        });
    }

    onResize() {
        // Resize the renderer to match the new window size
        this.app.renderer.resize(GAME.WIDTH, GAME.HEIGHT);
    
        // You may want to adjust any UI elements that rely on the canvas size as well
        this.adjustScoreboardFontSize();
    }

    // This function initializes the game and starts the game loop after intro animation
    startGameAfterIntro() {
        console.log("Intro animation finished. Initializing game objects...");

        // Initialize all game objects AFTER the intro animation
        this.inputHandler = new InputHandler();
        this.selectedSkin = localStorage.getItem("enemySkin") || "default";

        // Initialize the ship after the intro animation
        this.ship = new Ship(this.gameContainer, this, this.shootSound);

        // Initialize enemies after the intro animation
        this.enemies = new EnemyFormation(this.gameContainer, ENEMY_FORMATION.V_SHAPE, this.getEnemySkin());
        this.enemies.pause(); // Keep enemies paused until game starts

        // Initialize life manager
        this.lifeManager = new LifeManager(3);
        this.lifeManager.setGameOverCallback((state) => this.gameOver(state));

        // Add event listeners for pausing/resuming
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.handlePauseResume();
            }
        });

        // Show the menu after the intro animation
        this.menuScreen.style.display = "block";
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

        this.timer.start();

        this.backGroundMusic.play();

        if (this.enemies) {
            this.enemies.resume();
        }

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

        const lifeIcons = document.querySelectorAll('.life-icon');
        lifeIcons.forEach(icon => {
            icon.style.width = `${fontSize * 1.1}px`;
            icon.style.height = `${fontSize * 1.1}px`;       
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
        this.pauseMenu.style.display = "none";
        this.gameOverScreen.style.display = "none";
        
        this.timer.reset();
        this.timer.start();

        this.stateManager.resetGame();
        this.running = false;
        this.score = 0;

        // Destroy old ship and enemies before reinitializing
        if (this.ship) this.ship.destroy(); 
        if (this.enemies) this.enemies.clearEnemies();

        //clear beams/enemies
        this.beams.forEach(beam => beam.remove());
        this.beams = [];
        this.enemyBeams.forEach(beam => beam.remove());
        this.enemyBeams = [];

        // Remove old elements from DOM
        document.querySelectorAll(".enemy").forEach(e => e.remove());
        document.querySelectorAll(".beam").forEach(b => b.remove());

        //reset ship
        this.ship.shipX = GAME.WIDTH / 2 - SHIP.WIDTH;
        this.ship.shipY = 0;
        this.ship.render();

        //reset lifeManager
        this.lifeManager.reset();
        this.lifeManager.setGameOverCallback(() => this.gameOver());

        //Reset enemies
        this.enemies.clearEnemies();
        this.enemies = new EnemyFormation(this.gameContainer);
        this.enemies.pause();

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
        // Update player beams
        this.beams = this.beams.filter(beam => {
            beam.update();
            return beam.beam.parentElement !== null;  // Remove if it's no longer in the DOM
        });

        // Ensure enemyBeams exists before updating
        if (this.enemyBeams) {
            this.enemyBeams = this.enemyBeams.filter(beam => {
                beam.update();
                return beam.beam.parentElement !== null;  // Remove if it's no longer in the DOM
            });
        }
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
        this.timer.stop();
        this.stateManager.setPaused();
        this.pauseMenu.style.display = "block";
        this.enemies.pause();

        this.backGroundMusic.pause();
        this.shootSound.pause();
        // Cancel the ongoing animation frame when paused
        cancelAnimationFrame(this.animationFrameRequest);
    }

    resumeGame() {
        this.running = true;  // Continue game loop
        this.timer.resume();
        this.stateManager.setRunning();
        this.pauseMenu.style.display = "none";
        this.enemies.resume();

        this.backGroundMusic.play();
        this.shootSound.play();
        // Restart the game loop with the next frame
        this.gameLoop(performance.now());
    }

    gameOver(state = null) {
        // console.log("gameOver", state);
        this.running = false;
        this.timer.stop();
        this.stateManager.setGameOver();
        this.enemies.pause();

        //remove all remaining beams
        this.enemyBeams.forEach(beam => beam.remove());
        this.enemyBeams = [];

        // Display the game over screen
        this.gameOverScreen.style.display = "block";

        if (state === 'win') {
            console.log(`You won!`);
        } else if (state === 'loose') {
            console.log(`You loose!`);
        }

        cancelAnimationFrame(this.animationFrameRequest);
        // document.getElementById("finalScore").textContent = `Score: ${this.score}`;
    }

    checkCollisions() {
        // shipBeam hitting enemies
        this.beams.forEach((beam, beamIndex) => {
            this.enemies.enemies.forEach((enemy, enemyIndex) => {
                if (this.isColliding(beam.beam, enemy.element)) {
                    beam.remove();
                    this.beams.splice(beamIndex, 1);
                    enemy.remove();
                    this.enemies.enemies.splice(enemyIndex, 1);
                    // Increment score
                    this.score += 10;
                    this.scoreContainer.textContent = `Score: ${this.score}`;
                }
            });
        });

        // Enemy/Ship Collision
        this.enemies.enemies.forEach(enemy => {
            // Check enemy body collision
            if (this.isColliding(this.ship.ship, enemy.element)) {
                this.lifeManager.loseLife();
                enemy.remove();
            }

            // Check enemy beams collision with player
            this.enemyBeams.forEach((beam, beamIndex) => {
                if (this.isColliding(beam.beam, this.ship.ship)) {
                    beam.remove();
                    this.enemyBeams.splice(beamIndex, 1);
                    this.lifeManager.loseLife();
                }
            });
        });
    }

    isColliding(rect1, rect2) {
        // If rect2 is an EnemyFormation instance, use its element
        const element2 = rect2.element || rect2;

        const r1 = rect1.getBoundingClientRect();
        const r2 = element2.getBoundingClientRect();

        return !(
            r1.top > r2.bottom ||
            r1.bottom < r2.top ||
            r1.right < r2.left ||
            r1.left > r2.right
        );
    }

    getEnemySkin() {
        return ENEMY.SKINS[this.selectedSkin] || ENEMY.SKINS.default;
    }

}