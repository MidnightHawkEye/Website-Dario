
/*==================================================
                    LOADER
==================================================*/

const loader = document.getElementById("loader");
const LoaderRemovalDelay_MS = 700;  // CSS fade-out: 600 ms + 100 ms buffer
const LoaderFallbackTimeoutMS = 3000;


function hideLoader() {
    if (!loader) {
        return;
    }

    loader.classList.add("loader-hidden");
    loader.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
        loader.style.display = "none";
    }, LoaderRemovalDelay_MS);
}

window.addEventListener("load", hideLoader);
window.addEventListener("pageshow", hideLoader);
window.setTimeout(hideLoader, LoaderFallbackTimeoutMS);