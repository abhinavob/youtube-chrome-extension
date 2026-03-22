function increaseSpeed(speed) {
    if (speed >= 0 && speed < 2) {
        speed += 0.25;
    } else if (speed >= 2 && speed < 3) {
        speed += 0.5;
    } else if (speed >= 3 && speed < 6) {
        speed += 1;
    } else if (speed >= 6 && speed <= 14) {
        speed += 2;
    } else if (speed > 14) {
        speed = 16;
    }
    return speed;
}

function decreaseSpeed(speed) {
    if (speed > 0.25 && speed <= 2) {
        speed -= 0.25;
    } else if (speed > 2 && speed <= 3) {
        speed -= 0.5;
    } else if (speed > 3 && speed <= 6) {
        speed -= 1;
    } else if (speed > 6 && speed <= 16) {
        speed -= 2;
    }
    return speed;
}

function getPlayer() {
    const video = document.querySelector("video");
    if (!video) return null;

    let player = document.fullscreenElement;

    // Make sure the player is not the document itself (as it is in YouTube) as it causes positioning issues with the speed box
    if (!player || player === document.documentElement || player === document.body)
        player = video.parentElement.parentElement;

    return player;
}

function getSpeedBox() {
    let box = document.getElementById("custom-speed-box");
    if (box) return box;

    box = document.createElement("div");
    box.id = "custom-speed-box";
    box.style.cssText = `
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.7);
        color: #fff;
        padding: 10px 20px;
        border-radius: 6px;
        font-family: Roboto, Arial, sans-serif;
        font-size: 20px;
        font-weight: 500;
        z-index: 9999;
        pointer-events: none;
        display: none;
    `;

    const player = getPlayer();
    if (!player) return null;

    player.style.position = "relative";
    player.appendChild(box);

    return box;
}

function showSpeedUI(speed) {
    const player = getPlayer();
    if (!player) return;

    const box = getSpeedBox();
    if (!box) return;

    // To account for the player changing when toggling fullscreen, we need to make sure the box is the child of the current player
    if (box.parentElement !== player) {
        player.style.position = "relative";
        player.appendChild(box);
    }

    box.textContent = `${speed}x`;
    box.style.display = "block";

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        box.style.display = "none";
    }, 800);
}

function addListeners() {
    chrome.runtime.onMessage.addListener((msg) => {
        const video = document.querySelector("video");
        if (!video) return;
        
        if (msg.command === "speed-up") {
            video.playbackRate = increaseSpeed(video.playbackRate);
            showSpeedUI(video.playbackRate);
        }
        
        if (msg.command === "speed-down") {
            video.playbackRate = decreaseSpeed(video.playbackRate);
            showSpeedUI(video.playbackRate);
        }

        if (msg.command === "speed-normal") {
            video.playbackRate = 1;
            showSpeedUI(video.playbackRate);
        }

        if (msg.command === "speed-max") {
            video.playbackRate = 16;
            showSpeedUI(video.playbackRate);
        }
    });
}

function setMaxSpeed() {
    const video = document.querySelector("video");
    if (!video) return;
    video.playbackRate = 16;
}

let wasAdPlaying = false;
let autoSpeedAdsEnabled = true;

chrome.storage.sync.get({ autoSpeedAds: true }, ({ autoSpeedAds }) => {
    autoSpeedAdsEnabled = !!autoSpeedAds;
});

const observer = new MutationObserver(() => {
    const isAdPlaying = !!document.querySelector(".ad-showing");

    if (isAdPlaying && !wasAdPlaying) {
        wasAdPlaying = true;
        if (autoSpeedAdsEnabled)
            setMaxSpeed();
    }

    if (!isAdPlaying) {
        wasAdPlaying = false;
    }
});

observer.observe(getPlayer() || document.body, {
    attributes: true,
    subtree: true
});

let hideTimer;

addListeners();