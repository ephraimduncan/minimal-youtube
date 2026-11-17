"use strict";

const enabled = document.getElementById("enabled");
const features = document.getElementById("features");
const count = document.getElementById("count");
const template = document.getElementById("feature");

chrome.storage.local.get(DEFAULTS, (settings) => {
    enabled.checked = settings.enabled;
    for (const feature of FEATURES) {
        const row = template.content.cloneNode(true);
        const box = row.querySelector("input");
        box.value = feature.id;
        box.checked = !settings.shown.includes(feature.id);
        row.querySelector(".name").textContent = feature.label;
        row.querySelector(".hint").textContent = feature.hint ?? "";
        features.append(row);
    }
    render();
    // The body stays hidden until now so that the controls do not animate to the stored state.
    document.body.hidden = false;
});

document.addEventListener("change", () => {
    chrome.storage.local.set({
        enabled: enabled.checked,
        shown: boxes()
            .filter((box) => !box.checked)
            .map((box) => box.value),
    });
    render();
});

function render() {
    features.disabled = !enabled.checked;
    const checked = boxes().filter((box) => box.checked).length;
    count.textContent = `${checked} of ${FEATURES.length}`;
}

function boxes() {
    return [...features.querySelectorAll("input")];
}
