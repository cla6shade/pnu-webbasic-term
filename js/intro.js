let intro = {}

const title = document.querySelector(".film-title");
const subtitle = document.querySelector(".film-subtitle");
const icon = document.querySelector(".main-icon");

intro.openCurtain = () => {
    let rightOpener = document.querySelector(".opener-left");
    let leftOpener = document.querySelector(".opener-right");

    let keyframes_right = [
        {transform: "translate(0, 0)"},
        {transform: "translate(-50vw, 0)"}
    ]
    let keyframes_left = [
        {transform: "translate(0, 0)"},
        {transform: "translate(50vw, 0)"}
    ]
    let options = {
        delay: 1300,
        duration: 500,
        easing: "ease-in",
        fill: "forwards"
    }

    rightOpener.animate(keyframes_right, options);
    leftOpener.animate(keyframes_left, options);
    setTimeout(() => {
        rightOpener.style.display = "none";
        leftOpener.style.display = "none";
        document.querySelector(".opener-container").style.display = "none";

        intro.showTitle();
    }, 1800);
}

intro.showTitle = () => {
    let keyframes_icon = [
        {
            transform: "translate(-7px, 0)",
            opacity: "0"
        },
        {
            transform: "translate(0, 0)",
            opacity: "1"
        }
    ];

    let keyframes_title = [
        {
            transform: "translate(0, -7px)",
            opacity: "0"
        },
        {
            transform: "translate(0, 0)",
            opacity: "1"
        }
    ];

    let keyframes_subtitle = [
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

    icon.animate(keyframes_icon, options);
    options.delay = 300;

    title.animate(keyframes_title, options);
    options.delay = 500;
    subtitle.animate(keyframes_subtitle, options);

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

intro.removeCurtain = (delay = 0) => {
    let curtains = document.getElementsByClassName("curtain");
    let curtain_left = curtains.item(0);
    let curtain_right = curtains.item(1);

    let keyframes_curtain_left = [
        {transform: "translate(0, 0)"},
        {transform: "translate(-360px, 0)"}
    ]
    let keyframes_curtain_right = [
        {transform: "translate(0, 0)"},
        {transform: "translate(360px, 0)"}
    ]

    let vanish_options = {
        delay: delay,
        duration: 300,
        easing: "ease-in",
        fill: "forwards"
    }

    curtain_left.animate(keyframes_curtain_left, vanish_options);
    curtain_right.animate(keyframes_curtain_right, vanish_options);

    setTimeout(() => {
        curtain_left.style.display = "none";
        curtain_right.style.display = "none";
    }, vanish_options.delay + vanish_options.duration);
    return vanish_options.delay + vanish_options.duration;
}

intro.screenOff = (delay = 0) => {
    let options = {
        delay: delay,
        duration: 300,
        easing: "ease-in",
        fill: "forwards"
    };

    let keyframes = [
        {},
        {background: "#000"}
    ]
    let bottom_keyframes =[
        {opacity: "1"},
        {opacity: "0"}
    ]
    
    let screen = document.querySelector(".screen");
    screen.animate(keyframes, options);

    let theater = document.querySelector(".theater-container");
    theater.animate(keyframes, options);

    let screenDuration = delay + options.duration;
    setTimeout(()=>{
        screen.style.boxShadow = "0 0 0 0 transparent";

        options.delay = 0;
        let bottom = document.querySelector(".theater-bottom");
        bottom.animate(bottom_keyframes, options);

        setTimeout(intro.mainView, options.delay + options.duration);
    }, screenDuration)
}

intro.mainView = () => {
    let bottom = document.querySelector(".theater-bottom");
    let screen_container = document.querySelector(".screen-container");
    bottom.style.display = "none";
    screen_container.style.display = "none";

    let options = {
        delay: 0,
        duration: 300,
        easing: "ease-in",
        fill: "forwards"
    };

    let keyframes = [
        {},
        {background: "#fff"}
    ]

    let keyframes_main = [
        {opacity: "0"},
        {opacity: "1"}
    ]
    let theater = document.querySelector(".theater-container");
    theater.animate(keyframes, options);

    let main = document.querySelector(".main-content");
    main.style.display = "flex";
    main.animate(keyframes_main, options);
}

intro.removeTitle = (delay = 0) =>{
    let vanish_options = {
        delay: delay,
        duration: 500,
        easing: "ease-in",
        fill: "forwards"
    }
    let keyframes_vanish = [
        {opacity: "1"},
        {opacity: "0"}
    ]
    title.animate(keyframes_vanish, vanish_options);
    subtitle.animate(keyframes_vanish, vanish_options);
    icon.animate(keyframes_vanish, vanish_options);

    return vanish_options.duration + vanish_options.delay
}

intro.onLogoClick = () => {
    let curtainDuration = intro.removeCurtain(300);
    let titleDuration = intro.removeTitle(curtainDuration);
    intro.screenOff(titleDuration);
    setTimeout(() => {
        document.querySelector(".film-content").style.display = "none";
    }, titleDuration)
}
export default intro;