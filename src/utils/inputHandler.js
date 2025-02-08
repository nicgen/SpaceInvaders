//Class to capture/track player keypress events in realTime
export default class InputHandler {
    constructor() {
        this.keys = {}; // pressed keys
        this.justPressedKeys = new Set(); // keys just pressed 

        window.addEventListener("keydown", (e) => {
            if (!this.keys[e.key]) {
                this.justPressedKeys.add(e.key);
            }
            this.keys[e.key] = true; 
        });
        window.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
            this.justPressedKeys.delete(e.key); 
        }); 
    }

    isKeyPressed(key) {
        return this.keys[key];
    }

    isKeyJustPressed(key) {
       if (this.justPressedKeys.has(key)) {
        this.justPressedKeys.delete(key);
        return true;
       }
       return false;
    }
}

/* 
window object : global object for client-side web development 
    - represents the browser window/tab where the page is running 
    - gives access to important browser-related functionalities 
        - handling events 
        - accessing documents (DOM)
        - working with timers 
any variables/functions declared without let, const or var becomes the properties of the window object
EventListeners : window can lsiten for events at a global lvl :
    - Keyborad events (keydown, keyup)
    - mouse events (clisck, mousemove)
    - resize events (resize)
*/

/*
using default when declaring a class allows to import the class directly in another file whithout {}
in this exemple : import InputHandler from '../utils/inputHandler.js';
it works only when you need to export only ONE element
when you need to export multiple elements still neeed to use the basic export option and the {} to import them
*/