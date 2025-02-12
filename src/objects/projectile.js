import { BEAM, GAME } from "../utils/constants.js";

export default class Beam {
    constructor(gameContainer, startX, startY, isEnemyBeam = false) {
        this.container = gameContainer;
        this.isEnemyBeam = isEnemyBeam;

        this.beam = document.createElement("div");
        this.beam.classList.add("beam");
        if (isEnemyBeam) {
            this.beam.classList.add("enemy-beam");
        }
        this.beam.style.width = `${BEAM.WIDTH}px`;
        this.beam.style.height = `${BEAM.HEIGHT}px`;
        this.beam.style.backgroundColor = isEnemyBeam ? "red" : BEAM.COLOR;
        this.container.appendChild(this.beam);

        // Position initiale du tir
        this.x = startX - BEAM.WIDTH / 2;
        this.y = startY;
        this.speedY = isEnemyBeam ? BEAM.VELOCITY.Y : -BEAM.VELOCITY.Y; // Invert speed for enemy beams
        this.render();
    }

    update() {
        this.y += this.speedY;

        if ((this.isEnemyBeam && this.y < 0) || (!this.isEnemyBeam && this.y > GAME.HEIGHT)) {
            this.remove();
        } else {
            this.render();
        }
    }

    remove() {
        this.beam.remove();
    }

    render() {
        this.beam.style.left = `${this.x}px`;
        this.beam.style.top = `${this.y}px`;
    }

}