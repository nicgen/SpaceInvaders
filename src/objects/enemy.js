import StateManager from '../gameController/stateManager.js'
export default class EnemyFormation {
    constructor(container) {
        this.container = container;
        this.enemies = [];
        this.rows = 3;
        this.cols = 2;
        this.enemyWidth = 40;
        this.enemyHeight = 40;
        this.spacing = 20;
        this.direction = 1; // 1 pour droite, -1 pour gauche
        this.speed = 7; // Vitesse du mouvement horizontal
        this.verticalStep = this.enemyHeight + this.spacing; // Distance à descendre
        this.createEnemies();
        this.startMoving();
        this.paused = false; // surely the gamestate should be used instead, but I don't know how?
    }

    createEnemies() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const enemy = document.createElement("div");
                enemy.classList.add("enemy");
                const x = col * (this.enemyWidth + this.spacing);
                const y = row * (this.enemyHeight + this.spacing);
                enemy.style.left = `${x}px`;
                enemy.style.top = `${y}px`;
                this.container.appendChild(enemy);
                this.enemies.push(enemy);
            }
        }
    }

    startMoving() {
        setInterval(() => {
            this.update();
        }, 5); // Intervalle de mise à jour (ajuste si nécessaire)
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
                // console.log('[AXIS Y]',y)
                // if (y > 520){
                //     console.log('GAME OVER')
                //     this.paused = true;
                // }
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

}

// window.EnemyFormation = EnemyFormation;
