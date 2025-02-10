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
        this.speed = 10; // Vitesse du mouvement horizontal
        this.verticalStep = 20; // Distance à descendre
        this.createEnemies();
        this.startMoving();
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
        }, 500); // Intervalle de mise à jour (ajuste si nécessaire)
    }

    update() {
        let moveDown = false;

        this.enemies.forEach((enemy) => {
            let x = parseInt(enemy.style.left);
            if ((this.direction === 1 && x + this.enemyWidth >= this.container.clientWidth) ||
                (this.direction === -1 && x <= 0)) {
                moveDown = true;
            }
        });

        this.enemies.forEach((enemy) => {
            let x = parseInt(enemy.style.left);
            let y = parseInt(enemy.style.top);
            if (moveDown) {
                y += this.verticalStep;
                this.direction *= -1; // Change de direction après descente
            } else {
                x += this.direction * this.speed;
            }
            enemy.style.left = `${x}px`;
            enemy.style.top = `${y}px`;
        });
    }
}

window.EnemyFormation = EnemyFormation;
