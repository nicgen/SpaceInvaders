import { GAME } from '../../utils/constants.js';

export const TEXT_STYLE = {
    fontFamily : "Arial",
    fill : 0xffffff,
    fontWeight: "bold",
    align: "center",
    wordWrap: true,
    get fontSize() {
        return GAME.WIDTH * 0.08;
    },
    get wordWrapWidth() {
        return GAME.WIDTH * 0.8;
    }
};

export const INTRO_TEXT = {
    TITLE: "Mu$K F$CkInG InVaDoR",
    STORY: `Welcome to you human new player, we’re an alien space race. Our home HomeWorld 
    is being invaded by the fucking billionaires of your puny planet. 
    We intercepted and stole a starship of the Fcking leader called Eulion, 
    we modified it with some basic weapons. 
    Your mission is simple: destroy all the billionaire's forces. 
    As you move forward, you’ll be able to upgrade your ship’s equipment 
    and find special items granting you new abilities. 

    Good luck and Godspeed.`
};

export const ANIMATION_TIMINGS = {
    TEXT_SCROLL_DURATION: 10,
    PLANET_FADE_IN_DURATION: 2,
    PLANET_FADE_IN_DELAY: 1,
    PLANET_ZOOM_DURATION: 4,
};

export const PLANET_SCALE = {
    get INITIAL() {
        return GAME.WIDTH * 0.0006;
    },
   get ZOOMED() {
    return GAME.WIDTH * 0.004;
   }
};

export const PLANET_IMAGES = [
    "/img/planets/Barren.png",
    "/img/planets/Cloudy.png",
    "/img/planets/Glacial.png",
    "/img/planets/Lush.png",
    "/img/planets/Magma.png",
    "/img/planets/Muddy.png",
    "/img/planets/Oasis.png",
    "/img/planets/Ocean.png",
    "/img/planets/Rocky.png",
    "/img/planets/Tropical.png"
];
    
