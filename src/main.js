import Game from "./gameController/game.js";

window.onload = () => {
    const gameBoard = document.getElementById("game-container");
    if (!gameBoard) {
        console.error("Game board element not found");
        return;
    }
    new Game();
} 