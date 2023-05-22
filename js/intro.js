let intro = {}
intro.openCurtain = () => {
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
        document.querySelector(".opener-container").style.display = "none";

        intro.showTitle();
    }, 1800);
}
intro.showTitle = () => {
    let keyFrames_icon = [
        {
            transform: "translate(-7px, 0)",
            opacity: "0"
        },
        {
            transform: "translate(0, 0)",
            opacity: "1"
        }
    ];

    let keyFrames_title = [
        {
            transform: "translate(0, -7px)",
            opacity: "0"
        },
        {
            transform: "translate(0, 0)",
            opacity: "1"
        }
    ];

    let keyFrames_subtitle = [
        {
            transform: "translate(0, 7px)",
            opacity: "0"
        },
        {
            transform: "translate(0, 0)",
            opacity: "1"
        }
    ];
    let options = {
        delay: 0,
        duration: 300,
        easing: "ease-in",
        fill: "forwards"
    }
    let title = document.querySelector(".film-title");
    let subtitle = document.querySelector(".film-subtitle");
    let icon = document.querySelector(".main-icon");

    icon.animate(keyFrames_icon, options);
    options.delay = 300;

    title.animate(keyFrames_title, options);
    options.delay = 500;
    subtitle.animate(keyFrames_subtitle, options);
}
export default intro;