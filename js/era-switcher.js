(() => {
    const eraStorageKey = "dario-era";
    const modernEra = "2026";
    const retroEra = "1998";
    const transitionConfig = Object.freeze({
        durationMs: 1850,
        morphStageDelayMs: 240,
        themeCommitDelayMs: 840,
        completeStageDelayMs: 1450,
        counterStartDelayMs: 80,
        counterStepMs: 145,
        reducedTargetDelayMs: 240,
        reducedCompleteDelayMs: 440,
        reducedDurationMs: 700
    });
    const yearSequences = Object.freeze({
        "to-modern": Object.freeze([
            "1998", "2002", "2006", "2010", "2014",
            "2018", "2022", "2024", "2026"
        ]),
        "to-retro": Object.freeze([
            "2026", "2024", "2022", "2018", "2014",
            "2010", "2006", "2002", "1998"
        ])
    });
    const htmlElement = document.documentElement;
    const eraControls = Array.from(
        document.querySelectorAll("[data-era-slider]")
    );
    const eraSwitchers = Array.from(
        document.querySelectorAll(".era-switcher")
    );
    const eraAnnouncer = document.querySelector("[data-era-announcer]");
    const reducedMotionMedia = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );
    const transitionTimeouts = new Set();
    let activeDirection = null;
    let isTransitioning = false;
    let timeCounterElement = null;
    let timeCounterYearElement = null;
    let timeCounterStatusElement = null;

    function normalizeEra(value) {
        return String(value) === retroEra ? retroEra : modernEra;
    }

    function translateEra(key, fallback) {
        if (typeof translate === "function") {
            return translate(key);
        }

        return fallback;
    }

    function scheduleTransitionTask(callback, delay) {
        const timeoutId = window.setTimeout(() => {
            transitionTimeouts.delete(timeoutId);
            callback();
        }, delay);

        transitionTimeouts.add(timeoutId);
        return timeoutId;
    }

    function clearTransitionTasks() {
        transitionTimeouts.forEach((timeoutId) => {
            window.clearTimeout(timeoutId);
        });
        transitionTimeouts.clear();
    }

    function getEraValueText(era) {
        return era === retroEra
            ? translateEra("era.retro", "1998 – Retro DARIO.exe interface")
            : translateEra("era.modern", "2026 – Modern DARIO.exe interface");
    }

    function getTransitionCopy(era) {
        if (era === retroEra) {
            return {
                started: translateEra(
                    "era.rollbackStarted",
                    "ROLLBACK IN PROGRESS..."
                ),
                complete: translateEra(
                    "era.rollbackComplete",
                    "ROLLBACK COMPLETE\nSYSTEM VERSION: 1998"
                ),
                counterComplete: translateEra(
                    "era.rollbackCounterComplete",
                    "ROLLBACK COMPLETE"
                )
            };
        }

        return {
            started: translateEra(
                "era.migrationStarted",
                "MIGRATION STARTED..."
            ),
            complete: translateEra(
                "era.migrationComplete",
                "SYSTEM MIGRATION COMPLETE\nYEAR: 2026"
            ),
            counterComplete: translateEra(
                "era.migrationCounterComplete",
                "SYSTEM MIGRATION COMPLETE"
            )
        };
    }

    function getYearLabel() {
        return translateEra("era.yearLabel", "YEAR");
    }

    function updateSwitcherTravelYear(year, isTarget = false) {
        const displayYear = `${getYearLabel()}: ${year}`;

        eraSwitchers.forEach((switcher) => {
            switcher.dataset.eraTravelYear = displayYear;
            switcher.classList.toggle("is-era-target", isTarget);
        });
    }

    function createTimeCounter() {
        const counter = document.createElement("div");
        const year = document.createElement("span");
        const status = document.createElement("span");

        counter.className = "era-time-counter";
        counter.setAttribute("aria-hidden", "true");
        year.className = "era-time-counter__year";
        status.className = "era-time-counter__status";
        status.hidden = true;
        counter.append(year, status);
        document.body.append(counter);

        timeCounterElement = counter;
        timeCounterYearElement = year;
        timeCounterStatusElement = status;
        updateTimeCounter("----");
    }

    function updateTimeCounter(
        year,
        { status = "", isTarget = false } = {}
    ) {
        if (
            !timeCounterElement ||
            !timeCounterYearElement ||
            !timeCounterStatusElement
        ) {
            return;
        }

        timeCounterYearElement.textContent = year;
        timeCounterStatusElement.textContent = status;
        timeCounterStatusElement.hidden = !status;
        timeCounterElement.classList.toggle("is-target", isTarget);
        updateSwitcherTravelYear(year, isTarget);
    }

    function removeTimeCounter() {
        timeCounterElement?.remove();
        timeCounterElement = null;
        timeCounterYearElement = null;
        timeCounterStatusElement = null;

        eraSwitchers.forEach((switcher) => {
            switcher.classList.remove("is-era-target");
            switcher.removeAttribute("data-era-travel-year");
        });
    }

    function scheduleYearCounter(direction) {
        const years = yearSequences[direction];

        years.forEach((year, index) => {
            scheduleTransitionTask(() => {
                updateTimeCounter(year, {
                    isTarget: index === years.length - 1
                });
            }, transitionConfig.counterStartDelayMs +
                index * transitionConfig.counterStepMs);
        });
    }

    function updateControls(era) {
        const valueText = getEraValueText(era);

        eraControls.forEach((control) => {
            control.value = era;
            control.setAttribute("aria-valuetext", valueText);
        });
    }

    function setControlsDisabled(disabled) {
        eraControls.forEach((control) => {
            control.disabled = disabled;
            control.setAttribute("aria-busy", String(disabled));
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

    function dispatchMatrixTransition(active, direction = null) {
        window.dispatchEvent(new CustomEvent("dario:era-transition", {
            detail: { active, direction }
        }));
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
        const completedDirection = activeDirection;

        clearTransitionTasks();
        htmlElement.classList.remove(
            "era-transition",
            "era-transition-to-modern",
            "era-transition-to-retro",
            "era-transition-reduced"
        );
        htmlElement.removeAttribute("data-era-target");
        htmlElement.removeAttribute("data-era-stage");
        htmlElement.removeAttribute("data-era-transition-message");
        removeTimeCounter();
        setControlsDisabled(false);
        activeDirection = null;
        isTransitioning = false;

        if (completedDirection) {
            dispatchMatrixTransition(false, completedDirection);
        }
    }

    function finishEraTransition(era, shouldAnnounce) {
        clearEraTransition();

        if (shouldAnnounce) {
            announceEra(era);
        }
    }

    function runReducedEraTransition(era, options) {
        const copy = getTransitionCopy(era);
        const years = yearSequences[activeDirection];
        const targetYear = years[years.length - 1];

        htmlElement.classList.add("era-transition-reduced");
        htmlElement.dataset.eraStage = "react";
        htmlElement.dataset.eraTransitionMessage = copy.started;
        updateTimeCounter(years[0]);

        scheduleTransitionTask(() => {
            commitEra(era, { persist: options.persist });
            htmlElement.dataset.eraStage = "bridge";
            updateTimeCounter(targetYear, { isTarget: true });
        }, transitionConfig.reducedTargetDelayMs);

        scheduleTransitionTask(() => {
            htmlElement.dataset.eraStage = "complete";
            htmlElement.dataset.eraTransitionMessage = copy.complete;
            updateTimeCounter(targetYear, {
                status: copy.counterComplete,
                isTarget: true
            });
        }, transitionConfig.reducedCompleteDelayMs);

        scheduleTransitionTask(() => {
            finishEraTransition(era, options.announce);
        }, transitionConfig.reducedDurationMs);
    }

    function runAnimatedEraTransition(era, options) {
        const copy = getTransitionCopy(era);
        const years = yearSequences[activeDirection];
        const targetYear = years[years.length - 1];

        htmlElement.dataset.eraStage = "react";
        htmlElement.dataset.eraTransitionMessage = copy.started;
        dispatchMatrixTransition(true, activeDirection);
        scheduleYearCounter(activeDirection);

        scheduleTransitionTask(() => {
            htmlElement.dataset.eraStage = "morph";
        }, transitionConfig.morphStageDelayMs);

        scheduleTransitionTask(() => {
            commitEra(era, { persist: options.persist });
            htmlElement.dataset.eraStage = "bridge";
        }, transitionConfig.themeCommitDelayMs);

        scheduleTransitionTask(() => {
            htmlElement.dataset.eraStage = "complete";
            htmlElement.dataset.eraTransitionMessage = copy.complete;
            updateTimeCounter(targetYear, {
                status: copy.counterComplete,
                isTarget: true
            });
        }, transitionConfig.completeStageDelayMs);

        scheduleTransitionTask(() => {
            finishEraTransition(era, options.announce);
        }, transitionConfig.durationMs);
    }

    function changeEra(
        value,
        { persist = true, announce = true } = {}
    ) {
        const nextEra = normalizeEra(value);
        const currentEra = normalizeEra(htmlElement.dataset.era);

        if (isTransitioning) {
            updateControls(currentEra);
            return;
        }

        updateControls(nextEra);

        if (currentEra === nextEra) {
            commitEra(nextEra, { persist });
            return;
        }

        const prefersQuietChange = reducedMotionMedia.matches ||
            (typeof prefersReducedMotion === "function" &&
                prefersReducedMotion());

        activeDirection = nextEra === modernEra
            ? "to-modern"
            : "to-retro";
        isTransitioning = true;
        setControlsDisabled(true);
        htmlElement.dataset.eraTarget = nextEra;
        htmlElement.classList.add(
            "era-transition",
            `era-transition-${activeDirection}`
        );
        createTimeCounter();

        if (prefersQuietChange) {
            runReducedEraTransition(nextEra, { persist, announce });
            return;
        }

        runAnimatedEraTransition(nextEra, { persist, announce });
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

    window.addEventListener("pagehide", () => {
        clearEraTransition();
    });

    commitEra(normalizeEra(htmlElement.dataset.era), {
        persist: false
    });
})();
