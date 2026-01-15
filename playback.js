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

chrome.runtime.onMessage.addListener((msg) => {
    const video = document.querySelector("video");
    if (!video) return;
    
    if (msg.command === "speed-up") {
        video.playbackRate = increaseSpeed(video.playbackRate);
        console.log("Speed: " + video.playbackRate + "x");
    }

    if (msg.command === "speed-down") {
        video.playbackRate = decreaseSpeed(video.playbackRate);
        console.log("Speed: " + video.playbackRate + "x");
    }
});