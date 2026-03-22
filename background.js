chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && changeInfo.status === 'complete') {
        const queryParams = tab.url.split('?')[1];
        const urlParams = new URLSearchParams(queryParams);
        if (tab.url.includes('youtube.com/playlist')) {
            chrome.tabs.sendMessage(tabId, { type: "playlist" });
        }
        else if (urlParams.has('list')) {
            chrome.tabs.sendMessage(tabId, { type: "playlistVideo" });
        }
    }
});

chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (!tab || !tab.id || !tab.url) return;

        chrome.tabs.sendMessage(tab.id, { command });
    });
});