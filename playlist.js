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

function calculateWatchTime(type) {
    let timeElements;
    if (type === "playlistVideo") {
        timeElements = document.querySelectorAll("#playlist #items .yt-badge-shape__text");
    }
    else if (type === "playlist") {
        timeElements = document.querySelectorAll("#overlays .yt-badge-shape__text");
    }

    let totalSeconds = 0;

    timeElements.forEach(el => {
        if (el.innerText.includes(":")) {
            totalSeconds += parseTime(el.innerText.trim());
        }
    });

    return totalSeconds;
}

function showWatchTimeLabel(type) {
    exists = document.getElementById("playlist-total-time");
    if (exists) return;
    if (type === "playlistVideo") {
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
    else if (type === "playlist") {
        const parent = document.querySelector(".yt-page-header-view-model__scroll-container .yt-page-header-view-model__page-header-content-metadata");
        const watchTimeTextWrapper = document.createElement("div");
        watchTimeTextWrapper.className = "yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color";
        watchTimeTextWrapper.style.marginTop = "2px";
        watchTimeTextWrapper.innerText = "Watch Time:";
        watchTimeTextWrapper.id = "playlist-total-time";
        parent.appendChild(watchTimeTextWrapper);
    }
}

function refreshWatchTime(type) {
    textWrapper = document.getElementById("playlist-total-time");
    if (!textWrapper) return;
    const totalSeconds = calculateWatchTime(type);
    textWrapper.innerText = `Watch Time: ${formatTime(totalSeconds)}`;
}

// playlist here refers to the container of the playlist title and the publisher
function playlistLoaded(type) {
    if (type === "playlistVideo") {
        const playlist = document.getElementById("publisher-container");
        if (!playlist) return false;
        else return true;
    }
    else if (type === "playlist") {
        const scrollContainer = document.querySelector(".yt-page-header-view-model__scroll-container");
        if (!scrollContainer) return false;
        else return true;
    }
}

// allVideos here refers to all the videos and their durations that appear in the playlist
function allVideosLoaded(type) {
    if (!playlistLoaded(type)) return false;

    if (type === "playlistVideo") {
        const spans = document.querySelectorAll("#playlist #publisher-container div .yt-formatted-string");
        const lastSpan = spans[spans.length - 1];
        const videosNum = parseInt(lastSpan.innerText, 10);
        const timeElements = document.querySelectorAll("#playlist #items .yt-badge-shape__text");
        if (timeElements.length === videosNum) return true;
        else return false;
    }
    else if (type === "playlist") {
        const spans = document.querySelectorAll(".yt-page-header-view-model__scroll-container .yt-page-header-view-model__page-header-content-metadata .yt-core-attributed-string");
        const videosText = spans[2].innerText;
        const videosNum = parseInt(videosText, 10);
        const timeElements = document.querySelectorAll("#overlays .yt-badge-shape__text");
        if (timeElements.length === videosNum) return true;
        else return false;
    }
}

function trackWatchTime(type) {
    // Repeatedly refresh watch time until all videos are loaded
    if (!allVideosLoaded(type)) setTimeout(() => trackWatchTime(type), 200);
    refreshWatchTime(type);
}

function displayWatchTime(type) {
    if (!playlistLoaded(type)) {
        setTimeout(() => displayWatchTime(type), 200);
        return;
    }

    showWatchTimeLabel(type);

    trackWatchTime(type);
}

chrome.runtime.onMessage.addListener((message, sender, response) => {
    // playlistVideo refers to the YouTube page where a video of the playlist is being watched with the playlist on the side
    if (message.type === "playlistVideo") {
        displayWatchTime("playlistVideo");
    }
    // playlist refers to the YouTube page of the playlist itself
    else if (message.type === "playlist") {
        displayWatchTime("playlist");
    }
});