import { SHIP, GAME } from "../utils/constants.js";
import Beam from "./projectile.js";

export default class Ship {                                               /*creation de de notre vaisseau qu'on viens mettre dans container(game-container)*/
        constructor(gameContainer, game) {
            this.container = gameContainer;
            this.game = game;
            this.ship = document.getElementById("ship");

            this.updateShipDimensions();

            this.ship.style.bottom = '1px';

            this.shipX = GAME.WIDTH / 2 - SHIP.WIDTH;  /*positionnement de notre vaisseau au centre de notre container*/
            
            this.speed = SHIP.SPEED;
            this.shootCooldown = SHIP.SHOOT_COOLDOWN; 
            this.canShoot = true;
        
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

        moveLeft() {                                            /*Déplacement du vaisseau vers la gauche*/
            this.shipX = Math.max(0, this.shipX - this.speed);
            this.render();
        }

        moveRight() {                                           /*Déplacement du vaisseau vers la droite*/
            this.shipX = Math.min(this.container.clientWidth - this.ship.clientWidth, this.shipX + this.speed);
            this.render();
        }

        shoot() {
            if (!this.canShoot) return;

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
        }
    }


