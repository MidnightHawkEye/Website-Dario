
/*==================================================
                    LOADER
==================================================*/

const loaderElement = document.getElementById("loader");
const loaderRemovalDelayMs = 700;  // CSS fade-out: 600 ms + 100 ms buffer
const loaderFallbackTimeoutMs = 3000;


function hideLoader() {
    if (!loaderElement) {
        return;
    }

    loaderElement.classList.add("loader-hidden");
    loaderElement.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
        loaderElement.style.display = "none";
    }, loaderRemovalDelayMs);
}

window.addEventListener("load", hideLoader);
window.addEventListener("pageshow", hideLoader);
window.setTimeout(hideLoader, loaderFallbackTimeoutMs);
