/*--------------------- EmailJS ---------------------*/

const contactForm = document.getElementById("contact-form");
const terminalFooter = document.querySelector(".terminal-footer");

const SubmitCooldownMs = 30_000;
const FormResetDelayMs = 3_000;

let lastSubmit = 0;


/*--------------------- Status Message ---------------------*/

function showFormStatus(message) {
    if (!terminalFooter) {
        return;
    }

    terminalFooter.textContent = message;
}


/*--------------------- Contact Form ---------------------*/

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const honeypot = document.getElementById("website");
        const submitButton =
            contactForm.querySelector(".contact-button");

        /*--------------------- Honeypot Check ---------------------*/

        if (honeypot && honeypot.value.trim() !== "") {
            alert("Unauthorized system interaction detected.");
            return;
        }

        /*--------------------- Offline Check ---------------------*/

        if (!navigator.onLine) {
            showFormStatus(
                "> Network offline. Check your internet connection and try again."
            );

            submitButton.textContent = "> RETRY TRANSMISSION";
            return;
        }

        /*--------------------- Cooldown Check ---------------------*/

        const now = Date.now();

        if (now - lastSubmit < SubmitCooldownMs) {
            alert(
                "Please wait 30 seconds before sending another message."
            );

            return;
        }

        /*--------------------- Transmission Start ---------------------*/

        submitButton.disabled = true;
        submitButton.textContent = "> TRANSMITTING...";

        showFormStatus("> Encrypting message...");

        try {
            await emailjs.sendForm(
                "service_rqtw9ef",
                "template_8nufkke",
                contactForm
            );

            lastSubmit = Date.now();

            if (terminalFooter) {
                terminalFooter.innerHTML =
                    "&gt; Transmission successful.<br>" +
                    "Connection established.";
            }

            submitButton.textContent =
                "> TRANSMISSION COMPLETE";

            contactForm.reset();

            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent =
                    "> INITIALIZE TRANSMISSION";

                showFormStatus(
                    "> Awaiting secure connection..."
                );
            }, FormResetDelayMs);

        } catch (error) {
            console.error("EmailJS error:", error);

            const errorMessage = navigator.onLine
                ? "> Transmission failed. Please try again later."
                : "> Network connection lost. Check your internet connection.";

            showFormStatus(errorMessage);

            submitButton.disabled = false;
            submitButton.textContent =
                "> RETRY TRANSMISSION";
        }
    });
}


/*--------------------- Network Status ---------------------*/

window.addEventListener("offline", () => {
    showFormStatus(
        "> Network connection lost. Transmission unavailable."
    );
});

window.addEventListener("online", () => {
    showFormStatus(
        "> Connection restored. Ready for secure transmission."
    );
});