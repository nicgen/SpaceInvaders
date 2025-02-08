import {MENU_STYLE, MENU_TITLES, BUTTON_TEXTS } from "../utils/constants.js";

function createBaseMenu(titleText, buttonText, buttonCallback) {
    const menu = document.createElement("div");
    Object.assign(menu.style, MENU_STYLE.menu);

    //title
    const title = document.createElement("h1");
    title.textContent = titleText;
    Object.assign(menu.style, MENU_STYLE.title);
    menu.appendChild(title);

    //buttons 
    buttonText.forEach((text, index) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.onclick = buttonCallback[index];
        Object.assign(button.style, MENU_STYLE.button);
        menu.appendChild(button);
    });

    document.body.appendChild(menu);

    //adjust size of the menu
    adjustMenuFontSize(menu);

    //adjust on window resize
    window.addEventListener('resize', () => adjustMenuFontSize(menu));

    return menu;
}

export function createMenu(startGame) {
    return createBaseMenu(
        MENU_TITLES.start,
        BUTTON_TEXTS.start,
        [startGame]
    );
}

export function createPauseMenu(resumeGame, restartGame, toggleFPS) {
   return createBaseMenu(
    MENU_TITLES.paused,
    BUTTON_TEXTS.paused,
    [resumeGame, restartGame, toggleFPS]
   );
}

export function createGameOverScreen(restartGame, quitGame) {
    return createBaseMenu(
        MENU_TITLES.gameOver,
        BUTTON_TEXTS.gameOver,
        [restartGame, quitGame]
    );
}

function adjustMenuFontSize(menu){
    const containerWidth = window.innerWidth;
    const title = menu.querySelector("h1");
    const buttons = menu.querySelectorAll("button");

    //fontsize based on window width
    const fontSize = containerWidth * 0.04;

    if (title) {
        title.style.fontSize = `${fontSize}px`;
    }

    buttons.forEach(button => {
        button.style.fontSize = `${fontSize * 0.3}px`;
    });
}
