'use strict';

let enabled = true;
const toggle = document.getElementById('toggle');

chrome.storage.local.get('enabled', data => {
    enabled = typeof data.enabled === "undefined" ? true : !!data.enabled;
    setToggleText();
});

toggle.addEventListener("click", () => {
    enabled = !enabled;
    chrome.storage.local.set({enabled:enabled});
    setToggleText();
});

function setToggleText() {
    toggle.textContent = enabled ? 'Disable' : 'Enable';
}
