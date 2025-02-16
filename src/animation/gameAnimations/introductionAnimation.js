import { INTRO_TEXT, TEXT_STYLE, ANIMATION_TIMINGS, PLANET_IMAGES, PLANET_SCALE } from '../utils/animationConstants.js';
import { GAME } from '../../utils/constants.js';

const gameContainer = document.getElementById('game-container');

export function playIntroAnimation(app, onComplete) {
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
            showStoryText(app, () => {
                showPlanets(app, onComplete);
            });
        }
    });
}

function showStoryText(app, onComplete) {
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
                onComplete();
            }, 100);
        }
    });
}

async function showPlanets(app, onComplete) {
    const planets = [];

    for (let i = 0; i < PLANET_IMAGES.length; i++) {
        const imagePath = PLANET_IMAGES[i];
        console.log(`🔄 Loading image: ${imagePath} (Key: planet_${i})`);

        try {
            const texture = await PIXI.Assets.load(imagePath); // Load image
            console.log(`✅ Image loaded: ${imagePath}`);

            const sprite = new PIXI.Sprite(texture);
            sprite.x = Math.random() * GAME.WIDTH;
            sprite.y = Math.random() * GAME.HEIGHT;
            sprite.anchor.set(0.5);
            sprite.alpha = 0;
            sprite.scale.set(PLANET_SCALE.INITIAL);

            console.log(`🎨 Sprite ${i} created:`, {
                x: sprite.x,
                y: sprite.y,
                alpha: sprite.alpha,
                scale: sprite.scale
            });

            app.stage.addChild(sprite);
            planets.push(sprite);
        } catch (error) {
            console.error(`❌ Failed to load image: ${imagePath}`, error);
        }
    }

    if (planets.length === 0) {
        console.error("❌ No valid planets were created!");
        return;
    }

    animatePlanets(planets, app, onComplete);
}

function animatePlanets(planets, app, onComplete) {
    console.log('🚀 Setting up planet animations...');
    let completedAnimations = 0;

    planets.forEach((planet, index) => {
        console.log(`🎬 Starting animation for planet ${index}`);
        gsap.to(planet, {
            alpha: 1,
            duration: ANIMATION_TIMINGS.PLANET_FADE_IN_DURATION,
            delay: index * ANIMATION_TIMINGS.PLANET_FADE_IN_DELAY,
            onStart: () => {
                console.log(`🟢 Animation started for planet ${index}`);
            },
            onComplete: () => {
                console.log(`✅ Planet ${index} fade-in complete`);
                if (index === 1) {
                    zoomIntoPlanet(app, planet, () => {
                        completedAnimations++;
                        console.log(`🔍 Zoom complete for planet ${index}, completed: ${completedAnimations}`);
                        checkCompletion();
                    });
                } else {
                    completedAnimations++;
                    console.log(`✔️ Animation complete for planet ${index}, completed: ${completedAnimations}`);
                    checkCompletion();
                }
            }
        });
    });

    function checkCompletion() {
        if (completedAnimations === planets.length) {
            console.log('🏁 All animations complete, cleaning up...');
            planets.forEach(p => app.stage.removeChild(p));
            onComplete();
        }
    }
}


function zoomIntoPlanet(app, planet, onComplete) {
    gsap.to(planet.scale, {
        x: PLANET_SCALE.ZOOMED * 1.5,
        y: PLANET_SCALE.ZOOMED * 1.5,
        duration: ANIMATION_TIMINGS.PLANET_ZOOM_DURATION,
        ease: "power2.inOut",
    });

    gsap.to(planet, {
        x: GAME.WIDTH / 2,
        y: GAME.HEIGHT / 2,
        duration: ANIMATION_TIMINGS.PLANET_ZOOM_DURATION,
        ease: "power2.inOut",
        onComplete
    });
}

function cleanupPlanets(planets, app, onComplete) {
    console.log('🧹 Cleaning up planet sprites...');
    planets.forEach(p => app.stage.removeChild(p));
    onComplete();
}