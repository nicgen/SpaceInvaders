const gameState = {
    MENU: 'menu',
    RUNNING: 'running',
    PAUSED: 'paused',
    GAME_OVER: 'gameover',
    LEVEL: 1,
    SCORE: 0,
    MULTIPLIER: 1,
    DIFFICULTY: 1,
    POWER_UPS: new Set(),
    WIND_FORCE: 0
};

export default class StateManager {
    constructor() {
        this.state = gameState.MENU;
        this.score = 0;
    }

    setRunning(){
        this.state = gameState.RUNNING;
    }

    setPaused() {
        this.state = gameState.PAUSED;
    }

    setGameOver() {
        this.state = gameState.GAME_OVER;
    }

    isRunning(){
        return this.state === gameState.RUNNING;
    }

    isPaused() {
        return this.state === gameState.PAUSED;
    }

    isGameOver() {
        return this.state === gameState.GAME_OVER;
    }
}