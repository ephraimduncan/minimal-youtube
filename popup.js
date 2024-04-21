"use strict";

let enabled = true;
const toggleSwitch = document.getElementById("toggle");

chrome.storage.local.get("enabled", (data) => {
    enabled = typeof data.enabled === "undefined" ? true : !!data.enabled;
    setToggleState();
});

toggleSwitch.addEventListener("change", () => {
    enabled = toggleSwitch.checked;
    chrome.storage.local.set({ enabled: enabled });
});

function setToggleState() {
    toggleSwitch.checked = enabled;
}
