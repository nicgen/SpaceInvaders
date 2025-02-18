import { INTRO_TEXT, TEXT_STYLE, ANIMATION_TIMINGS, PLANET, SUN } from '../utils/animationConstants.js';
import { GAME } from '../../utils/constants.js';

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

    window.addEventListener('resize', () => {
        titleText.position.set(GAME.WIDTH / 2, GAME.HEIGHT + 50);
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

    window.addEventListener('resize', () => {
        storyText.position.set(GAME.WIDTH / 2, GAME.HEIGHT + 250);
        storyText.style.fontSize = GAME.WIDTH * 0.03;
        storyText.style.wordWrapWidth = GAME.WIDTH * 0.7;
    });
}

async function showPlanets(app, onComplete) {
    const planets = [];

    //Load SUN
    const sunTexture = await PIXI.Assets.load(SUN.IMAGE);
    const sunSprite = new PIXI.Sprite(sunTexture);
    sunSprite.x = SUN.POSITION.x;
    sunSprite.y = SUN.POSITION.y;
    sunSprite.anchor.set(0.5);
    sunSprite.scale.set(PLANET.SCALE.INITIAL * 2);
    app.stage.addChild(sunSprite);

    //Spiral calculation variables 
    const numberOfPlanets = PLANET.IMAGES.length;
    const spiralSpacing = 150;
    const spiralAngleIncrement = Math.PI / 6;

    for (let i = 0; i < numberOfPlanets; i++) {
        const imagePath = PLANET.IMAGES[i];
        console.log(`🔄 Loading image: ${imagePath} (Key: planet_${i})`);

        try {
            const texture = await PIXI.Assets.load(imagePath); // Load image
            console.log(`✅ Image loaded: ${imagePath}`);

            const sprite = new PIXI.Sprite(texture);

            //spiral position (radius, angle)
            const angle = spiralAngleIncrement * i;
            const radius = spiralSpacing * i;

            //convert polar coordinates to cartesian coordinates
            sprite.x = SUN.POSITION.x + radius * Math.cos(angle);
            sprite.y = SUN.POSITION.y + radius * Math.sin(angle);

            sprite.anchor.set(0.5);
            sprite.alpha = 0;
            sprite.scale.set(PLANET.SCALE.INITIAL);

            console.log(`🎨 Sprite ${i} created at:`, { x: sprite.x, y: sprite.y });

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
    const totalPlanets = planets.length;
    const alphaPlanetIndex = 1; // The planet we're zooming into

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
                completedAnimations++;

                // Once all planets have fully appeared, fade out all except the alpha planet
                if (completedAnimations === totalPlanets) {
                    console.log('✨ All planets are fully visible. Fading out non-alpha planets...');

                    // Fade out all non-alpha planets
                    planets.forEach((p, i) => {
                        if (i !== alphaPlanetIndex) {
                            gsap.to(p, {
                                alpha: 0,
                                duration: ANIMATION_TIMINGS.PLANET_FADE_OUT_DURATION,
                                onComplete: () => {
                                    app.stage.removeChild(p); // Remove the non-alpha planets
                                    console.log(`❌ Planet ${i} removed`);
                                }
                            });
                        }
                    });

                    // After fade out, zoom into the alpha planet
                    gsap.delayedCall(ANIMATION_TIMINGS.PLANET_FADE_OUT_DURATION, () => {
                        console.log('🔍 Now zooming into the Alpha planet...');
                        zoomIntoPlanet(app, planets[alphaPlanetIndex], () => {
                            console.log('🏁 Zoom-in complete. Proceeding with cleanup...');
                            onComplete();
                        });
                    });
                }
            }
        });
    });
}


function zoomIntoPlanet(app, planet, onComplete) {
    gsap.to(planet.scale, {
        x: PLANET.SCALE.ZOOMED * 1.5,
        y: PLANET.SCALE.ZOOMED * 1.5,
        duration: ANIMATION_TIMINGS.PLANET_ZOOM_DURATION,
        ease: "power2.inOut",
    });

    gsap.to(planet, {
        x: GAME.WIDTH / 2,
        y: GAME.HEIGHT / 2,
        duration: ANIMATION_TIMINGS.PLANET_ZOOM_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
            app.stage.removeChild(planet);
            onComplete();
        }
    });
}

