export const GAME = {
    get WIDTH() {
        return document.getElementById('game-container').getBoundingClientRect().width;
    },
    get HEIGHT(){
        return document.getElementById('game-container').getBoundingClientRect().height;
    },
    BACKGROUND_COLOR: '#111',
};

export const SHIP = {
    get WIDTH() {
        return GAME.WIDTH * 0.2;
    },
    get HEIGHT() {
        return GAME.HEIGHT * 0.18;
    },
    SPEED:8 ,
    COLOR: 'rgb(50, 223, 87)',
    SHOOT_COOLDOWN: 300,
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
    },
};

export const ENEMY = {
    get WIDTH() {
        return GAME.WIDTH * 0.06;
    },
    get HEIGHT() {
        return GAME.HEIGHT * 0.06;
    },
    SPEED: 3,
    ROWS: 3,
    COLS: 2,
    SPACING: 20,
    COLOR: 'red'
};

export const COLORS = {
    BACKGROUND: '#000',
    TEXT: '#FFFFFF',
};

export const CONTROLS = {
    MOVE_LEFT: 'ArrowLeft',
    MOVE_RIGHT: 'ArrowRight',
    SHOOT: ' ',
    PAUSE: 'Escape',
};

export const MENU_STYLE = {
    menu: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(0, 0 ,0, 0.8)",
        padding: "20px",
        textAlign: "center",
        borderRadius: "10px",
        border: "3px solid #333",
        display: "none",
    },
    title: {
        color: "white",
    },
    button: {
        padding: "10px 20px",
        margin: "5px",
        fontSize: "16px",
        backgroundColor: "#333",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    }
};

export const MENU_TITLES = {
    start: "Mu$K F$king Invador",
    paused: "Anihilation Paused",
    gameOver: "ThrustFund Empty",
};

export const BUTTON_TEXTS = {
    start: ["Start Exploring"],
    paused:["Resume Exploration", "Restart Exploration", "Toggle FPS"],
    gameOver: ["Restart Exploration", "Rage Quit"],
}

export const FPS_CONSTANTS = {
    TARGET_FPS: 60,
    MAX_FPS: 80,
    FPS_INTERVAL: 1000,
    FPS_DISPLAY_COLORS: {
        LOW: 'red',
        MEDIUM: 'orange',
        HIGH: 'green',
    },
    FPS_PERFORMANCE_THRESHOLDS: {
        LOW: 0.8,
        MEDIUM: 1,
    }
};