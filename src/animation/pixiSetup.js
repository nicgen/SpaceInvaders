import { GAME } from "../utils/constants.js";

export async function createPixiApp() {
    const app = new PIXI.Application({
        width: GAME.WIDTH,
        height: GAME.HEIGHT,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
    });
    
    // Initialize the app before using it
    await app.init();

    // Ensure the game container exists before appending
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        // If there's already a canvas, remove it before appending the new one
        const existingCanvas = gameContainer.querySelector('canvas');
        if (existingCanvas) {
            gameContainer.removeChild(existingCanvas);
        }

        // Append the new PixiJS canvas
        gameContainer.appendChild(app.canvas);
    } else {
        console.error('Game container not found!');
    }

    return app;
}