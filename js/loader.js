
/*==================================================
                    LOADER
==================================================*/

const loaderElement = document.getElementById("loader");
const loaderRemovalDelayMs = 700;  // CSS fade-out: 600 ms + 100 ms buffer
const loaderFallbackTimeoutMs = 3000;
let loaderRemovalTimeoutId = null;

function removeLoader() {
    if (loaderRemovalTimeoutId !== null) {
        clearTimeout(loaderRemovalTimeoutId);
        loaderRemovalTimeoutId = null;
    }

    loaderElement.style.display = "none";
}

function hideLoader() {
    if (!loaderElement) {
        return;
    }

    loaderElement.classList.add("loader-hidden");
    loaderElement.setAttribute("aria-hidden", "true");

    if (prefersReducedMotion()) {
        removeLoader();
        return;
    }

    if (loaderRemovalTimeoutId !== null) {
        clearTimeout(loaderRemovalTimeoutId);
    }

    loaderRemovalTimeoutId = window.setTimeout(
        removeLoader,
        loaderRemovalDelayMs
    );
}

addReducedMotionListener((event) => {
    if (
        event.matches &&
        loaderElement?.classList.contains("loader-hidden")
    ) {
        removeLoader();
    }
});

window.addEventListener("load", hideLoader);
window.addEventListener("pageshow", hideLoader);
window.setTimeout(hideLoader, loaderFallbackTimeoutMs);
