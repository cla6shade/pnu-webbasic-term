let intro = {}

const title = document.querySelector(".film-title");
const subtitle = document.querySelector(".film-subtitle");
const icon = document.querySelector(".main-icon");

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

    icon.animate(keyFrames_icon, options);
    options.delay = 300;

    title.animate(keyFrames_title, options);
    options.delay = 500;
    subtitle.animate(keyFrames_subtitle, options);

    let icon_rotate = [
        {transform: "rotate(0deg)"},
        {transform: "rotate(360deg)"}
    ]
    let rotate_options = {
        delay: 700,
        duration: 1000,
        easing: "ease-out",
        iterations: Infinity
    }

    icon.animate(icon_rotate, rotate_options);

    icon.onclick = intro.onLogoClick;
}

intro.onLogoClick = () => {
    let keyFrames_vanish = [
        {opacity: 1},
        {opacity: 0},
    ]
    let vanish_options = {
        delay: 300,
        duration: 500,
        easing: "ease-in",
        fill: "forwards"
    }
    let curtains = document.getElementsByClassName("curtain");
    let curtain_left = curtains.item(0);
    let curtain_right = curtains.item(1);
    let keyFrames_curtain_left = [
        {transform: "translate(0, 0)"},
        {transform: "translate(-360px, 0)"}
    ]
    let keyFrames_curtain_right = [
        {transform: "translate(0, 0)"},
        {transform: "translate(360px, 0)"}
    ]

    curtain_left.animate(keyFrames_curtain_left, vanish_options);
    curtain_right.animate(keyFrames_curtain_right, vanish_options);

    vanish_options.delay = 600;
    title.animate(keyFrames_vanish, vanish_options);
    subtitle.animate(keyFrames_vanish, vanish_options);
    icon.animate(keyFrames_vanish, vanish_options);

    setTimeout(() =>{
            curtain_left.style.display = "none";
            curtain_right.style.display = "none";
            document.querySelector(".film-content")
                .style.display = "none";
            //메인 페이지 레이아웃 보이도록 display: flex로.
    }, vanish_options.delay + vanish_options.duration);
}
export default intro;