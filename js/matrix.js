const matrixCanvas = document.getElementById("matrix-canvas");
const matrixContext = matrixCanvas.getContext("2d");
const letters = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";
const matrixFontSizePx = 16;
const matrixResetThreshold = 0.975;
const matrixIntervalMs = 45;
const drops = [];

const accentColor = getComputedStyle(
    document.documentElement
).getPropertyValue("--color-accent").trim();

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

    matrixContext.fillStyle = "rgba(0,0,0,0.08)";
    matrixContext.fillRect(
        0,
        0,
        matrixCanvas.width,
        matrixCanvas.height
    );
    matrixContext.fillStyle = accentColor;
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

startMatrixAnimation();
