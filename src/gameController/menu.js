export function createMenu(startGame) {
    const menu = document.createElement("div");
    menu.id = "menuScreen";

    const title = document.createElement("h1");
    title.textContent = "SpaceInvadors";
    menu.appendChild(title);

    const startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    startButton.onclick = startGame;

    menu.appendChild(startButton);
    document.body.appendChild(menu);
    return menu;
}

export function createPauseMenu(resumeGame, restartGame) {
    const pauseMenu = document.createElement("div");
    pauseMenu.id = "pauseMenu";
    pauseMenu.style.position = "absolute";
    pauseMenu.style.top = "50%";
    pauseMenu.style.left = "50%";
    pauseMenu.style.transform = "translate(-50%, -50%)";
    pauseMenu.style.backgroundColor = "rgba(0, 0 ,0, 0.8";
    pauseMenu.style.padding = "20px";
    pauseMenu.style.textAlign = "center";
    pauseMenu.style.borderRadius = "10px";
    pauseMenu.classList.add("hidden");

    const title = document.createElement("h1");
    title.textContent = "Game Paused";
    title.style.color = "white";
    pauseMenu.appendChild(title);

    const resumeButton = document.createElement("button");
    resumeButton.textContent = "Resume Game";
    resumeButton.onclick = resumeGame;
    pauseMenu.appendChild(resumeButton);

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Game";
    restartButton.onclick = restartGame;
    pauseMenu.appendChild(restartButton);

    document.body.appendChild(pauseMenu);
    return pauseMenu;
}

export function createGameOverScreen(restartGame, quitGame) {
    const gameOverScreen = document.createElement("div");
    gameOverScreen.id = "gameOverScreen";
    gameOverScreen.classList.add("hidden");
    gameOverScreen.style.textAlign = "center";

    const title = document.createElement("h1");
    title.textContent = "GaMe OvEr SoRe LoOsEr";
    gameOverScreen.appendChild(title);

    const finalScore = document.createElement("p");
    finalScore.id = "finalScore";
    gameOverScreen.appendChild(finalScore);

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Game";
    restartButton.onclick = restartGame;
    gameOverScreen.appendChild(restartButton);

    const quitButton = document.createElement("button");
    quitButton.textContent = "Quit Game";
    quitButton.onclick = quitGame;
    gameOverScreen.appendChild(quitButton);

    document.body.appendChild(gameOverScreen);
    return gameOverScreen;
}