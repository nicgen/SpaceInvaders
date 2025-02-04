// enemy.js
class EnemyFormation {
    constructor(container) {
        this.container = container;
        this.enemies = [];
        this.rows = 3;
        this.cols = 8;
        this.enemyWidth = 40;
        this.enemyHeight = 40;
        this.spacing = 20;
        this.direction = 1; // 1 pour droite, -1 pour gauche
        this.speed = 1;
        this.createEnemies();
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

    update() {
        const moveDown = this.shouldMoveDown();
        this.enemies.forEach((enemy) => {
            let x = parseInt(enemy.style.left);
            let y = parseInt(enemy.style.top);
            if (moveDown) {
                y += this.enemyHeight;
                this.direction = -1;
                this.speed += 0.1; // Augmente la vitesse à chaque descente
            } else {
                x += this.direction * this.speed;
            }
            enemy.style.left = `${x}px`;
            enemy.style.top = `${y}px`;
        });
    }

    shouldMoveDown() {
        for (const enemy of this.enemies) {
            const x = parseInt(enemy.style.left);
            if ((this.direction === 1 && x + this.enemyWidth >= this.container.clientWidth) ||
                (this.direction === -1 && x <= 0)) {
                return true;
            }
        }
        return false;
    }
}
