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
 * 트랜지션 메소드. 탭을 클릭했을 때 해당 탭으로 넘어가도록 구현
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

/**
 * 트랜지션 메소드에서 넘어갈 탭이 나타나도록 opacity 애니메이션 적용
 * @param id
 * @param delay
 * @param duration
 */
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

/**
 * 트랜지션 메소드에서 이전 탭이 사라지도록 opacity 애니메이션 적용
 * @param duration
 */
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
