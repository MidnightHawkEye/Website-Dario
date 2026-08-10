(() => {
    const eraStorageKey = "dario-era";
    const modernEra = "2026";
    const retroEra = "1998";
    const transitionSwitchDelayMs = 180;
    const transitionEndDelayMs = 720;
    const htmlElement = document.documentElement;
    const eraControls = document.querySelectorAll("[data-era-slider]");
    const eraAnnouncer = document.querySelector("[data-era-announcer]");
    const reducedMotionMedia = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );
    let switchTimeoutId;
    let transitionTimeoutId;

    function normalizeEra(value) {
        return String(value) === retroEra ? retroEra : modernEra;
    }

    function translateEra(key, fallback) {
        if (typeof translate === "function") {
            return translate(key);
        }

        return fallback;
    }

    function getEraValueText(era) {
        return era === retroEra
            ? translateEra("era.retro", "1998 – Retro DARIO.exe interface")
            : translateEra("era.modern", "2026 – Modern DARIO.exe interface");
    }

    function updateControls(era) {
        const valueText = getEraValueText(era);

        eraControls.forEach((control) => {
            control.value = era;
            control.setAttribute("aria-valuetext", valueText);
        });
    }

    function updateThemeColor(era) {
        const themeColor = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (themeColor) {
            themeColor.setAttribute(
                "content",
                era === retroEra ? "#008080" : "#000000"
            );
        }
    }

    function persistEra(era) {
        try {
            localStorage.setItem(eraStorageKey, era);
        } catch {
            // The selected era still works when storage is unavailable.
        }
    }

    function announceEra(era) {
        if (!eraAnnouncer) {
            return;
        }

        eraAnnouncer.textContent = era === retroEra
            ? translateEra(
                "era.changedRetro",
                "Time travel complete: the retro 1998 interface is active."
            )
            : translateEra(
                "era.changedModern",
                "Time travel complete: the modern 2026 interface is active."
            );
    }

    function commitEra(era, { persist = true } = {}) {
        htmlElement.dataset.era = era;
        updateControls(era);
        updateThemeColor(era);

        window.dispatchEvent(new CustomEvent("dario:era-change", {
            detail: { era }
        }));

        if (persist) {
            persistEra(era);
        }
    }

    function clearEraTransition() {
        window.clearTimeout(switchTimeoutId);
        window.clearTimeout(transitionTimeoutId);
        htmlElement.classList.remove("era-transition");
        htmlElement.removeAttribute("data-era-target");
    }

    function changeEra(value, { persist = true, announce = true } = {}) {
        const nextEra = normalizeEra(value);
        const currentEra = normalizeEra(htmlElement.dataset.era);

        clearEraTransition();
        updateControls(nextEra);

        if (currentEra === nextEra) {
            commitEra(nextEra, { persist });
            return;
        }

        const prefersQuietChange = reducedMotionMedia.matches ||
            (typeof prefersReducedMotion === "function" &&
                prefersReducedMotion());

        if (prefersQuietChange) {
            commitEra(nextEra, { persist });

            if (announce) {
                announceEra(nextEra);
            }

            return;
        }

        htmlElement.dataset.eraTarget = nextEra;
        htmlElement.classList.add("era-transition");

        switchTimeoutId = window.setTimeout(() => {
            commitEra(nextEra, { persist });
        }, transitionSwitchDelayMs);

        transitionTimeoutId = window.setTimeout(() => {
            clearEraTransition();

            if (announce) {
                announceEra(nextEra);
            }
        }, transitionEndDelayMs);
    }

    eraControls.forEach((control) => {
        control.addEventListener("change", () => {
            changeEra(control.value);
        });
    });

    window.addEventListener("storage", (event) => {
        if (event.key === eraStorageKey && event.newValue) {
            changeEra(event.newValue, {
                persist: false,
                announce: false
            });
        }
    });

    commitEra(normalizeEra(htmlElement.dataset.era), {
        persist: false
    });
})();
