const returnButtonThresholdPx = 500;
const defaultTypingSpeedMs = 40;
const systemReadyDelayMs = 300;
const systemMessageDurationMs = 1200;
const topPositionTolerancePx = 5;
const scrollCheckIntervalMs = 30;
const returnButtonCooldownMs = 1000;

const returnToTopButtonElement = document.getElementById(
    "return-to-top-button"
);
const returnStatusMessageElement = document.getElementById(
    "return-status-message"
);
const returnStatusTextElement = document.getElementById(
    "return-status-text"
);

let isReturnToSystemRunning = false;


/*==================================================
            SHOW AND HIDE BUTTON
==================================================*/

window.addEventListener("scroll", () => {

    if (window.scrollY > returnButtonThresholdPx) {
        returnToTopButtonElement.classList.add("show");
    } else {
        returnToTopButtonElement.classList.remove("show");
    }

});


/*==================================================
                TYPE TEXT
==================================================*/

function typeSystemMessage(message, speed = defaultTypingSpeedMs) {

    return new Promise((resolve) => {

        returnStatusTextElement.textContent = "";
        let characterIndex = 0;

        const typingIntervalId = setInterval(() => {

            returnStatusTextElement.textContent +=
                message.charAt(characterIndex);
            characterIndex++;

            if (characterIndex >= message.length) {
                clearInterval(typingIntervalId);
                resolve();
            }

        }, speed);

    });

}


/*==================================================
              RETURN TO SYSTEM
==================================================*/

async function runReturnToSystemSequence() {

    // Prevent the function from running multiple times simultaneously
    if (isReturnToSystemRunning) {
        return;
    }

    isReturnToSystemRunning = true;

    try {

        returnStatusMessageElement.classList.add("show");

        await typeSystemMessage("> Returning to system...");

        window.scrollTo({
            top: 0,
            behavior: getScrollBehavior()
        });

        await waitForPageTop();
        await delay(systemReadyDelayMs);

        await typeSystemMessage("> System ready.");
        await delay(systemMessageDurationMs);

        returnStatusMessageElement.classList.remove("show");

        // Brief cooldown after the complete sequence
        await delay(returnButtonCooldownMs);

    } finally {

        returnStatusMessageElement.classList.remove("show");
        isReturnToSystemRunning = false;

    }

}


/*==================================================
            WAIT UNTIL PAGE TOP
==================================================*/

function waitForPageTop() {

    return new Promise((resolve) => {

        const topCheckIntervalId = setInterval(() => {

            if (window.scrollY <= topPositionTolerancePx) {
                clearInterval(topCheckIntervalId);
                resolve();
            }

        }, scrollCheckIntervalMs);

    });

}


/*==================================================
                    DELAY
==================================================*/

function delay(ms) {

    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

}
