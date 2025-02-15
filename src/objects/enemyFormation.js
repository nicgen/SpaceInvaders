import { ENEMY, ENEMY_BEHAVIOR, ENEMY_FORMATION } from '../utils/constants.js';
import Enemy from './enemy.js';

export default class EnemyFormation {
    constructor(container, formationType = ENEMY_FORMATION.GRID, skinType = 'default') {
        this.container = container;
        this.enemies = [];
        this.formationType = formationType;
        this.formation = formationType;
        this.skinType = skinType;

        const formationConfig = formationType || ENEMY_FORMATION.GRID;
        this.rows =formationConfig.ROWS || ENEMY.ROWS;
        this.cols = formationConfig.COLS || ENEMY.COLS;
        this.spacing = formationConfig.SPACING || ENEMY.SPACING;

        this.enemyWidth = ENEMY.WIDTH;
        this.enemyHeight = ENEMY.HEIGHT;
        this.direction = ENEMY_BEHAVIOR.INITIAL_DIRECTION;; // 1 for right, -1 for left
        this.speed = ENEMY.SPEED;
        this.verticalStep = this.enemyHeight + this.spacing;
        this.paused = false;

        this.createEnemies();

        window.addEventListener('resize', () => this.updateEnemyDimensions());
    }

    createEnemies() {
        const centerX  = this.container.clientWidth / 2; 
        const startY = 50; //starting position for the first row 

        for (let row = 0; row < this.rows; row++) {
            const y = startY + row * (this.enemyHeight + this.spacing);
            for (let col = 0; col < this.cols; col++) {
                let x;

                switch (this.formationType) {
                    case ENEMY_FORMATION.V_SHAPE:
                        const numEnemiesInRows = this.cols - row * 2;
                        if (numEnemiesInRows <= 0) return;
                        if (col >= numEnemiesInRows) continue;
                        const offset = (col - (numEnemiesInRows - 1) / 2) * (this.enemyWidth + this.spacing); 
                        x = centerX + offset;
                        break;
                    case ENEMY_FORMATION.LINE:
                        x = centerX + (col - this.cols / 2) * (this.enemyWidth + this.spacing);
                        break;
                    case ENEMY_FORMATION.GRID:
                        x = centerX + (col - this.cols / 2) * (this.enemyWidth + this.spacing);
                        break;
                }
                const enemy = new Enemy(this.container, row, col, this, x, y);
                this.enemies.push(enemy);
            }
        }
        this.startMoving();
    }

    updateEnemyDimensions() {
        this.enemies.forEach((enemy) => {
            enemy.element.style.width = `${ENEMY.WIDTH}px`;
            enemy.element.style.height = `${ENEMY.HEIGHT}px`;
        });
    }

    startMoving() {
        if (this.enemies.length === 0) return;
        setInterval(() => {
            this.update();
        }, ENEMY_BEHAVIOR.MOVEMENT_SPEED_INTERVAL);
    }

    update() {
        if (this.enemies.length === 0) {
            this.pause();
            return;
        }

        if (this.paused) return;

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
            enemy.stopShooting();
            enemy.remove();
            this.enemies.splice(index, 1);
        }
    }
}
