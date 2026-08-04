if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}


/*==================================================
        REMOVE URL ANCHOR AFTER NAVIGATION
==================================================*/

window.addEventListener("hashchange", () => {

    history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
    );

});

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

function addReducedMotionListener(listener) {
    if (typeof reducedMotionQuery.addEventListener === "function") {
        reducedMotionQuery.addEventListener("change", listener);
        return;
    }

    reducedMotionQuery.addListener(listener);
}

function removeReducedMotionListener(listener) {
    if (typeof reducedMotionQuery.removeEventListener === "function") {
        reducedMotionQuery.removeEventListener("change", listener);
        return;
    }

    reducedMotionQuery.removeListener(listener);
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





