import { ENEMY } from '../utils/constants.js';
export default class EnemyFormation {
    constructor(container) {
        this.container = container;
        this.enemies = [];
        this.rows = ENEMY.ROWS;
        this.cols = ENEMY.COLS;
        this.enemyWidth = ENEMY.WIDTH;
        this.enemyHeight = ENEMY.HEIGHT;
        this.spacing = ENEMY.SPACING;
        this.direction = 1; // 1 pour droite, -1 pour gauche
        this.speed = ENEMY.SPEED; // Vitesse du mouvement horizontal
        this.verticalStep = this.enemyHeight + this.spacing; // Distance à descendre
        this.createEnemies();
        this.startMoving();
        
        window.addEventListener('resize', () => this.updateEnemyDimensions());
    }

    createEnemies() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const enemy = document.createElement("div");
                enemy.classList.add("enemy");
                const x = col * (this.enemyWidth + this.spacing);
                const y = row * (this.enemyHeight + this.spacing);
                enemy.style.position = "absolute";
                enemy.style.left = `${x}px`;
                enemy.style.top = `${y}px`;
                enemy.style.width = `${this.enemyWidth}px`;
                enemy.style.height = `${this.enemyHeight}px`;
                this.container.appendChild(enemy);
                this.enemies.push(enemy);
            }
        }
    }

    updateEnemyDimensions() {
        this.enemies.forEach((enemy) => {
            enemy.style.width = `${ENEMY.WIDTH}px`;
            enemy.style.height = `${ENEMY.HEIGHT}px`;
        });
    }

    startMoving() {
        setInterval(() => {
            this.update();
        }, 15); // Intervalle de mise à jour (ajuste si nécessaire)
    }


    update() {
        if (this.paused) return; // no updates if paused (again, gamestate should be used instead)
        let moveDown = false;
        this.enemies.forEach((enemy) => {
            // console.log("ENEMY GROUP WIDTH",enemy.style.left + this.enemyWidth)
            let x = parseInt(enemy.style.left);
            if ((this.direction === 1 && x + this.enemyWidth >= this.container.clientWidth) ||
                (this.direction === -1 && x <= 0)) {
                moveDown = true;
            }
        });

        if (moveDown) {
            this.enemies.forEach((enemy) => {
                let y = parseInt(enemy.style.top);
                y += this.verticalStep;
                enemy.style.top = `${y}px`;
                
                if (y + this.enemyHeight >= this.container.clientHeight) {
                    console.log('GAME OVER');
                    this.pause();
                }
            });
            this.direction *= -1; // Swap direction
        } else {
            this.enemies.forEach((enemy) => {
                let x = parseInt(enemy.style.left);
                x += this.direction * this.speed;
                enemy.style.left = `${x}px`;
            });
        }
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    clearEnemies() {
        this.enemies.forEach(enemy => enemy.remove());
        this.enemies = [];
        this.createEnemies();
    }

}

// window.EnemyFormation = EnemyFormation;
