(() => {
    const holidayLightColors = Object.freeze([
        "gold",
        "red",
        "ice",
        "green",
        "gold",
        "ice",
        "red",
        "gold",
        "green",
        "red",
        "ice",
        "gold",
        "red",
        "ice"
    ]);
    const holidayLightPositions = Object.freeze([
        [2, 4],
        [9, 10],
        [16, 15],
        [23, 11],
        [30, 4],
        [37, 9],
        [44, 14],
        [51, 15],
        [58, 10],
        [65, 4],
        [72, 9],
        [79, 14],
        [86, 15],
        [93, 9]
    ]);
    const holidayLightOpacity = Object.freeze([
        0.92,
        0.84,
        0.96,
        0.88,
        0.94,
        0.86,
        0.91,
        0.97,
        0.85,
        0.92,
        0.88,
        0.95,
        0.86,
        0.93
    ]);
    let holidayOnlineTimerId = null;
    let holidayStatusTimerId = null;

    function createHolidayDecorations() {
        const navigation = document.querySelector(".site-header nav");

        if (!navigation) {
            return null;
        }

        const lights = document.createElement("div");
        lights.className = "holiday-lights";
        lights.setAttribute("aria-hidden", "true");

        const cable = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        cable.classList.add("holiday-light-cable");
        cable.setAttribute("viewBox", "0 0 100 20");
        cable.setAttribute("preserveAspectRatio", "none");
        cable.innerHTML = `
            <path class="holiday-cable-shadow" d="M0 4 C6 4 8 16 15 16 C22 16 24 4 30 4 C37 4 39 16 47.5 16 C56 16 58 4 65 4 C72 4 75 16 82.5 16 C90 16 93 4 100 4" />
            <path class="holiday-cable-line" d="M0 4 C6 4 8 16 15 16 C22 16 24 4 30 4 C37 4 39 16 47.5 16 C56 16 58 4 65 4 C72 4 75 16 82.5 16 C90 16 93 4 100 4" />
            <polyline class="holiday-cable-pixel" points="0,4 5,4 5,8 9,8 9,12 13,12 13,15 18,15 18,12 22,12 22,8 26,8 26,4 34,4 34,8 38,8 38,12 43,12 43,15 52,15 52,12 56,12 56,8 60,8 60,4 69,4 69,8 73,8 73,12 78,12 78,15 87,15 87,12 91,12 91,8 95,8 95,4 100,4" />
        `;
        lights.append(cable);

        ["start", "end"].forEach((position) => {
            const sprig = document.createElement("span");
            sprig.className = `holiday-sprig holiday-sprig--${position}`;
            lights.append(sprig);
        });

        holidayLightPositions.forEach(([xPosition, cableY], index) => {
            const light = document.createElement("span");
            const color = holidayLightColors[index];

            light.className = `holiday-light holiday-light--${color}`;
            light.style.setProperty(
                "--holiday-led-x",
                `${xPosition}%`
            );
            light.style.setProperty(
                "--holiday-cable-y",
                `${cableY}px`
            );
            light.style.setProperty(
                "--holiday-led-opacity",
                holidayLightOpacity[index]
            );
            light.style.setProperty(
                "--holiday-led-delay",
                `${660 + index * 75}ms`
            );
            light.style.setProperty(
                "--holiday-led-breathe-delay",
                `${index * -310}ms`
            );
            lights.append(light);
        });

        const status = document.createElement("aside");
        status.className = "holiday-system-init";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        status.setAttribute("aria-label", "Seasonal system status");
        status.setAttribute("aria-hidden", "true");
        status.innerHTML = `
            <p>SEASONAL MODULE DETECTED</p>
            <p>DECEMBER MODE ........ OK</p>
            <p>SNOW SYSTEM .......... ONLINE</p>
            <p>FROST LAYER .......... ONLINE</p>
            <p>HOLIDAY LIGHTS ....... ONLINE</p>
        `;

        navigation.append(lights);
        document.body.append(status);

        return { lights, status };
    }

    const holidayDecorations = createHolidayDecorations();

    function clearHolidayTimers() {
        window.clearTimeout(holidayOnlineTimerId);
        window.clearTimeout(holidayStatusTimerId);
        holidayOnlineTimerId = null;
        holidayStatusTimerId = null;
    }

    function updateHolidayDecorations(winterModeEnabled) {
        if (!holidayDecorations) {
            return;
        }

        const { lights, status } = holidayDecorations;

        clearHolidayTimers();
        document.documentElement.classList.remove(
            "holiday-initializing"
        );
        lights.classList.remove("is-sequencing", "is-online");
        status.classList.remove("is-visible");
        status.setAttribute("aria-hidden", "true");

        if (!winterModeEnabled) {
            return;
        }

        if (
            document.documentElement.classList.contains(
                "motion-reduced"
            )
        ) {
            lights.classList.add("is-online");
            return;
        }

        // Reflow restarts the short one-time LED boot sequence.
        void lights.offsetWidth;
        document.documentElement.classList.add(
            "holiday-initializing"
        );
        lights.classList.add("is-sequencing");
        status.classList.add("is-visible");
        status.setAttribute("aria-hidden", "false");

        holidayOnlineTimerId = window.setTimeout(() => {
            lights.classList.remove("is-sequencing");
            lights.classList.add("is-online");
        }, 1950);

        holidayStatusTimerId = window.setTimeout(() => {
            status.classList.remove("is-visible");
            status.setAttribute("aria-hidden", "true");
            document.documentElement.classList.remove(
                "holiday-initializing"
            );
        }, 2350);
    }

    window.addEventListener("dario:winter-mode-change", (event) => {
        updateHolidayDecorations(event.detail.enabled);
    });

    window.addEventListener(
        "dario:motion-preference-change",
        () => {
            updateHolidayDecorations(
                document.documentElement.classList.contains(
                    "winter-mode"
                )
            );
        }
    );

    function initializeHolidayDecorations() {
        window.setTimeout(() => {
            updateHolidayDecorations(
                document.documentElement.classList.contains(
                    "winter-mode"
                )
            );
        }, 680);
    }

    if (document.readyState === "complete") {
        initializeHolidayDecorations();
    } else {
        window.addEventListener(
            "load",
            initializeHolidayDecorations,
            { once: true }
        );
    }

})();
