class Ship {                                               /*creation de de notre vaisseau qu'on viens mettre dans container(game-container)*/
        constructor(container) {
            this.container = container;
            this.ship = document.createElement("div");
            this.ship.classList.add("ship");
            this.container.appendChild(this.ship);

            this.speed = 20;                              /*vitesse de notre vaisseau en px*/
            this.shipX = this.container.clientWidth / 2 - this.ship.clientWidth / 2;  /*positionnement de notre vaisseau au centre de notre container*/


            this.canShoot = true;
            this.shootCooldown = 500;  //Délai de ms pour éviter de spam les tir

            this.keys = {}; // Stocke les touches pressées

            this.initControls();                          /*initialisation de la fonction qui controle notre vaisseau*/
            this.render();                                 /*initialisation de la fonction l'affichage de notre vaisseau */
        }

        initControls() {                                   /*fonction mouvement vaisseau */
            document.addEventListener("keydown", (event) => {
                if (event.key === "ArrowLeft") {
                    this.moveLeft();
                } else if (event.key === "ArrowRight") {
                    this.moveRight();
                } else if (event.key === " " && this.canShoot) {
                    this.shoot();
                    this.canShoot = false;
                    setTimeout(() => this.canShoot = true, this.shootCooldown);
                }
            });
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
            new Beam(this.container, this.shipX + this.ship.clientWidth / 2);
        }

        render() {                                      //renvoi le visuel
            this.ship.style.left = this.shipX + "px";
        }
    }

    class Beam {
        constructor(container, xPosition) {
            this.container = container;
            this.beam = document.createElement("div");
            this.beam.classList.add("beam");
            this.container.appendChild(this.beam);
    
            // Position initiale du tir
            this.beam.style.left = `${xPosition}px`;
            this.beam.style.bottom = "30px"; // Part du vaisseau
    
            this.speed = 5; //vitesse du tir
            this.moveBeam();
        }
    
        moveBeam() {
            const interval = setInterval(() => { //anime le tir toutes les 20ms
                const beamY = parseInt(this.beam.style.bottom);
                if (beamY >= this.container.clientHeight - this.beam.clientHeight) {
                    this.beam.remove(); // Supprime le tir quand il sort de l'écran
                    clearInterval(interval);
                } else {
                    this.beam.style.bottom = `${beamY + this.speed}px`;
                }
            }, 20);
        }
    }


    document.addEventListener("DOMContentLoaded", () => {
        const gameContainer = document.getElementById("game-container");
        new Ship(gameContainer);
    });

