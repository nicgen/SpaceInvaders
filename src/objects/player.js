import { SHIP, GAME } from "../utils/constants.js";
import Beam from "./projectile.js";

export default class Ship {                                               /*creation de de notre vaisseau qu'on viens mettre dans container(game-container)*/
        constructor(gameContainer, game, shootSound) {
            this.container = gameContainer;
            this.game = game;

            //Create the svg ship
            this.ship = document.createElement("object");
            this.ship.data = "../../img/ship.svg";
            this.ship.type = "image/svg+xml";
            this.ship.id = "ship";
            this.ship.style.position = "absolute";
            this.container.appendChild(this.ship);

            console.log(this.ship);

            this.updateShipDimensions();
            this.setInitialPosition();

            this.ship.style.bottom = '1px';

            this.shipX = (GAME.WIDTH - SHIP.WIDTH) / 2;  /*positionnement de notre vaisseau au centre de notre container*/
            this.shipY = 0;
            this.speed = SHIP.SPEED;
            this.shootCooldown = SHIP.SHOOT_COOLDOWN; 
            this.canShoot = true;

            this.shootSound = shootSound;
        
            this.render();                                 /*initialisation de la fonction l'affichage de notre vaisseau */

            //resize listener to handle dynamic scaling
            window.addEventListener('resize', () => {
                this.updateShipDimensions();
            });
        }

        updateShipDimensions() {
            this.ship.style.width = `${SHIP.WIDTH}px`;
            this.ship.style.height = `${SHIP.HEIGHT}px`;
        }

        setInitialPosition() {
            this.shipX = (this.container.clientWidth - SHIP.WIDTH) / 2;
            this.shipY = 0;;
        }

        moveLeft() {                                            /*Déplacement du vaisseau vers la gauche*/
            this.shipX = Math.max(0, this.shipX - this.speed);
            this.render();
        }

        moveRight() {                                           /*Déplacement du vaisseau vers la droite*/
            this.shipX = Math.min(this.container.clientWidth - this.ship.clientWidth, this.shipX + this.speed);
            this.render();
        }

        moveUp() {
            this.shipY = Math.min(this.container.clientHeight - this.ship.clientHeight, this.shipY + this.speed);
            this.render();
        }

        moveDown() {
            this.shipY = Math.max(0, this.shipY - this.speed);
            this.render();
        }

        shoot() {
            if (!this.canShoot) return;

            this.shootSound.currentTime = 0;
            this.shootSound.play();

            const beam = new Beam(
                this.container,
                this.shipX + SHIP.WIDTH / 2,
                parseInt(this.ship.style.bottom) + SHIP.HEIGHT
            );

            this.game.beams.push(beam);
            this.canShoot = false;

            setTimeout(() => {this.canShoot = true}, this.shootCooldown);
        }

        render() {                                      //renvoi le visuel
            this.ship.style.left = `${this.shipX}px`;
            this.ship.style.bottom = `${this.shipY}px`;
        }
    }


