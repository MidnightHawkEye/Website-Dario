/*--------------------- EmailJS ---------------------*/

const contactFormElement = document.getElementById("contact-form");
const formStatusElement = document.getElementById("form-status");

const submitCooldownMs = 30_000;
const formResetDelayMs = 3_000;

let lastSubmit = 0;


/*--------------------- Status Message ---------------------*/

function setFormStatus(message) {
    if (!formStatusElement) {
        return;
    }

    formStatusElement.textContent = message;
}


/*--------------------- Contact Form ---------------------*/

if (contactFormElement) {
    contactFormElement.addEventListener("submit", async function (event) {
        event.preventDefault();

        const honeypot = document.getElementById("website");
        const submitButton =
            contactFormElement.querySelector(".contact-button");

        /*--------------------- Honeypot Check ---------------------*/

        if (honeypot && honeypot.value.trim() !== "") {
            alert("Unauthorized system interaction detected.");
            return;
        }

        /*--------------------- Offline Check ---------------------*/

        if (!navigator.onLine) {
            setFormStatus(
                "> Network offline. Check your internet connection and try again."
            );

            submitButton.textContent = "> RETRY TRANSMISSION";
            return;
        }

        /*--------------------- Cooldown Check ---------------------*/

        const now = Date.now();

        if (now - lastSubmit < submitCooldownMs) {
            alert(
                "Please wait 30 seconds before sending another message."
            );

            return;
        }

        /*--------------------- EmailJS Availability ---------------------*/

        if (
            typeof emailjs === "undefined" ||
            typeof emailjs.sendForm !== "function"
        ) {
            setFormStatus(
                "> Transmission service unavailable. Please try again later."
            );

            submitButton.textContent = "> RETRY TRANSMISSION";
            return;
        }

        /*--------------------- Transmission Start ---------------------*/

        submitButton.disabled = true;
        submitButton.textContent = "> TRANSMITTING...";

        setFormStatus("> Encrypting message...");

        try {
            await emailjs.sendForm(
                "service_rqtw9ef",
                "template_8nufkke",
                contactFormElement
            );

            lastSubmit = Date.now();

            if (formStatusElement) {
                formStatusElement.innerHTML =
                    "&gt; Transmission successful.<br>" +
                    "Connection established.";
            }

            submitButton.textContent =
                "> TRANSMISSION COMPLETE";

            contactFormElement.reset();

            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent =
                    "> INITIALIZE TRANSMISSION";

                setFormStatus(
                    "> Awaiting secure connection..."
                );
            }, formResetDelayMs);

        } catch (error) {
            console.error("EmailJS error:", error);

            const errorMessage = navigator.onLine
                ? "> Transmission failed. Please try again later."
                : "> Network connection lost. Check your internet connection.";

            setFormStatus(errorMessage);

            submitButton.disabled = false;
            submitButton.textContent =
                "> RETRY TRANSMISSION";
        }
    });
}


/*--------------------- Network Status ---------------------*/

window.addEventListener("offline", () => {
    setFormStatus(
        "> Network connection lost. Transmission unavailable."
    );
});

window.addEventListener("online", () => {
    setFormStatus(
        "> Connection restored. Ready for secure transmission."
    );
});
