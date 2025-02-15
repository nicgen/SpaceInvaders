import Game from "./gameController/game.js";

window.onload = async () => {
    const gameBoard = document.getElementById("game-container");
    if (!gameBoard) {
        console.error("Game board element not found");
        return;
    }
    const game = new Game(); // Create a new instance of the game
    await game.init(); // Wait for the PixiJS app to initialize
}