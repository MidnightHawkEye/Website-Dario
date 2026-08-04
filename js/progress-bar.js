const progressBarElement =
document.getElementById("progress-bar");


function updateProgressBar() {
    if (!progressBarElement) {
        return;
    }

    const documentElement =
        document.documentElement;

    const scrollTop = Math.max(
        0,
        window.scrollY || documentElement.scrollTop || 0
    );

    const scrollableHeight = Math.max(
        1,
        documentElement.scrollHeight - window.innerHeight
    );

    const progress = Math.min(
        100,
        Math.max(
            0,
            (scrollTop / scrollableHeight) * 100
        )
    );

    progressBarElement.style.width = `${progress}%`;
}


function requestProgressUpdate() {
    requestAnimationFrame(updateProgressBar);
}


window.addEventListener(
    "scroll",
    requestProgressUpdate,
    { passive: true }
);

window.addEventListener(
    "resize",
    requestProgressUpdate
);

window.addEventListener(
    "load",
    requestProgressUpdate
);

window.addEventListener(
    "pageshow",
    requestProgressUpdate
);

window.addEventListener(
    "orientationchange",
    () => {
        setTimeout(requestProgressUpdate, 150);
    }
);

document.addEventListener(
    "DOMContentLoaded",
    requestProgressUpdate
);
