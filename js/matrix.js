const matrixCanvas = document.getElementById("matrix");
const matrixCtx = matrixCanvas.getContext("2d");


matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;


const letters = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MatrixFontSizePx = 16;
const MatrixResetThreshold = 0.975;
const MatrixIntervalMs = 45;
const columns = matrixCanvas.width / MatrixFontSizePx;
const drops = [];

const accentColor = getComputedStyle(
    document.documentElement
).getPropertyValue("--color-accent").trim();

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {

    matrixCtx.fillStyle = "rgba(0,0,0,0.08)";
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    matrixCtx.fillStyle = accentColor;
    matrixCtx.font = MatrixFontSizePx + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        matrixCtx.fillText(text, i * MatrixFontSizePx, drops[i] * MatrixFontSizePx);

            if (drops[i] * MatrixFontSizePx > matrixCanvas.height && Math.random() > MatrixResetThreshold) {
                drops[i] = 0;
            }
            
        drops[i]++;
    }
}

setInterval(drawMatrix, MatrixIntervalMs);