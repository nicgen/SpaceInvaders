import {ENEMY} from "../utils/constants.js";
import Beam from "./projectile.js";

export default class Enemy {
    constructor(container, row, col, formation) {
        this.container = container;
        this.formation = formation;
        this.row = row;
        this.col = col;

        // Create the enemy element
        this.element = document.createElement("div");
        this.element.classList.add("enemy");

        // Set initial position
        this.x = col * (ENEMY.WIDTH + ENEMY.SPACING);
        this.y = row * (ENEMY.HEIGHT + ENEMY.SPACING);

        // Shooting properties
        this.canShoot = true;
        this.shootingInterval = null;
        this.beams = [];

        this.setupElement();
        this.startShooting();
    }

    setupElement() {
        this.element.style.position = "absolute";
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
        // Random interval between 2 and 5 seconds
        const randomInterval = Math.random() * (5000 - 2000) + 2000;

        this.shootingInterval = setInterval(() => {
            if (this.canShoot && Math.random() < 0.8) { // 30% chance to shoot
                this.shoot();
            }
        }, randomInterval);
    }

    shoot() {
        if (!this.canShoot) return;

        const beam = new Beam(this.container, this.x + (ENEMY.WIDTH / 2), this.y + ENEMY.HEIGHT, true);
        this.beams.push(beam);

        // Add cooldown
        this.canShoot = false;
        setTimeout(() => {
            this.canShoot = true;
        }, 1000);
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
        this.element.remove();
        // Clear any active beams
        this.beams.forEach(beam => beam.remove());
        this.beams = [];

        // Remove beams from the global tracking system (if necessary)
        if (window.game) {
            window.game.enemyBeams = window.game.enemyBeams.filter(b => !this.beams.includes(b));
            }

        if (window.game) {
            window.game.score += SCORE.ENEMY_HIT;
            }
        }
}