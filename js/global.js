/*==================================================
                GLOBAL SETTINGS
==================================================*/

const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);


/*==================================================
                MOTION PREFERENCE
==================================================*/

function prefersReducedMotion() {
    return reducedMotionQuery.matches;
}


/*==================================================
                SCROLL BEHAVIOR
==================================================*/

function getScrollBehavior() {
    return prefersReducedMotion() ? "auto" : "smooth";
}

/*==================================================
                TAB VISIBILITY
==================================================*/

function isTabActive() {
    return document.visibilityState === "visible";
}

function updateTabVisibility() {
    document.documentElement.classList.toggle(
        "tab-inactive",
        !isTabActive()
    );
}

document.addEventListener(
    "visibilitychange",
    updateTabVisibility
);

updateTabVisibility();





