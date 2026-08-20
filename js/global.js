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
const reducedMotionListenerMap = new WeakMap();


/*==================================================
                MOTION PREFERENCE
==================================================*/

function prefersReducedMotion() {
    return reducedMotionQuery.matches;
}

function addReducedMotionListener(listener) {
    removeReducedMotionListener(listener);

    const motionListener = (event) => {
        listener({
            matches: event.detail.matches,
            media: reducedMotionQuery.media
        });
    };

    reducedMotionListenerMap.set(listener, motionListener);
    window.addEventListener(
        "dario:motion-preference-change",
        motionListener
    );
}

function removeReducedMotionListener(listener) {
    const motionListener = reducedMotionListenerMap.get(listener);

    if (motionListener) {
        window.removeEventListener(
            "dario:motion-preference-change",
            motionListener
        );
        reducedMotionListenerMap.delete(listener);
    }
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





