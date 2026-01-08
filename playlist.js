function parseTime(timeStr) {
    // Video time format can be mm:ss or hh:mm:ss
    const parts = timeStr.split(":").map(Number);
    let seconds = 0;

    for (let i = 0; i < parts.length; i++) {
        seconds = seconds * 60 + parts[i];
    }
    return seconds;
}

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    else if (m > 0) return `${m}m ${s}s`;
    else return `${s}s`;
}

function calculatePlaylistTime() {
    const timeElements = document.querySelectorAll("#playlist #items .yt-badge-shape__text");

    let totalSeconds = 0;

    timeElements.forEach(el => {
        if (el.innerText.includes(":")) {
            totalSeconds += parseTime(el.innerText.trim());
        }
    });

    return totalSeconds;
}

function showWatchTimeLabel() {
    const header = document.getElementById("header-description");
    const watchTimeContainer = document.createElement("div");
    watchTimeContainer.className = "style-scope ytd-playlist-panel-renderer";
    watchTimeContainer.style.marginTop = "2px";
    const textWrapper = document.createElement("div");
    textWrapper.className = "index-message-wrapper style-scope ytd-playlist-panel-renderer";
    textWrapper.innerText = "Watch Time:";
    textWrapper.id = "playlist-total-time";
    watchTimeContainer.appendChild(textWrapper);
    header.appendChild(watchTimeContainer);
}

function refreshWatchTime() {
    textWrapper = document.getElementById("playlist-total-time");
    if (!textWrapper) return;
    const totalSeconds = calculatePlaylistTime();
    textWrapper.innerText = `Watch Time: ${formatTime(totalSeconds)}`;
}

function playlistLoaded() {
    const playlist = document.querySelector("#playlist");
    if (!playlist) return false;
    else return true;
}

function allVideosLoaded() {
    if (!playlistLoaded()) return false;

    const spans = document.querySelectorAll("#playlist #publisher-container div .yt-formatted-string");
    const lastSpan = spans[spans.length - 1];
    const videosNum = parseInt(lastSpan.innerText, 10);
    const timeElements = document.querySelectorAll("#playlist #items .yt-badge-shape__text");
    if (timeElements.length === videosNum) return true;
    else return false;
}

function playlistLoaded() {
    const playlist = document.querySelector("#playlist");
    if (!playlist) return false;
    else return true;
}

function trackWatchTime() {
    // Repeatedly refresh watch time until all videos are loaded
    if (!allVideosLoaded()) setTimeout(trackWatchTime, 200);
    refreshWatchTime();
}

function displayWatchTime() {
    if (!playlistLoaded()) {
        setTimeout(displayWatchTime, 200);
        return;
    }

    showWatchTimeLabel();

    trackWatchTime();
}

displayWatchTime();