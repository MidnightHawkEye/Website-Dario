const ReturnButtonThresholdPx = 500;
const DefaultTypingSpeedMs = 40;
const SystemReadyDelayMs = 300;
const SystemMassageDurationMs = 1200;
const TopPositionTolerancePx = 5;
const ScrollCheckIntervalMs = 30;
const ReturnButtonCooldownMs = 1000;

const returnButton = document.getElementById("return-button");
const systemMessage = document.getElementById("system-message");
const systemText = document.getElementById("system-text");

let isReturnToSystemRunning = false;


/*==================================================
            BUTTON EIN- UND AUSBLENDEN
==================================================*/

window.addEventListener("scroll", () => {

    if (window.scrollY > ReturnButtonThresholdPx) {
        returnButton.classList.add("show");
    } else {
        returnButton.classList.remove("show");
    }

});


/*==================================================
                TEXT SCHREIBEN
==================================================*/

function typeMessage(message, speed = DefaultTypingSpeedMs) {

    return new Promise((resolve) => {

        systemText.textContent = "";
        let i = 0;

        const typing = setInterval(() => {

            systemText.textContent += message.charAt(i);
            i++;

            if (i >= message.length) {
                clearInterval(typing);
                resolve();
            }

        }, speed);

    });

}


/*==================================================
              RETURN TO SYSTEM
==================================================*/

async function returnToSystem() {

    // Verhindert, dass die Funktion mehrfach gleichzeitig startet
    if (isReturnToSystemRunning) {
        return;
    }

    isReturnToSystemRunning = true;

    try {

        systemMessage.classList.add("show");

        await typeMessage("> Returning to system...");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        await waitForTop();
        await sleep(SystemReadyDelayMs);

        await typeMessage("> System ready.");
        await sleep(SystemMassageDurationMs);

        systemMessage.classList.remove("show");

        // Nach dem vollständigen Ablauf noch 5 Sekunden warten
        await sleep(ReturnButtonCooldownMs);

    } finally {

        systemMessage.classList.remove("show");
        isReturnToSystemRunning = false;

    }

}


/*==================================================
            AUF SEITENANFANG WARTEN
==================================================*/

function waitForTop() {

    return new Promise((resolve) => {

        const check = setInterval(() => {

            if (window.scrollY <= TopPositionTolerancePx) {
                clearInterval(check);
                resolve();
            }

        }, ScrollCheckIntervalMs);

    });

}


/*==================================================
                    DELAY
==================================================*/

function sleep(ms) {

    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

}