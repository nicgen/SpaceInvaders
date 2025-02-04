import { BEAM, GAME } from "../utils/constants.js";

export default class Beam {
    constructor(gameContainer, startX, startY) {
        this.container = gameContainer;

        this.beam = document.createElement("div");
        this.beam.classList.add("beam");
        this.beam.style.width = `${BEAM.WIDTH}px`;
        this.beam.style.height = `${BEAM.HEIGHT}px`;
        this.beam.style.backgroundColor = BEAM.COLOR;
        this.container.appendChild(this.beam);

        // Position initiale du tir
        this.x = startX - BEAM.WIDTH / 2;
        this.y = startY;
        this.speedY = BEAM.VELOCITY.Y; //vitesse du tir

        this.render();
    }

    update() {
        this.y += this.speedY;

        if(this.y > GAME.HEIGHT) {
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
        this.beam.style.bottom = `${this.y}px`;
    }
}