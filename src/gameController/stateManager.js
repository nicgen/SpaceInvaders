const GAME_STATES = {
    MENU: 'menu',
    RUNNING: 'running',
    PAUSED: 'paused',
    GAME_OVER: 'gameover'
};

export default class StateManager {
    constructor() {
        this.state = GAME_STATES.MENU;
        this.score = 0;
    }

    setRunning(){
        this.state = GAME_STATES.RUNNING;
    }

    setPaused() {
        this.state = GAME_STATES.PAUSED;
    }

    setGameOver() {
        this.state = GAME_STATES.GAME_OVER;
    }

    isRunning(){
        this.state === GAME_STATES.RUNNING;
    }
}