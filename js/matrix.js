const matrixCanvas = document.getElementById("matrix-canvas");
const matrixContext = matrixCanvas.getContext("2d");
const letters = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";
const matrixFontSizePx = 16;
const matrixResetThreshold = 0.975;
const matrixIntervalMs = 45;
const matrixDecryptionIntervalMs = 18;
const matrixUnlockedIntervalMs = matrixDecryptionIntervalMs;
const matrixDecryptionPhrases = Object.freeze([
    "SYSTEM ONLINE",
    "DECRYPTION COMPLETE",
    "ACCESS GRANTED",
    "IDENTITY VERIFIED",
    "DARIO.exe",
    "SYSTEM ACTIVE"
]);
const drops = [];
let matrixCharacterColor = "#00ff88";
let matrixTrailColor = "rgba(0,0,0,0.08)";
let matrixActiveIntervalMs = matrixIntervalMs;
const matrixDecryptionState = {
    phase: "normal",
    progress: 0,
    frame: 0
};

function updateMatrixPalette() {
    const htmlElement = document.documentElement;
    const styles = getComputedStyle(htmlElement);
    const isRetroEra = htmlElement.dataset.era === "1998";

    matrixCharacterColor = isRetroEra
        ? styles.getPropertyValue("--era-retro-matrix").trim() || "#000080"
        : styles.getPropertyValue("--color-accent").trim() || "#00ff88";

    matrixTrailColor = isRetroEra
        ? "rgba(0,128,128,0.14)"
        : "rgba(0,0,0,0.08)";
}

function resizeMatrixCanvas() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const columnCount = Math.ceil(
        matrixCanvas.width / matrixFontSizePx
    );

    if (drops.length > columnCount) {
        drops.length = columnCount;
    }

    while (drops.length < columnCount) {
        drops.push(1);
    }
}

resizeMatrixCanvas();

function getMatrixTrailColor() {
    if (!["escalate", "decrypt", "unlocked"].includes(
        matrixDecryptionState.phase
    )) {
        return matrixTrailColor;
    }

    return document.documentElement.dataset.era === "1998"
        ? "rgba(0,128,128,0.07)"
        : "rgba(0,0,0,0.045)";
}

function getMatrixScrambledText(target, progress, phraseIndex) {
    const revealedCharacters = Math.floor(target.length * progress);

    return Array.from(target, (character, index) => {
        if ([" ", ".", "/"].includes(character)) {
            return character;
        }

        if (index < revealedCharacters) {
            return character;
        }

        const randomIndex = (
            index * 7 +
            matrixDecryptionState.frame +
            phraseIndex * 11
        ) % letters.length;

        return letters[randomIndex];
    }).join("");
}

function drawMatrixDecodedLabel(text, x, y, fontSize, centered = false) {
    const isRetroEra = document.documentElement.dataset.era === "1998";
    const horizontalPadding = Math.max(8, fontSize * 0.45);
    const verticalPadding = Math.max(5, fontSize * 0.3);

    matrixContext.save();
    matrixContext.font = `700 ${fontSize}px monospace`;
    matrixContext.textAlign = centered ? "center" : "start";
    matrixContext.shadowBlur = 0;

    const textWidth = matrixContext.measureText(text).width;
    const panelX = centered
        ? x - textWidth / 2 - horizontalPadding
        : x - horizontalPadding;
    const panelY = y - fontSize - verticalPadding;

    matrixContext.globalAlpha = 0.94;
    matrixContext.fillStyle = isRetroEra
        ? "rgba(0, 0, 128, 0.94)"
        : "rgba(0, 10, 6, 0.94)";
    matrixContext.fillRect(
        panelX,
        panelY,
        textWidth + horizontalPadding * 2,
        fontSize + verticalPadding * 2
    );

    matrixContext.globalAlpha = 1;
    matrixContext.fillStyle = isRetroEra ? "#ffffff" : "#e8fff3";
    matrixContext.fillText(text, x, y);
    matrixContext.restore();
}

function drawMatrixReadableText() {
    const { phase, progress } = matrixDecryptionState;

    if (!["decrypt", "unlocked"].includes(phase)) {
        return;
    }

    const isUnlocked = phase === "unlocked";
    const phraseCount = isUnlocked
        ? matrixDecryptionPhrases.length
        : Math.max(
            1,
            Math.ceil(progress * matrixDecryptionPhrases.length)
        );
    const readableFontSize = Math.max(
        13,
        Math.min(18, matrixCanvas.width / 56)
    );

    matrixContext.save();
    matrixContext.font = `700 ${readableFontSize}px monospace`;
    matrixContext.fillStyle = matrixCharacterColor;
    matrixContext.shadowColor = matrixCharacterColor;
    matrixContext.shadowBlur = isUnlocked ? 0 : 10;
    matrixContext.globalAlpha = isUnlocked ? 1 : 0.8;

    matrixDecryptionPhrases.slice(0, phraseCount).forEach(
        (phrase, index) => {
            const localProgress = isUnlocked
                ? 1
                : Math.min(
                    1,
                    Math.max(
                        0.12,
                        progress * matrixDecryptionPhrases.length - index
                    )
                );
            const text = getMatrixScrambledText(
                phrase,
                localProgress,
                index
            );
            const x = index % 2 === 0
                ? matrixCanvas.width * 0.1
                : matrixCanvas.width * 0.58;
            const y = matrixCanvas.height * (0.18 + index * 0.115);

            if (isUnlocked) {
                drawMatrixDecodedLabel(
                    text,
                    x,
                    y,
                    readableFontSize
                );
            } else {
                matrixContext.fillText(text, x, y);
            }
        }
    );

    if (isUnlocked) {
        const finalFontSize = Math.max(
            20,
            Math.min(42, matrixCanvas.width / 28)
        );

        drawMatrixDecodedLabel(
            "DARIO.exe // SYSTEM ACTIVE",
            matrixCanvas.width / 2,
            matrixCanvas.height * 0.82,
            finalFontSize,
            true
        );
    }

    matrixContext.restore();
}

function drawMatrix() {
    const isEscalating = ["escalate", "decrypt", "unlocked"].includes(
        matrixDecryptionState.phase
    );

    matrixDecryptionState.frame += 1;
    matrixContext.save();
    matrixContext.fillStyle = getMatrixTrailColor();
    matrixContext.fillRect(
        0,
        0,
        matrixCanvas.width,
        matrixCanvas.height
    );
    matrixContext.fillStyle = matrixCharacterColor;
    matrixContext.font = matrixFontSizePx + "px monospace";
    matrixContext.globalAlpha = matrixDecryptionState.phase === "decrypt"
        ? Math.max(0.42, 1 - matrixDecryptionState.progress * 0.55)
        : 1;
    matrixContext.shadowColor = matrixCharacterColor;
    matrixContext.shadowBlur = isEscalating
        ? 12
        : matrixDecryptionState.phase === "unlocked"
            ? 6
            : 0;

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        matrixContext.fillText(
            text,
            i * matrixFontSizePx,
            drops[i] * matrixFontSizePx
        );

        if (isEscalating && i % 2 === matrixDecryptionState.frame % 2) {
            matrixContext.save();
            matrixContext.globalAlpha = 0.62;
            matrixContext.fillText(
                letters[Math.floor(Math.random() * letters.length)],
                i * matrixFontSizePx,
                (drops[i] - 1) * matrixFontSizePx
            );
            matrixContext.restore();
        }

        if (
            drops[i] * matrixFontSizePx > matrixCanvas.height &&
            Math.random() > matrixResetThreshold
        ) {
            drops[i] = 0;
        }

        drops[i] += isEscalating ? 2 : 1;
    }

    matrixContext.globalAlpha = 1;
    drawMatrixReadableText();
    matrixContext.restore();
}

let matrixIntervalId = null;

function startMatrixAnimation() {
    if (
        matrixIntervalId !== null ||
        !isTabActive() ||
        prefersReducedMotion()
    ) {
        return;
    }

    matrixIntervalId = setInterval(
        drawMatrix,
        matrixActiveIntervalMs
    );
}

function stopMatrixAnimation() {
    if (matrixIntervalId === null) {
        return;
    }

    clearInterval(matrixIntervalId);
    matrixIntervalId = null;
}

function clearMatrixAnimation() {
    matrixContext.clearRect(
        0,
        0,
        matrixCanvas.width,
        matrixCanvas.height
    );
}

function restartMatrixAnimation() {
    stopMatrixAnimation();
    clearMatrixAnimation();

    if (prefersReducedMotion()) {
        if (matrixDecryptionState.phase !== "normal") {
            drawMatrix();
        }
        return;
    }

    startMatrixAnimation();
}

function updateMatrixMotionPreference(event) {
    if (event.matches) {
        stopMatrixAnimation();
        clearMatrixAnimation();

        if (matrixDecryptionState.phase !== "normal") {
            drawMatrix();
        }
        return;
    }

    startMatrixAnimation();
}

addReducedMotionListener(updateMatrixMotionPreference);

window.addEventListener("dario:era-change", () => {
    updateMatrixPalette();
    clearMatrixAnimation();

    if (
        prefersReducedMotion() &&
        matrixDecryptionState.phase !== "normal"
    ) {
        drawMatrix();
    }
});

window.addEventListener("dario:matrix-decryption", (event) => {
    const phase = event.detail?.phase;
    const progress = Number(event.detail?.progress) || 0;

    if (phase === "reset") {
        matrixDecryptionState.phase = "normal";
        matrixDecryptionState.progress = 0;
        matrixDecryptionState.frame = 0;
        matrixActiveIntervalMs = matrixIntervalMs;
        restartMatrixAnimation();
        return;
    }

    if (!["escalate", "decrypt", "unlocked"].includes(phase)) {
        return;
    }

    matrixDecryptionState.phase = phase;
    matrixDecryptionState.progress = Math.max(0, Math.min(1, progress));
    matrixActiveIntervalMs = phase === "unlocked"
        ? matrixUnlockedIntervalMs
        : matrixDecryptionIntervalMs;
    restartMatrixAnimation();
});

document.addEventListener("visibilitychange", () => {
    if (isTabActive()) {
        startMatrixAnimation();
    } else {
        stopMatrixAnimation();
    }
});

let matrixResizeFrameId = null;

window.addEventListener("resize", () => {
    if (matrixResizeFrameId !== null) {
        return;
    }

    matrixResizeFrameId = requestAnimationFrame(() => {
        resizeMatrixCanvas();

        if (
            prefersReducedMotion() &&
            matrixDecryptionState.phase !== "normal"
        ) {
            clearMatrixAnimation();
            drawMatrix();
        }
        matrixResizeFrameId = null;
    });
});

updateMatrixPalette();
startMatrixAnimation();
