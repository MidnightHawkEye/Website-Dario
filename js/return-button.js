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

    if (prefersReducedMotion()) {
        returnStatusTextElement.textContent = message;
        return Promise.resolve();
    }

    return new Promise((resolve) => {

        returnStatusTextElement.textContent = "";
        let characterIndex = 0;

        const typingIntervalId = setInterval(() => {

            if (prefersReducedMotion()) {
                returnStatusTextElement.textContent = message;
                clearInterval(typingIntervalId);
                resolve();
                return;
            }

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

        await typeSystemMessage(translate("return.returning"));

        window.scrollTo({
            top: 0,
            behavior: getScrollBehavior()
        });

        await waitForPageTop();
        await delay(systemReadyDelayMs);

        await typeSystemMessage(translate("return.ready"));
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

            if (
                prefersReducedMotion() &&
                window.scrollY > topPositionTolerancePx
            ) {
                window.scrollTo({
                    top: 0,
                    behavior: "auto"
                });
            }

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

    if (prefersReducedMotion()) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        let timeoutId = null;

        function finishDelay() {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }

            removeReducedMotionListener(handleMotionChange);
            resolve();
        }

        function handleMotionChange(event) {
            if (event.matches) {
                finishDelay();
            }
        }

        addReducedMotionListener(handleMotionChange);
        timeoutId = setTimeout(finishDelay, ms);
    });

}
