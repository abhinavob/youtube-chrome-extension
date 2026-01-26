const input = document.getElementById("site");
const add = document.getElementById("add");
const list = document.getElementById("list");

function render(sites) {
    list.innerHTML = "";

    sites.forEach((site, index) => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = site;

        const del = document.createElement("button");
        del.textContent = "X";
        del.onclick = () => {
            sites.splice(index, 1);
            chrome.storage.sync.set({ sites });
            render(sites);
        };

        li.appendChild(text);
        li.appendChild(del);
        list.appendChild(li);
    });
}

chrome.storage.sync.get(
    { sites: ["youtube.com"] },
    ({ sites }) => render(sites)
);

add.onclick = () => {
    const site = input.value.trim();
    if (!site) return;

    chrome.storage.sync.get(
        { sites: ["youtube.com"] },
        ({ sites }) => {
            if (sites.includes(site)) return;

            sites.push(site);
            chrome.storage.sync.set({ sites });
            render(sites);
            input.value = "";
        }
    );
};