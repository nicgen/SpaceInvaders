// UI-related tasks : creating/displaying menus and gameOverScreen

export default class UIManager {
    constructor(game) {
        this.game = game;
        this.createPauseMenu();
        this.createGameOverScreen();
    }

    createMainMenu() {
        const menu = document.createElement('div');
        menu.id = 'menuScreen';
        menu.style.textAlign = 'center';

        const title = document.createElement('h1');
        title.textContent = 'Game Name';
        menu.appendChild(title);

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        menu.appendChild(startButton);

        document.body.appendChild(menu);
        this.menuScreen = menu;
    }

    hideMainMenu() {
        this.menuScreen.classList.add('hidden');
    }

    createPauseMenu() {
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pauseMenu';
        pauseMenu.style.position = 'absolute';
        pauseMenu.style.top = '50%';
        pauseMenu.style.left = '50%';
        pauseMenu.style.transform = 'translate(-50%, -50%)';
        pauseMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
        pauseMenu.style.padding = '20px';
        pauseMenu.style.textAlign = 'center';
        pauseMenu.style.borderRadius = '10px';
        pauseMenu.classList.add('hidden');

        const title = document.createElement('h1');
        title.textContent = 'Paused';
        pauseMenu.appendChild(title);

        const resumeButton = document.createElement('button');
        resumeButton.textContent = 'Resume';
        resumeButton.onclick = () => this.game.resumeGame();
        pauseMenu.appendChild(resumeButton);

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.onclick = () => this.game.restartGame();
        pauseMenu.appendChild(restartButton);

        document.body.appendChild(pauseMenu);
        this.pauseMenu = pauseMenu;
    }

    showPauseMenu() {
        this.pauseMenu.classList.remove('hidden');
    }

    hidePauseMenu() {
        this.pauseMenu.classList.add('hidden');
    }

    createGameOverScreen() {
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'gameOverScreen';
        gameOverScreen.classList.add('hidden');
        gameOverScreen.style.textAlign = 'center';

        const title = document.createElement('h1');
        title.textContent = 'Game Over';
        gameOverScreen.appendChild(title);

        const finalScore = document.createElement('p');
        finalScore.id = 'finalScore';
        gameOverScreen.appendChild(finalScore);

        const restartButton = document.createElement('button');
        restartButton.textContent.id = 'restart Game';
        restartButton.onclick = () => this.game.restartGame;
        gameOverScreen.appendChild(restartButton);

        const quitButton = document.createElement('button');
        quitButton.textContent = 'Quit';
        quitButton.onclick = () => window.location.reload();
        gameOverScreen.appendChild(quitButton);

        document.body.appendChild(gameOverScreen);
        this.gameOverScreen = gameOverScreen;
    }

    showGameOverScreen(score) {
        this.gameOverScreen.classList.remove('hidden');
        document.getElementById('finalScore').textContent = `score: ${score}`;
    }
}