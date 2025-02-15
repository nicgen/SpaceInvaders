export async function createPixiApp() {
    const app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
    });
    
    // Initialize the app before using it
    await app.init();

    // Ensure the game container exists before appending
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.appendChild(app.canvas);
    } else {
        console.error('Game container not found!');
    }
    
    return app;
}