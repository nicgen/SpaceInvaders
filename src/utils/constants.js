export const GAME = {
    WIDTH: 1024,
    HEIGHT: 872,
    BACKGROUND_COLOR: '#111'
};

export const SHIP = {
    WIDTH: 50,
    HEIGHT: 30,
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