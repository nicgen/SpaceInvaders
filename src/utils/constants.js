export const COLORS = {
    BACKGROUND: '#000',
    TEXT: '#FFFFFF',
};

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
        return GAME.WIDTH * 0.15;
    },
    get HEIGHT() {
        return GAME.HEIGHT * 0.12;
    },
    SPEED:8 ,
    COLOR: 'rgb(50, 223, 87)',
    SHOOT_COOLDOWN: 300,
    SKINS: {
        default : "../../img/VirginGalacticShip.svg" ,
        type1: "../../img/ship.svg",
        type2: "../../img/VirginGalacticShip1.svg",
        type3: "../../img/VirginGalacticShip.svg",
        type4: "../../img/BlueOriginSpaceShip.svg"
    }
};

export const BEAM = {
    WIDTH: 3,
    HEIGHT: 10,
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
        return GAME.WIDTH * 0.08;
    },
    get HEIGHT() {
        return GAME.HEIGHT * 0.08;
    },
    SPEED: 20,
    ROWS: 3,
    COLS: 2,
    SPACING: 20,
    COLOR: '',
    SKINS: {
        default: "../../img/teslaAstronaut.svg",
        type1: "../../img/enemy1.png",
        type2: "../../img/enemy2.png",
        type3: "../../img/enemy3.png",
        type4: "../../img/enemy4.png"
    }
};

export const ENEMY_FORMATION = {
    GRID: {
        ROWS: 3,
        COLS: 6,
        SPACING: 50,
    },
    V_SHAPE: {
        ROWS: 4,
        COLS: 8,
        SPACING: 50,
    },
    LINE: {
        ROWS: 1,
        COLS: 10,
        SPACING: 50,
    },
    SHOOT_PROBABILITY: 0.3,
    SHOOT_COOLDOWN: 1000,
    MOVEMENT_SPEED: 3,
    MOVEMENT_SPEED_INTERVAL: 200,
    MOVE_INTERVAL: 15
};

export const ENEMY_BEHAVIOR = {
    RANDOM_SHOOTING_INTERVAL: Math.random() * (5000 - 2000) + 2000,
    INITIAL_DIRECTION: 1,
    SHOOT_PROBABILITY: 0.3,
    SHOOT_COOLDOWN: 1000,
    MOVEMENT_SPEED: 3,
    MOVEMENT_SPEED_INTERVAL: 1000,
    MOVE_INTERVAL: 15,
};

export const CONTROLS = {
    MOVE_LEFT: 'ArrowLeft',
    MOVE_RIGHT: 'ArrowRight',
    SHOOT: ' ',
    PAUSE: 'Escape',
};

export const SCORE = {
    ENEMY_HIT: 10,
    //POWERUP: 50,
    BONUS: 100,
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
    start: "Mu$K Invador",
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

export const TIMER = {
    DEFAULT_TIME: 30,
    INTERVAL: 100,
};