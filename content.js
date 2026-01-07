function parseTime(timeStr) {
    // "1:23:45" or "12:34"
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

function showTotalTime() {
    const existing = document.getElementById("playlist-total-time");
    if (existing) return;

    const totalSeconds = calculatePlaylistTime();
    if (totalSeconds === 0) return;

    const header = document.getElementById("header-description");
    const watchTimeContainer = document.createElement("div");
    watchTimeContainer.className = "style-scope ytd-playlist-panel-renderer";
    watchTimeContainer.style.marginTop = "2px";
    const textWrapper = document.createElement("div");
    textWrapper.className = "index-message-wrapper style-scope ytd-playlist-panel-renderer";
    textWrapper.innerText = `Watch Time: ${formatTime(totalSeconds)}`;
    textWrapper.id = "playlist-total-time";
    watchTimeContainer.appendChild(textWrapper);
    header.appendChild(watchTimeContainer);
}

// Wait for 3 seconds for the page to load before displaying the total watch time
setTimeout(showTotalTime, 3000);