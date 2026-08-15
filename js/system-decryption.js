const systemDecryptionConfig = Object.freeze({
    triggerClickCount: 5,
    triggerWindowMs: 3000,
    triggerRevealDelayMs: 680,
    roundLengths: Object.freeze([3, 4, 5]),
    failureDurationsMs: Object.freeze([10000, 15000, 20000]),
    sequenceLeadInMs: 507,
    symbolStepMs: 800,
    roundFeedbackMs: 1050,
    finalAccessGrantedMs: 900,
    finalDecodeStepMs: 700,
    finalAutoCloseMs: 2000,
    inactivityTimeoutMs: 45000,
    crashCountdownSeconds: 3,
    repairDurationMs: 900
});

const systemDecryptionSymbols = Object.freeze([
    Object.freeze({ value: "●", name: "circle" }),
    Object.freeze({ value: "▲", name: "triangle" }),
    Object.freeze({ value: "■", name: "square" }),
    Object.freeze({ value: "◆", name: "diamond" }),
    Object.freeze({ value: "+", name: "plus" }),
    Object.freeze({ value: "×", name: "multiply" })
]);

const systemDecryptionFinalSteps = Object.freeze([
    Object.freeze({
        text: "D@R#O.e?e // SYST3M ACT1V_",
        progress: 0.18
    }),
    Object.freeze({
        text: "DARI#.e?e // SYST3M ACT1V_",
        progress: 0.38
    }),
    Object.freeze({
        text: "DARIO.e?e // SYSTEM ACT1V_",
        progress: 0.62
    }),
    Object.freeze({
        text: "DARIO.exe // SYSTEM ACTIV_",
        progress: 0.82
    })
]);

const systemDecryptionHtmlElement = document.documentElement;
const systemDecryptionTriggers = Array.from(
    document.querySelectorAll(".system-decryption-trigger")
);
const systemDecryptionSignal = document.getElementById(
    "system-decryption-signal"
);
const systemDecryptionOverlay = document.getElementById(
    "system-decryption-overlay"
);
const systemDecryptionTerminal = document.getElementById(
    "system-decryption-terminal"
);
const systemDecryptionCloseButton = document.getElementById(
    "system-decryption-close"
);
const systemDecryptionStatus = document.getElementById(
    "system-decryption-status"
);
const systemDecryptionSequenceDisplay = document.getElementById(
    "system-decryption-sequence"
);
const systemDecryptionInputDisplay = document.getElementById(
    "system-decryption-input"
);
const systemDecryptionGame = document.querySelector(
    ".system-decryption-game"
);
const systemDecryptionFinal = document.querySelector(
    ".system-decryption-final"
);
const systemDecryptionFinalTitle = systemDecryptionFinal.querySelector(
    "strong"
);
const systemDecryptionCrash = document.querySelector(
    ".system-decryption-crash"
);
const systemDecryptionCountdown = document.getElementById(
    "system-decryption-countdown"
);
const systemDecryptionSymbolButtons = Array.from(
    document.querySelectorAll("[data-decryption-symbol]")
);
const systemDecryptionRoundIndicators = Array.from(
    document.querySelectorAll("[data-decryption-round]")
);
const systemDecryptionAbortHint = document.querySelector(
    ".system-decryption-abort-hint"
);
const systemDecryptionTextExclusionSelector = [
    "#system-decryption-overlay",
    "#system-decryption-signal",
    "#system-decryption-signal-layer",
    "script",
    "style",
    "noscript",
    "template",
    "textarea",
    "option",
    "[hidden]",
    '[aria-hidden="true"]'
].join(",");
const systemDecryptionCorruptedTextContainers = new Set();

const systemDecryptionState = {
    activeTrigger: null,
    clickTimes: [],
    completedRounds: 0,
    currentRound: 0,
    currentSequence: [],
    inputSequence: [],
    phase: "closed",
    statusKey: "decryption.ready",
    isTriggering: false,
    isOpen: false,
    isCompletionLocked: false,
    scheduledTimeouts: new Set(),
    inactivityTimeoutId: null,
    previousFocus: null,
    inertElements: []
};

function scheduleSystemDecryptionTask(callback, delay) {
    const timeoutId = window.setTimeout(() => {
        systemDecryptionState.scheduledTimeouts.delete(timeoutId);
        callback();
    }, delay);

    systemDecryptionState.scheduledTimeouts.add(timeoutId);
    return timeoutId;
}

function cancelSystemDecryptionTask(timeoutId) {
    if (timeoutId === null) {
        return;
    }

    window.clearTimeout(timeoutId);
    systemDecryptionState.scheduledTimeouts.delete(timeoutId);
}

function clearSystemDecryptionTasks() {
    systemDecryptionState.scheduledTimeouts.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
    });
    systemDecryptionState.scheduledTimeouts.clear();
    systemDecryptionState.inactivityTimeoutId = null;
}

function getSystemDecryptionText(key) {
    return typeof translate === "function" ? translate(key) : key;
}

function setSystemDecryptionStatus(key, state = "normal") {
    systemDecryptionState.statusKey = key;
    systemDecryptionStatus.textContent = getSystemDecryptionText(key);
    systemDecryptionStatus.dataset.state = state;
}

function setSystemDecryptionControlsEnabled(enabled) {
    systemDecryptionSymbolButtons.forEach((button) => {
        button.disabled = !enabled;
    });
}

function updateSystemDecryptionRounds() {
    systemDecryptionRoundIndicators.forEach((indicator, index) => {
        const isComplete = index < systemDecryptionState.completedRounds;
        const isCurrent =
            index === systemDecryptionState.currentRound &&
            systemDecryptionState.phase !== "complete";

        indicator.dataset.state = isComplete
            ? "complete"
            : isCurrent
                ? "current"
                : "pending";

        if (isCurrent) {
            indicator.setAttribute("aria-current", "step");
        } else {
            indicator.removeAttribute("aria-current");
        }
    });
}

function applySystemDecryptionLevel(level) {
    [1, 2, 3].forEach((levelNumber) => {
        systemDecryptionHtmlElement.classList.toggle(
            `system-decryption-level-${levelNumber}`,
            level === levelNumber
        );
    });
}

function updateSystemDecryptionMatrix(phase, progress = 0) {
    window.dispatchEvent(new CustomEvent("dario:matrix-decryption", {
        detail: { phase, progress }
    }));
}

function getRandomSystemDecryptionSequence(length) {
    return Array.from({ length }, () => {
        const symbolIndex = Math.floor(
            Math.random() * systemDecryptionSymbols.length
        );

        return systemDecryptionSymbols[symbolIndex];
    });
}

function getSystemDecryptionSymbolLabel(symbol) {
    return getSystemDecryptionText(`decryption.symbol${
        symbol.name[0].toUpperCase() + symbol.name.slice(1)
    }`);
}

function showSystemDecryptionSequence(displayedSymbolCount) {
    const displayedSequence = systemDecryptionState.currentSequence.slice(
        0,
        displayedSymbolCount
    );

    systemDecryptionSequenceDisplay.textContent = displayedSequence
        .map((symbol) => symbol.value)
        .join(" ");
    systemDecryptionSequenceDisplay.setAttribute(
        "aria-label",
        displayedSequence.map(getSystemDecryptionSymbolLabel).join(", ")
    );
    systemDecryptionSequenceDisplay.classList.remove("is-visible");
    void systemDecryptionSequenceDisplay.offsetWidth;
    systemDecryptionSequenceDisplay.classList.add("is-visible");
}

function resetSystemDecryptionInactivityTimer() {
    cancelSystemDecryptionTask(
        systemDecryptionState.inactivityTimeoutId
    );
    systemDecryptionState.inactivityTimeoutId = null;

    if (
        systemDecryptionConfig.inactivityTimeoutMs <= 0 ||
        !systemDecryptionState.isOpen ||
        [
            "finalizing",
            "decrypting",
            "complete",
            "crash",
            "repairing"
        ].includes(
            systemDecryptionState.phase
        )
    ) {
        return;
    }

    systemDecryptionState.inactivityTimeoutId =
        scheduleSystemDecryptionTask(
            beginSystemDecryptionCrash,
            systemDecryptionConfig.inactivityTimeoutMs
        );
}

function beginSystemDecryptionInput() {
    systemDecryptionState.phase = "input";
    systemDecryptionSequenceDisplay.setAttribute(
        "aria-label",
        systemDecryptionState.currentSequence
            .map(getSystemDecryptionSymbolLabel)
            .join(", ")
    );
    setSystemDecryptionStatus("decryption.repeat");
    setSystemDecryptionControlsEnabled(true);
    resetSystemDecryptionInactivityTimer();
    systemDecryptionSymbolButtons[0]?.focus({ preventScroll: true });
}

function playSystemDecryptionSequence() {
    let symbolIndex = 0;

    function playNextSymbol() {
        if (
            !systemDecryptionState.isOpen ||
            systemDecryptionState.phase !== "showing"
        ) {
            return;
        }

        symbolIndex += 1;
        showSystemDecryptionSequence(symbolIndex);

        if (symbolIndex >= systemDecryptionState.currentSequence.length) {
            beginSystemDecryptionInput();
            return;
        }

        scheduleSystemDecryptionTask(
            playNextSymbol,
            systemDecryptionConfig.symbolStepMs
        );
    }

    scheduleSystemDecryptionTask(
        playNextSymbol,
        systemDecryptionConfig.sequenceLeadInMs
    );
}

function restoreSystemDecryptionPageText() {
    systemDecryptionCorruptedTextContainers.forEach((container) => {
        if (!container.isConnected) {
            return;
        }

        container.replaceWith(
            document.createTextNode(container.textContent || "")
        );
    });

    systemDecryptionCorruptedTextContainers.clear();
    document.body.normalize();
}

function corruptSystemDecryptionPageText() {
    restoreSystemDecryptionPageText();

    const textNodes = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const parent = node.parentElement;

                if (
                    !parent ||
                    !node.nodeValue?.trim() ||
                    parent.closest(systemDecryptionTextExclusionSelector)
                ) {
                    return NodeFilter.FILTER_REJECT;
                }

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    let characterIndex = 0;

    textNodes.forEach((textNode) => {
        const textContainer = document.createElement("span");
        textContainer.className = "decryption-corrupt-text";

        textNode.nodeValue.split(/(\s+)/u).forEach((segment) => {
            if (!segment || /\s/u.test(segment)) {
                textContainer.append(document.createTextNode(segment));
                return;
            }

            const word = document.createElement("span");
            word.className = "decryption-corrupt-word";

            Array.from(segment).forEach((character) => {
                const span = document.createElement("span");
                span.className = [
                    "decryption-corrupt-character",
                    `decryption-corrupt-character--${characterIndex % 4}`
                ].join(" ");
                span.style.setProperty(
                    "--corruption-index",
                    String(characterIndex % 41)
                );
                span.textContent = character;
                word.append(span);
                characterIndex += 1;
            });

            textContainer.append(word);
        });

        systemDecryptionCorruptedTextContainers.add(textContainer);
        textNode.replaceWith(textContainer);
    });
}

function startSystemDecryptionRound() {
    const sequenceLength = systemDecryptionConfig.roundLengths[
        systemDecryptionState.currentRound
    ];

    restoreSystemDecryptionPageText();
    systemDecryptionState.phase = "showing";
    systemDecryptionState.currentSequence =
        getRandomSystemDecryptionSequence(sequenceLength);
    systemDecryptionState.inputSequence = [];
    systemDecryptionInputDisplay.textContent = "";
    systemDecryptionSequenceDisplay.textContent = "";
    systemDecryptionSequenceDisplay.setAttribute(
        "aria-label",
        getSystemDecryptionText("decryption.sequenceLabel")
    );
    systemDecryptionSequenceDisplay.classList.remove("is-visible");
    systemDecryptionHtmlElement.classList.remove(
        "system-decryption-failed"
    );
    systemDecryptionTerminal.classList.remove("is-failed");
    setSystemDecryptionStatus("decryption.memorize");
    setSystemDecryptionControlsEnabled(false);
    updateSystemDecryptionRounds();
    resetSystemDecryptionInactivityTimer();
    playSystemDecryptionSequence();
}

function failSystemDecryptionRound() {
    const failureDuration = systemDecryptionConfig.failureDurationsMs[
        systemDecryptionState.currentRound
    ];

    systemDecryptionState.phase = "failed";
    systemDecryptionState.inputSequence = [];
    systemDecryptionInputDisplay.textContent = "";
    cancelSystemDecryptionTask(
        systemDecryptionState.inactivityTimeoutId
    );
    systemDecryptionState.inactivityTimeoutId = null;
    setSystemDecryptionControlsEnabled(false);
    setSystemDecryptionStatus("decryption.failed", "error");
    systemDecryptionHtmlElement.classList.add(
        "system-decryption-failed"
    );
    systemDecryptionTerminal.classList.add("is-failed");
    setSystemDecryptionBackgroundInert(false);
    corruptSystemDecryptionPageText();

    scheduleSystemDecryptionTask(() => {
        systemDecryptionHtmlElement.classList.remove(
            "system-decryption-failed"
        );
        systemDecryptionTerminal.classList.remove("is-failed");
        restoreSystemDecryptionPageText();
        setSystemDecryptionBackgroundInert(true);
        systemDecryptionTerminal.focus({ preventScroll: true });
        startSystemDecryptionRound();
    }, failureDuration);
}

function completeSystemDecryptionFinal() {
    systemDecryptionState.phase = "complete";
    systemDecryptionFinalTitle.textContent = getSystemDecryptionText(
        "decryption.activeTitle"
    );
    systemDecryptionFinalTitle.classList.add("is-unlocked");
    systemDecryptionHtmlElement.classList.remove(
        "system-decryption-finalizing",
        "system-decryption-decrypting"
    );
    systemDecryptionHtmlElement.classList.add(
        "system-decryption-active",
        "system-decryption-decrypted"
    );
    updateSystemDecryptionMatrix("unlocked", 1);

    scheduleSystemDecryptionTask(
        closeCompletedSystemDecryption,
        systemDecryptionConfig.finalAutoCloseMs
    );
}

function beginSystemDecryptionDecode() {
    systemDecryptionState.phase = "decrypting";
    systemDecryptionHtmlElement.classList.remove(
        "system-decryption-finalizing"
    );
    systemDecryptionHtmlElement.classList.add(
        "system-decryption-decrypting"
    );

    systemDecryptionFinalSteps.forEach((step, index) => {
        scheduleSystemDecryptionTask(() => {
            systemDecryptionFinalTitle.textContent = step.text;
            updateSystemDecryptionMatrix("decrypt", step.progress);
        }, index * systemDecryptionConfig.finalDecodeStepMs);
    });

    scheduleSystemDecryptionTask(
        completeSystemDecryptionFinal,
        systemDecryptionFinalSteps.length *
            systemDecryptionConfig.finalDecodeStepMs
    );
}

function activateSystemDecryptionFinal() {
    systemDecryptionState.phase = "finalizing";
    systemDecryptionState.isCompletionLocked = true;
    systemDecryptionState.completedRounds = 3;
    cancelSystemDecryptionTask(
        systemDecryptionState.inactivityTimeoutId
    );
    systemDecryptionState.inactivityTimeoutId = null;
    setSystemDecryptionControlsEnabled(false);
    setSystemDecryptionStatus("decryption.accessGranted");
    updateSystemDecryptionRounds();
    applySystemDecryptionLevel(3);
    systemDecryptionHtmlElement.classList.add(
        "system-decryption-finalizing"
    );
    systemDecryptionGame.hidden = true;
    systemDecryptionFinal.hidden = false;
    systemDecryptionFinal.setAttribute("aria-live", "polite");
    systemDecryptionFinalTitle.textContent = "";
    systemDecryptionFinalTitle.classList.remove("is-unlocked");
    systemDecryptionCloseButton.hidden = true;
    systemDecryptionAbortHint.hidden = true;
    systemDecryptionTerminal.focus({ preventScroll: true });
    updateSystemDecryptionMatrix("escalate", 0);

    scheduleSystemDecryptionTask(
        beginSystemDecryptionDecode,
        systemDecryptionConfig.finalAccessGrantedMs
    );
}

function completeSystemDecryptionRound() {
    systemDecryptionState.phase = "feedback";
    systemDecryptionState.completedRounds =
        systemDecryptionState.currentRound + 1;
    setSystemDecryptionControlsEnabled(false);
    setSystemDecryptionStatus("decryption.roundComplete");
    applySystemDecryptionLevel(systemDecryptionState.completedRounds);
    updateSystemDecryptionRounds();

    if (
        systemDecryptionState.currentRound ===
        systemDecryptionConfig.roundLengths.length - 1
    ) {
        scheduleSystemDecryptionTask(
            activateSystemDecryptionFinal,
            systemDecryptionConfig.roundFeedbackMs
        );
        return;
    }

    systemDecryptionState.currentRound += 1;
    updateSystemDecryptionRounds();
    scheduleSystemDecryptionTask(
        startSystemDecryptionRound,
        systemDecryptionConfig.roundFeedbackMs
    );
}

function handleSystemDecryptionSymbol(button) {
    if (systemDecryptionState.phase !== "input") {
        return;
    }

    resetSystemDecryptionInactivityTimer();

    const inputSymbol = button.dataset.decryptionSymbol;
    const expectedSymbol = systemDecryptionState.currentSequence[
        systemDecryptionState.inputSequence.length
    ].value;

    button.classList.add("is-selected");
    scheduleSystemDecryptionTask(() => {
        button.classList.remove("is-selected");
    }, 180);

    if (inputSymbol !== expectedSymbol) {
        failSystemDecryptionRound();
        return;
    }

    systemDecryptionState.inputSequence.push(inputSymbol);
    systemDecryptionInputDisplay.textContent = `${
        getSystemDecryptionText("decryption.input")
    } ${systemDecryptionState.inputSequence.length}/${
        systemDecryptionState.currentSequence.length
    } // ${systemDecryptionState.inputSequence.join(" ")}`;

    if (
        systemDecryptionState.inputSequence.length ===
        systemDecryptionState.currentSequence.length
    ) {
        completeSystemDecryptionRound();
    }
}

function setSystemDecryptionBackgroundInert(inert) {
    if (inert) {
        systemDecryptionState.inertElements = Array.from(
            document.body.children
        ).filter((element) => ![
            systemDecryptionOverlay,
            systemDecryptionSignal,
            document.getElementById("system-decryption-signal-layer")
        ].includes(element) && !element.inert);

        systemDecryptionState.inertElements.forEach((element) => {
            element.inert = true;
        });
        return;
    }

    systemDecryptionState.inertElements.forEach((element) => {
        element.inert = false;
    });
    systemDecryptionState.inertElements = [];
}

function openSystemDecryption() {
    if (systemDecryptionState.phase === "complete") {
        systemDecryptionState.isTriggering = false;
        systemDecryptionState.isOpen = true;
        systemDecryptionState.isCompletionLocked = false;
        systemDecryptionState.previousFocus = document.activeElement;

        systemDecryptionSignal.hidden = true;
        systemDecryptionState.activeTrigger?.classList.remove("is-detected");
        systemDecryptionOverlay.hidden = false;
        systemDecryptionOverlay.setAttribute("aria-hidden", "false");
        systemDecryptionCloseButton.hidden = false;
        systemDecryptionAbortHint.hidden = false;
        systemDecryptionGame.hidden = true;
        systemDecryptionFinal.hidden = false;
        systemDecryptionFinalTitle.textContent = getSystemDecryptionText(
            "decryption.activeTitle"
        );
        systemDecryptionHtmlElement.classList.add(
            "system-decryption-open",
            "system-decryption-active",
            "system-decryption-decrypted"
        );
        setSystemDecryptionBackgroundInert(true);
        applySystemDecryptionLevel(3);
        updateSystemDecryptionMatrix("unlocked", 1);
        systemDecryptionCloseButton.focus({ preventScroll: true });
        return;
    }

    updateSystemDecryptionMatrix("reset", 0);
    systemDecryptionState.isTriggering = false;
    systemDecryptionState.isOpen = true;
    systemDecryptionState.isCompletionLocked = false;
    systemDecryptionState.phase = "opening";
    systemDecryptionState.currentRound = 0;
    systemDecryptionState.completedRounds = 0;
    systemDecryptionState.currentSequence = [];
    systemDecryptionState.inputSequence = [];
    systemDecryptionState.previousFocus = document.activeElement;

    systemDecryptionSignal.hidden = true;
    systemDecryptionState.activeTrigger?.classList.remove("is-detected");
    systemDecryptionOverlay.hidden = false;
    systemDecryptionOverlay.setAttribute("aria-hidden", "false");
    systemDecryptionCloseButton.hidden = false;
    systemDecryptionAbortHint.hidden = false;
    systemDecryptionGame.hidden = false;
    systemDecryptionFinal.hidden = true;
    systemDecryptionFinalTitle.textContent = getSystemDecryptionText(
        "decryption.activeTitle"
    );
    systemDecryptionFinalTitle.classList.remove("is-unlocked");
    systemDecryptionCrash.hidden = true;
    systemDecryptionInputDisplay.textContent = "";
    systemDecryptionSequenceDisplay.textContent = "";
    systemDecryptionHtmlElement.classList.add("system-decryption-open");
    setSystemDecryptionBackgroundInert(true);
    applySystemDecryptionLevel(0);
    setSystemDecryptionStatus("decryption.ready");
    setSystemDecryptionControlsEnabled(false);
    updateSystemDecryptionRounds();
    systemDecryptionTerminal.focus({ preventScroll: true });
    resetSystemDecryptionInactivityTimer();

    scheduleSystemDecryptionTask(
        startSystemDecryptionRound,
        systemDecryptionConfig.sequenceLeadInMs
    );
}

function resetSystemDecryption() {
    const focusTarget = systemDecryptionState.previousFocus;

    clearSystemDecryptionTasks();
    restoreSystemDecryptionPageText();
    systemDecryptionState.clickTimes = [];
    systemDecryptionState.completedRounds = 0;
    systemDecryptionState.currentRound = 0;
    systemDecryptionState.currentSequence = [];
    systemDecryptionState.inputSequence = [];
    systemDecryptionState.phase = "closed";
    systemDecryptionState.statusKey = "decryption.ready";
    systemDecryptionState.isTriggering = false;
    systemDecryptionState.isOpen = false;
    systemDecryptionState.isCompletionLocked = false;
    systemDecryptionState.previousFocus = null;

    systemDecryptionState.activeTrigger?.classList.remove("is-detected");
    systemDecryptionState.activeTrigger = null;
    systemDecryptionSignal.hidden = true;
    systemDecryptionOverlay.hidden = true;
    systemDecryptionOverlay.setAttribute("aria-hidden", "true");
    systemDecryptionCloseButton.hidden = false;
    systemDecryptionAbortHint.hidden = false;
    systemDecryptionGame.hidden = false;
    systemDecryptionFinal.hidden = true;
    systemDecryptionCrash.hidden = true;
    systemDecryptionTerminal.classList.remove("is-failed");
    systemDecryptionSequenceDisplay.classList.remove("is-visible");
    systemDecryptionSequenceDisplay.textContent = "";
    systemDecryptionSequenceDisplay.setAttribute(
        "aria-label",
        getSystemDecryptionText("decryption.sequenceLabel")
    );
    systemDecryptionInputDisplay.textContent = "";
    systemDecryptionCountdown.textContent = "";
    systemDecryptionFinalTitle.textContent = getSystemDecryptionText(
        "decryption.activeTitle"
    );
    systemDecryptionFinalTitle.classList.remove("is-unlocked");
    setSystemDecryptionControlsEnabled(false);
    setSystemDecryptionBackgroundInert(false);
    updateSystemDecryptionMatrix("reset", 0);

    systemDecryptionHtmlElement.classList.remove(
        "system-decryption-open",
        "system-decryption-active",
        "system-decryption-finalizing",
        "system-decryption-decrypting",
        "system-decryption-decrypted",
        "system-decryption-failed",
        "system-decryption-crashing",
        "system-decryption-repairing",
        "system-decryption-level-1",
        "system-decryption-level-2",
        "system-decryption-level-3"
    );

    if (focusTarget instanceof HTMLElement) {
        focusTarget.focus({ preventScroll: true });
    }
}

function beginSystemDecryptionRepair() {
    systemDecryptionState.phase = "repairing";
    systemDecryptionHtmlElement.classList.remove(
        "system-decryption-crashing"
    );
    systemDecryptionHtmlElement.classList.add(
        "system-decryption-repairing"
    );
    systemDecryptionCountdown.textContent = getSystemDecryptionText(
        "decryption.restored"
    );
    setSystemDecryptionStatus("decryption.repairing");

    scheduleSystemDecryptionTask(
        resetSystemDecryption,
        systemDecryptionConfig.repairDurationMs
    );
}

function beginSystemDecryptionCrash() {
    if (!systemDecryptionState.isOpen) {
        return;
    }

    clearSystemDecryptionTasks();
    systemDecryptionState.phase = "crash";
    setSystemDecryptionControlsEnabled(false);
    systemDecryptionGame.hidden = true;
    systemDecryptionFinal.hidden = true;
    systemDecryptionCrash.hidden = false;
    systemDecryptionHtmlElement.classList.add(
        "system-decryption-crashing"
    );

    let secondsRemaining = systemDecryptionConfig.crashCountdownSeconds;

    function updateCrashCountdown() {
        systemDecryptionCountdown.textContent = `${
            getSystemDecryptionText("decryption.crashCountdown")
        } ${secondsRemaining}`;

        if (secondsRemaining === 0) {
            beginSystemDecryptionRepair();
            return;
        }

        secondsRemaining -= 1;
        scheduleSystemDecryptionTask(updateCrashCountdown, 1000);
    }

    updateCrashCountdown();
}

function detectSystemDecryptionSignal(trigger) {
    systemDecryptionState.isTriggering = true;
    systemDecryptionState.clickTimes = [];
    systemDecryptionState.activeTrigger = trigger;
    trigger.classList.add("is-detected");
    systemDecryptionSignal.hidden = false;

    const revealDelay = typeof prefersReducedMotion === "function" &&
        prefersReducedMotion()
        ? 160
        : systemDecryptionConfig.triggerRevealDelayMs;

    scheduleSystemDecryptionTask(
        openSystemDecryption,
        revealDelay
    );
}

function handleSystemDecryptionTrigger(trigger) {
    if (
        systemDecryptionState.isOpen ||
        systemDecryptionState.isTriggering
    ) {
        return;
    }

    const currentTime = Date.now();
    systemDecryptionState.clickTimes = [
        ...systemDecryptionState.clickTimes,
        currentTime
    ].filter((clickTime) => (
        currentTime - clickTime <= systemDecryptionConfig.triggerWindowMs
    ));

    if (
        systemDecryptionState.clickTimes.length >=
        systemDecryptionConfig.triggerClickCount
    ) {
        detectSystemDecryptionSignal(trigger);
    }
}

function closeCompletedSystemDecryption() {
    const focusTarget = systemDecryptionState.previousFocus;

    clearSystemDecryptionTasks();
    systemDecryptionState.clickTimes = [];
    systemDecryptionState.isTriggering = false;
    systemDecryptionState.isOpen = false;
    systemDecryptionState.isCompletionLocked = false;
    systemDecryptionState.previousFocus = null;
    systemDecryptionState.activeTrigger?.classList.remove(
        "is-detected"
    );
    systemDecryptionState.activeTrigger = null;
    systemDecryptionSignal.hidden = true;
    systemDecryptionOverlay.hidden = true;
    systemDecryptionOverlay.setAttribute("aria-hidden", "true");
    setSystemDecryptionBackgroundInert(false);
    systemDecryptionHtmlElement.classList.remove(
        "system-decryption-open"
    );

    if (focusTarget instanceof HTMLElement) {
        focusTarget.focus({ preventScroll: true });
    }
}

function abortSystemDecryption() {
    if (
        systemDecryptionState.isCompletionLocked ||
        ["finalizing", "decrypting"].includes(
            systemDecryptionState.phase
        )
    ) {
        return;
    }

    if (systemDecryptionState.phase === "complete") {
        closeCompletedSystemDecryption();
        return;
    }

    resetSystemDecryption();
}

function trapSystemDecryptionFocus(event) {
    if (event.key !== "Tab" || !systemDecryptionState.isOpen) {
        return;
    }

    const focusableElements = Array.from(
        systemDecryptionOverlay.querySelectorAll(
            'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
        )
    ).filter((element) => !element.hidden);

    if (focusableElements.length === 0) {
        event.preventDefault();
        systemDecryptionTerminal.focus({ preventScroll: true });
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}

systemDecryptionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
        handleSystemDecryptionTrigger(trigger);
    });
});

systemDecryptionCloseButton.addEventListener(
    "click",
    abortSystemDecryption
);

systemDecryptionSymbolButtons.forEach((button) => {
    button.addEventListener("click", () => {
        handleSystemDecryptionSymbol(button);
    });
});

systemDecryptionOverlay.addEventListener("pointerdown", () => {
    resetSystemDecryptionInactivityTimer();
});

systemDecryptionOverlay.addEventListener("keydown", () => {
    resetSystemDecryptionInactivityTimer();
});

document.addEventListener("keydown", (event) => {
    if (!systemDecryptionState.isOpen) {
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        abortSystemDecryption();
        return;
    }

    trapSystemDecryptionFocus(event);
});

document.addEventListener("languagechange", () => {
    if (!systemDecryptionState.isOpen) {
        return;
    }

    setSystemDecryptionStatus(
        systemDecryptionState.statusKey,
        systemDecryptionStatus.dataset.state
    );

    if (systemDecryptionState.phase === "complete") {
        systemDecryptionFinalTitle.textContent = getSystemDecryptionText(
            "decryption.activeTitle"
        );
    }

    if (systemDecryptionState.phase === "failed") {
        corruptSystemDecryptionPageText();
    }
});

setSystemDecryptionControlsEnabled(false);
