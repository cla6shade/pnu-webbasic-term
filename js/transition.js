const HOME = 0;
const DAILY = 1;
const YEARLY = 2;
const THEATERS = 3;
const selectors = [".title-container", ".daily-container",
    ".yearly-container", ".theaters-container"];

let now = HOME;
let availableState = true;

let mapDrawn = false;

/**
 * @param {number} id
 */
function transfer(id){
    if(availableState && now !== id){
        availableState = false;
        console.log(id)
        vanish(300);
        appear(id, 300, 300);
        now = id;
    }
}
function appear(id, delay, duration){
    const appearContainer = document.querySelector(selectors[id]);
    setTimeout(()=>{
        appearContainer.style.display = "flex";
        if(id === THEATERS && ! mapDrawn){
            drawMap();
            mapDrawn = true;
        }
    }, delay)
    let keyframes = [
        {opacity: "0"},
        {opacity: "1"},
    ];
    let options = {
        duration: duration,
        delay: delay,
        fill: "forwards",
        easing: "ease-out"
    }
    appearContainer.animate(keyframes, options);
    setTimeout(() => {
        availableState = true;
    }, delay + duration);
}
function vanish(duration){
    const nowContainer = document.querySelector(selectors[now]);
    let keyframes = [
        {opacity: "1"},
        {opacity: "0"},
    ];
    let options = {
        duration: duration,
        delay: 0,
        fill: "forwards",
        easing: "ease-out"
    }
    nowContainer.animate(keyframes, options);
    setTimeout(() => {
        nowContainer.style.display = "none";
    }, duration);
}
