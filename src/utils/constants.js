export const GAME = {
    get WIDTH() {
        return document.getElementById('game-container').getBoundingClientRect().width;
    },
    get HEIGHT(){
        return document.getElementById('game-container').getBoundingClientRect().height;
    },
    BACKGROUND_COLOR: '#111'
};

export const SHIP = {
    get WIDTH() {
        return GAME.WIDTH * 0.08;
    },
    get HEIGHT() {
        return GAME.HEIGHT * 0.025;
    },
    SPEED:10 ,
    COLOR: 'rgb(50, 223, 87)',
    SHOOT_COOLDOWN: 300
};

export const BEAM = {
    WIDTH: 5,
    HEIGHT: 15,
    COLOR: 'red',
    VELOCITY: {
        X: 0,
        Y: 10
    },
    PHYSICS: {
        GRAVITY: 0.1,
        LIFT: 0
    }
};

export const COLORS = {
    BACKGROUND: '#000',
    TEXT: '#FFFFFF'
};

export const CONTROLS = {
    MOVE_LEFT: 'ArrowLeft',
    MOVE_RIGHT: 'ArrowRight',
    SHOOT: ' ',
    PAUSE: 'Escape'
};