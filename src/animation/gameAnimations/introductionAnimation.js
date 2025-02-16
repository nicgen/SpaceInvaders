import { INTRO_TEXT, TEXT_STYLE, ANIMATION_TIMINGS, PLANET_IMAGES, PLANET_SCALE } from '../utils/animationConstants.js';
import { GAME } from '../../utils/constants.js';

const gameContainer = document.getElementById('game-container');
export function playIntroAnimation(app) {
    const titleText = new PIXI.Text(INTRO_TEXT.TITLE, TEXT_STYLE);
    titleText.anchor.set(0.5);
    titleText.position.set(GAME.WIDTH / 2, GAME.HEIGHT + 50);
    app.stage.addChild(titleText);

    gsap.to(titleText, {
        y: -30,
        duration: ANIMATION_TIMINGS.TEXT_SCROLL_DURATION,
        ease: "power2.out",
        onComplete: () => {
            app.stage.removeChild(titleText);
            showStoryText(app);
        }
    });
}


function showStoryText(app) {
    const storyText = new PIXI.Text(INTRO_TEXT.STORY, TEXT_STYLE);
    storyText.position.set(GAME.WIDTH / 2, GAME.HEIGHT + 250);
    storyText.anchor.set(0.5);
    storyText.style.fontSize = GAME.WIDTH * 0.03;
    storyText.style.wordWrapWidth = GAME.WIDTH * 0.7;
    app.stage.addChild(storyText);

    gsap.to(storyText, {
        y: -200,
        duration: ANIMATION_TIMINGS.TEXT_SCROLL_DURATION * 4,
        ease: "power2.out",
        onComplete: () => {
            setTimeout(() => {
                app.stage.removeChild(storyText);
                showPlanets(app);
            }, 100);
        }
    });
}

function showPlanets(app) {
    const planetTextures = PLANET_IMAGES.map(imagePath => PIXI.Texture.from(imagePath)); //dynamic import planet textures
    const planets = [];

    planetTextures.forEach((texture, index) => {
        let planet = new PIXI.Sprite(texture);
        planet.x = Math.random() * GAME.WIDTH;
        planet.y = Math.random() * GAME.HEIGHT;
        planet.anchor.set(0.5);
        planet.alpha = 0;
        planet.scale.set(PLANET_SCALE.INITIAL);
        app.stage.addChild(planet);
        planets.push(planet);

        gsap.to(planet, {
            alpha: 1,
            duration: ANIMATION_TIMINGS.PLANET_FADE_IN_DURATION,
            delay: index * ANIMATION_TIMINGS.PLANET_FADE_IN_DELAY
        });
    });
    setTimeout(() => {
        if (planets.length > 1) {
            zoomIntoPlanet(app, planets[1]);
        }
    }, 6000);
}

function zoomIntoPlanet(app, planet) {
    gsap.to(planet.scale, {
        x: PLANET_SCALE.ZOOMED,
        y: PLANET_SCALE.ZOOMED,
        duration: ANIMATION_TIMINGS.PLANET_ZOOM_DURATION,
        ease: "power2.inOut"
    });
}