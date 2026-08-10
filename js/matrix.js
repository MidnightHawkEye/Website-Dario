const matrixCanvas = document.getElementById("matrix-canvas");
const matrixContext = matrixCanvas.getContext("2d");
const letters = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";
const matrixFontSizePx = 16;
const matrixResetThreshold = 0.975;
const matrixIntervalMs = 45;
const drops = [];
let matrixCharacterColor = "#00ff88";
let matrixTrailColor = "rgba(0,0,0,0.08)";

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

function drawMatrix() {

    matrixContext.fillStyle = matrixTrailColor;
    matrixContext.fillRect(
        0,
        0,
        matrixCanvas.width,
        matrixCanvas.height
    );
    matrixContext.fillStyle = matrixCharacterColor;
    matrixContext.font = matrixFontSizePx + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        matrixContext.fillText(
            text,
            i * matrixFontSizePx,
            drops[i] * matrixFontSizePx
        );

            if (
                drops[i] * matrixFontSizePx > matrixCanvas.height &&
                Math.random() > matrixResetThreshold
            ) {
                drops[i] = 0;
            }
            
        drops[i]++;
    }
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
        matrixIntervalMs
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

function updateMatrixMotionPreference(event) {
    if (event.matches) {
        stopMatrixAnimation();
        clearMatrixAnimation();
        return;
    }

    startMatrixAnimation();
}

addReducedMotionListener(updateMatrixMotionPreference);

window.addEventListener("dario:era-change", () => {
    updateMatrixPalette();
    clearMatrixAnimation();
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
        matrixResizeFrameId = null;
    });
});

updateMatrixPalette();
startMatrixAnimation();
