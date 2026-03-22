const autoSpeedAdsToggle = document.getElementById("auto-speed-ads");

function renderPopup(enabled) {
    autoSpeedAdsToggle.checked = enabled;
}

chrome.storage.sync.get({ autoSpeedAds: true }, ({ autoSpeedAds }) => {
    renderPopup(!!autoSpeedAds);
});

autoSpeedAdsToggle.addEventListener("change", () => {
    const enabled = autoSpeedAdsToggle.checked;
    chrome.storage.sync.set({ autoSpeedAds: enabled });
    renderPopup(enabled);
});