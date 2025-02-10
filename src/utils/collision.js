

export default class CollisionManager {
    constructor(ship, EnemyFormation) {
        this.ship = ship;
        this.EnemyFormation = EnemyFormation;
        this.beams = [];
        this.initBeamTracking();
    }

    initBeamTracking() {
        setInterval(() => {
            this.checkCollisions();
        }, 50); // Vérifie les collisions toutes les 50ms
    }

    addBeam(beam) {
        this.beams.push(beam);
    }

    checkCollisions() {
        this.beams.forEach((beam, beamIndex) => {
            const beamRect = beam.getBoundingClientRect();

            this.EnemyFormation.enemies.forEach((enemy, enemyIndex) => {
                const enemyRect = enemy.getBoundingClientRect();

                if (this.isCollision(beamRect, enemyRect)) {
                    // Suppression de l’ennemi
                    enemy.remove();
                    this.EnemyFormation.enemies.splice(enemyIndex, 1);

                    // Suppression du tir
                    beam.remove();
                    this.beams.splice(beamIndex, 1);
                }
            });
        });
    }

    isCollision(rect1, rect2) {
        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }
}

window.CollisionManager = CollisionManager;
