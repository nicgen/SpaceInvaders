//Class to capture/track player keypress events in realTime
export default class InputHandler {
    constructor() {
        this.keys = {}; //object to store current state of pressed keys
        window.addEventListener("keydown", (e) => (this.keys[e.key] = true)); //set key pressed to true
        window.addEventListener("keyup", (e) => (this.keys[e.key] = false)); //set key pressed to false 
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