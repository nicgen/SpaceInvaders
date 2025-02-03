import Game from "./gameController.js";

window.onload = () => {
    const gameBoard = document.getElementById("gameArea");
    if (!gameBoard) {
        console.error("Game board element not found");
        return;
    }
    new Game();
} 