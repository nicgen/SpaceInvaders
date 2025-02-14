import {ENEMY, ENEMY_BEHAVIOR, SCORE} from "../utils/constants.js";
import Beam from "./projectile.js";

export default class Enemy {
    constructor(container, row, col, formation, x, y) {
        this.container = container;
        this.formation = formation;
        this.row = row;
        this.col = col;
        this.x = x;
        this.y = y;

        // Create the enemy element
        this.element = document.createElement("div");
        this.element.classList.add("enemy");

        // Shooting properties
        this.canShoot = true;
        this.shootingInterval = null;
        this.beams = [];

        this.setupElement();
        this.startShooting();
    }

    setupElement() {
        this.element.style.position = "absolute";
        this.element.style.backgroundColor= ENEMY.COLOR;
        this.element.style.width = `${ENEMY.WIDTH}px`;
        this.element.style.height = `${ENEMY.HEIGHT}px`;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        this.container.appendChild(this.element);
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    startShooting() {
        this.shootingInterval = setInterval(() => {
            if (this.canShoot && Math.random() < ENEMY_BEHAVIOR.SHOOT_PROBABILITY) { 
                this.shoot();
            }
        }, ENEMY_BEHAVIOR.RANDOM_SHOOTING_INTERVAL);
    }

    shoot() {
        if (!this.canShoot || this.formation.paused) return;

        const beam = new Beam(this.container, this.x + (ENEMY.WIDTH / 2), this.y + ENEMY.HEIGHT, true);
         
        //add beam to the game's tracking system
        if (window.game) {
            window.game.enemyBeams.push(beam);
        }

        // Add cooldown
        this.canShoot = false;
        setTimeout(() => {
            this.canShoot = true;
        }, ENEMY_BEHAVIOR.SHOOT_COOLDOWN);
    }

    stopShooting() {
        if (this.shootingInterval) {
            clearInterval(this.shootingInterval);
            this.shootingInterval = null;
        }
    }

    update() {
        // Update beams
        this.beams.forEach((beam, index) => {
            beam.update();

            // Remove beam if it's no longer in the DOM
            if (!beam.beam.parentElement) {
                this.beams.splice(index, 1);
            }
        });
    }

    remove() {
        this.stopShooting();
        this.element.remove()

        if (window.game) {
            window.game.score += SCORE.ENEMY_HIT;
            }
    }
}