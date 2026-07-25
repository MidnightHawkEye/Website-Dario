/*--------------------- Emailjs ---------------------*/

const contactForm = document.getElementById("contact-form");
const terminalFooter = document.querySelector(".terminal-footer");
const SubmitCooldownMs = 30_000;
const FormResetDelayMs = 3_000;

let lastSubmit = 0;

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const honeypot = document.getElementById("website");

        if (honeypot && honeypot.value.trim() !== "") {
            alert("Unauthorized system interaction detected.");
            return;
        }

        const now = Date.now();

        if (now - lastSubmit < SubmitCooldownMs) {
            alert("Please wait 30 seconds before sending another message.");
            return;
        }

        const submitButton = contactForm.querySelector(".contact-button");

        submitButton.disabled = true;
        submitButton.textContent = "> TRANSMITTING...";

        if (terminalFooter) {
            terminalFooter.textContent = "> Encrypting message...";
        }

        try {
            await emailjs.sendForm(
                "service_rqtw9ef",
                "template_8nufkke",
                contactForm
            );

            lastSubmit = now;

            if (terminalFooter) {
                terminalFooter.innerHTML =
                    "&gt; Transmission successful.<br>Connection established.";
            }

            submitButton.textContent = "> TRANSMISSION COMPLETE";
            contactForm.reset();

            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = "> INITIALIZE TRANSMISSION";

                if (terminalFooter) {
                    terminalFooter.textContent =
                        "> Awaiting secure connection...";
                }
            }, FormResetDelayMs);

        } catch (error) {
            console.error("EmailJS error:", error);

            if (terminalFooter) {
                terminalFooter.textContent =
                    "> Transmission failed. Check system console.";
            }

            submitButton.disabled = false;
            submitButton.textContent = "> RETRY TRANSMISSION";
        }
    });
}