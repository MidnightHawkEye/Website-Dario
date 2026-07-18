const matrixCanvas = document.getElementById("matrix");
const matrixCtx = matrixCanvas.getContext("2d");


matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;


const letters = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;
const columns = matrixCanvas.width / fontSize;
const drops = [];


for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {

    matrixCtx.fillStyle = "rgba(0,0,0,0.08)";
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    matrixCtx.fillStyle = "#00ff88";
    matrixCtx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
        drops[i]++;
    }
}

setInterval(drawMatrix, 45);