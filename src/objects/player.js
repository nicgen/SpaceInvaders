class Ship {                                               /*creation de de notre vaisseau qu'on viens mettre dans container(game-container)*/
        constructor(container) {
            this.container = container;
            this.ship = document.createElement("div");
            this.ship.classList.add("ship");
            this.container.appendChild(this.ship);

            this.speed = 30;                              /*vitesse de notre vaisseau en px*/
            this.shipX = this.container.clientWidth / 2 - this.ship.clientWidth / 2;  /*positionnement de notre vaisseau au centre de notre container*/


            this.canShoot = true;
            this.shootCooldown = 30;  //Délai de ms pour éviter de spam les tir

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

        update() {
            if (this.keys["ArrowLeft"] && this.positionX > 0) {
                this.positionX -= this.speed;
            }
            if (this.keys["ArrowRight"] && this.positionX < this.container.clientWidth - this.element.clientWidth) {
                this.positionX += this.speed;
            }
            this.render();
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
            new Bullet(this.container, this.shipX + this.ship.clientWidth / 2);
        }

        render() {                                      //renvoi le visuel
            this.ship.style.left = this.shipX + "px";
        }
    }

    class Bullet {
        constructor(container, xPosition) {
            this.container = container;
            this.bullet = document.createElement("div");
            this.bullet.classList.add("bullet");
            this.container.appendChild(this.bullet);
    
            // Position initiale du tir
            this.bullet.style.left = `${xPosition}px`;
            this.bullet.style.bottom = "30px"; // Pars de la meme hauteur du vaisseau
    
            this.speed = 15; //vitesse du tir
            this.moveBullet();
        }
    
        moveBullet() {
            const interval = setInterval(() => { //anime le tir toutes les 20ms
                const bulletY = parseInt(this.bullet.style.bottom);
                if (bulletY >= this.container.clientHeight - this.bullet.clientHeight - 5) {
                    this.bullet.remove(); // Supprime le tir quand il sort de l'écran
                    clearInterval(interval);
                } else {
                    this.bullet.style.bottom = `${bulletY + this.speed}px`;
                    this.checkCollission(interval);
                }
            }, 20);
        }

        checkCollission(interval) {
            document.querySelectorAll(".enemy").forEach((enemy) => {
                const enemyRect = enemy.getBoundingClientRect();
                const bulletRect = this.bullet.getBoundingClientRect();

                if (bulletRect.top <= enemyRect.bottom &&
                    bulletRect.bottom >= enemyRect.top &&
                    bulletRect.left <= enemyRect.right &&
                    bulletRect.right >= enemyRect.left 
                ) {
                    enemy.remove();
                    this.bullet.remove();
                    clearInterval(interval);
                }
            });
        }

    }

    document.addEventListener("DOMContentLoaded", () => {
        const gameContainer = document.getElementById("game-container");
        const ship = new Ship(gameContainer);
        const enemyFormation = new EnemyFormation(gameContainer);
    
        function gameLoop() {
            ship.update();
            enemyFormation.update();
            requestAnimationFrame(gameLoop);
        }
    
        gameLoop();
    });
    
