let intro = {}
intro.show = () => {
    let rightOpener = document.querySelector(".opener-left");
    let leftOpener = document.querySelector(".opener-right");

    let keyFrames_right = [
        {transform: "translate(0, 0)"},
        {transform: "translate(-50vw, 0)"}
    ]
    let keyFrames_left = [
        {transform: "translate(0, 0)"},
        {transform: "translate(50vw, 0)"}
    ]
    let options = {
        delay: 1300,
        duration: 500,
        easing: "ease-in",
        fill: "forwards"
    }

    rightOpener.animate(keyFrames_right, options);
    leftOpener.animate(keyFrames_left, options);
    setTimeout(() => {
        rightOpener.style.display = "none";
        leftOpener.style.display = "none";
    }, 1900);
}
export default intro;