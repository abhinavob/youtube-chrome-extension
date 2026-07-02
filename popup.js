chrome.storage.sync.get({ adMode: "off", adSpeed: 2 }, ({ adMode, adSpeed }) => {
    document.querySelector(`input[value="${adMode}"]`).checked = true;
    document.getElementById("adSpeed").value = adSpeed;
})

document.querySelectorAll("input[name='adMode']").forEach(radio => {
    radio.addEventListener("change", () => {
        chrome.storage.sync.set({ adMode: radio.value });
    });
})

document.getElementById("adSpeed").addEventListener("change", (e) => {
    chrome.storage.sync.set({ adSpeed: parseFloat(e.target.value) });
})