import { ENEMY } from '../utils/constants.js';
import Enemy from './enemy.js';

export default class EnemyFormation {
    constructor(container) {
        this.container = container;
        this.enemies = [];
        this.rows = ENEMY.ROWS;
        this.cols = ENEMY.COLS;
        this.enemyWidth = ENEMY.WIDTH;
        this.enemyHeight = ENEMY.HEIGHT;
        this.spacing = ENEMY.SPACING;
        this.direction = 1; // 1 for right, -1 for left
        this.speed = ENEMY.SPEED;
        this.verticalStep = this.enemyHeight + this.spacing;
        this.paused = false;

        this.createEnemies();
        this.startMoving();

        window.addEventListener('resize', () => this.updateEnemyDimensions());
    }

    createEnemies() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const enemy = new Enemy(this.container, row, col, this);
                this.enemies.push(enemy);
            }
        }
    }

    updateEnemyDimensions() {
        this.enemies.forEach((enemy) => {
            enemy.element.style.width = `${ENEMY.WIDTH}px`;
            enemy.element.style.height = `${ENEMY.HEIGHT}px`;
        });
    }

    startMoving() {
        setInterval(() => {
            this.update();
        }, 15);
    }

    update() {
        if (this.enemies.length === 0) {
            this.pause();
            return;
        }

        if (this.paused) return;

        console.log(`[ENEMIES] ${this.enemies}`)

        let moveDown = false;
        this.enemies.forEach((enemy) => {
            let x = parseInt(enemy.element.style.left);
            if ((this.direction === 1 && x + this.enemyWidth >= this.container.clientWidth) ||
                (this.direction === -1 && x <= 0)) {
                moveDown = true;
            }
        });

        if (moveDown) {
            this.enemies.forEach((enemy) => {
                let y = parseInt(enemy.element.style.top);
                y += this.verticalStep;
                enemy.y = y;
                enemy.element.style.top = `${y}px`;

                if (y + this.enemyHeight >= this.container.clientHeight) {
                    console.log('GAME OVER');
                    this.pause();
                }
            });
            this.direction *= -1;
        } else {
            this.enemies.forEach((enemy) => {
                let x = parseInt(enemy.element.style.left);
                x += this.direction * this.speed;
                enemy.x = x;
                enemy.element.style.left = `${x}px`;
            });
        }

        // update all the enemies
        this.enemies.forEach(enemy => {
            enemy.update();
        });
    }

    pause() {
        this.paused = true;
        this.enemies.forEach(enemy => enemy.stopShooting());
    }

    resume() {
        this.paused = false;
        this.enemies.forEach(enemy => enemy.startShooting());
    }

    clearEnemies() {
        this.enemies.forEach(enemy => {
            enemy.beams.forEach(beam => beam.remove());
            enemy.stopShooting();
            enemy.remove();    
        });
        this.enemies = [];
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }
}
