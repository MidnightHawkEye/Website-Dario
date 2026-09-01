(() => {
    const eraStorageKey = "dario-era";
    let initialEra = "2026";

    try {
        if (localStorage.getItem(eraStorageKey) === "1998") {
            initialEra = "1998";
        }
    } catch {
        initialEra = "2026";
    }

    document.documentElement.dataset.era = initialEra;
})();

(() => {
    const motionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    function applyMotionPreference({ announce = false } = {}) {
        const reduced = motionQuery.matches;

        document.documentElement.classList.toggle(
            "motion-reduced",
            reduced
        );
        document.documentElement.dataset.motionPreference = reduced
            ? "reduced"
            : "normal";

        if (announce) {
            window.dispatchEvent(new CustomEvent(
                "dario:motion-preference-change",
                {
                    detail: {
                        matches: reduced,
                        reduced
                    }
                }
            ));
        }

        return reduced;
    }

    const handleSystemMotionChange = () => {
        applyMotionPreference({ announce: true });
    };

    if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener(
            "change",
            handleSystemMotionChange
        );
    } else {
        motionQuery.addListener(handleSystemMotionChange);
    }

    applyMotionPreference();
})();

(() => {
    const winterModeClass = "winter-mode";
    const snowModeClass = "snow-mode";
    const decemberMonthIndex = 11;
    const rootElement = document.documentElement;

    function isWinterSeason(referenceDate) {
        return referenceDate.getMonth() === decemberMonthIndex;
    }

    function getWinterPhase(referenceDate, winterModeEnabled) {
        if (!winterModeEnabled) {
            return "off";
        }

        const isDecember =
            referenceDate.getMonth() === decemberMonthIndex;
        const decemberDay = isDecember
            ? referenceDate.getDate()
            : 1;

        if (decemberDay >= 24 && decemberDay <= 26) {
            return "peak";
        }

        if (decemberDay >= 27) {
            return "late";
        }

        return "early";
    }

    function applySeasonalState(
        referenceDate,
        { announce = false } = {}
    ) {
        const winterModeEnabled = isWinterSeason(referenceDate);
        const previousWinterModeEnabled = rootElement.classList.contains(
            winterModeClass
        );
        const previousSnowModeEnabled = rootElement.classList.contains(
            snowModeClass
        );
        const previousWinterPhase = rootElement.dataset.winterPhase;
        const winterPhase = getWinterPhase(
            referenceDate,
            winterModeEnabled
        );

        rootElement.classList.toggle(
            winterModeClass,
            winterModeEnabled
        );
        rootElement.classList.toggle(
            snowModeClass,
            winterModeEnabled
        );
        rootElement.dataset.winterPhase = winterPhase;

        if (
            announce &&
            previousSnowModeEnabled !== winterModeEnabled
        ) {
            window.dispatchEvent(new CustomEvent(
                "dario:snow-mode-change",
                {
                    detail: {
                        enabled: winterModeEnabled,
                        source: "calendar"
                    }
                }
            ));
        }

        if (
            announce &&
            (
                previousWinterModeEnabled !== winterModeEnabled ||
                previousWinterPhase !== winterPhase
            )
        ) {
            window.dispatchEvent(new CustomEvent(
                "dario:winter-mode-change",
                {
                    detail: {
                        enabled: winterModeEnabled,
                        phase: winterPhase,
                        source: "calendar"
                    }
                }
            ));
        }

        return winterModeEnabled;
    }

    function scheduleNextWinterModeCheck(referenceDate) {
        const nextLocalDay = new Date(referenceDate);
        nextLocalDay.setHours(24, 0, 0, 50);

        window.setTimeout(() => {
            const currentDate = new Date();
            applySeasonalState(currentDate, { announce: true });
            scheduleNextWinterModeCheck(currentDate);
        }, Math.max(1000, nextLocalDay.getTime() - referenceDate.getTime()));
    }

    window.darioWinterMode = Object.freeze({
        isActive() {
            return rootElement.classList.contains(winterModeClass);
        },
        getPhase() {
            return rootElement.dataset.winterPhase;
        },
        isWinterSeason
    });

    const initialDate = new Date();
    applySeasonalState(initialDate);
    scheduleNextWinterModeCheck(initialDate);
})();
