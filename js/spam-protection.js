/*--------------------- EmailJS ---------------------*/

const contactFormElement = document.getElementById("contact-form");
const formStatusElement = document.getElementById("form-status");
const contactSubmitButtonElement =
    contactFormElement?.querySelector(".contact-button");

const submitCooldownMs = 30_000;
const formResetDelayMs = 3_000;

let lastSubmit = 0;
let currentFormStatusKey = "contact.awaiting";
let currentSubmitButtonKey = "contact.submit";


/*--------------------- Status Message ---------------------*/

function setFormStatus(messageKey) {
    currentFormStatusKey = messageKey;

    if (!formStatusElement) {
        return;
    }

    formStatusElement.textContent = translate(messageKey);
}

function setSubmitButtonText(messageKey) {
    currentSubmitButtonKey = messageKey;

    if (contactSubmitButtonElement) {
        contactSubmitButtonElement.textContent = translate(messageKey);
    }
}


/*--------------------- Contact Form ---------------------*/

if (contactFormElement) {
    contactFormElement.addEventListener("submit", async function (event) {
        event.preventDefault();

        const honeypot = document.getElementById("website");
        const submitButton = contactSubmitButtonElement;

        /*--------------------- Honeypot Check ---------------------*/

        if (honeypot && honeypot.value.trim() !== "") {
            alert(translate("contact.unauthorized"));
            return;
        }

        /*--------------------- Offline Check ---------------------*/

        if (!navigator.onLine) {
            setFormStatus("contact.offline");
            setSubmitButtonText("contact.retry");
            return;
        }

        /*--------------------- Cooldown Check ---------------------*/

        const now = Date.now();

        if (now - lastSubmit < submitCooldownMs) {
            alert(translate("contact.cooldown"));

            return;
        }

        /*--------------------- EmailJS Availability ---------------------*/

        if (
            typeof emailjs === "undefined" ||
            typeof emailjs.sendForm !== "function"
        ) {
            setFormStatus("contact.unavailable");
            setSubmitButtonText("contact.retry");
            return;
        }

        /*--------------------- Transmission Start ---------------------*/

        submitButton.disabled = true;
        setSubmitButtonText("contact.transmitting");
        setFormStatus("contact.encrypting");

        try {
            await emailjs.sendForm(
                "service_rqtw9ef",
                "template_8nufkke",
                contactFormElement
            );

            lastSubmit = Date.now();

            setFormStatus("contact.success");
            setSubmitButtonText("contact.complete");

            contactFormElement.reset();

            setTimeout(() => {
                submitButton.disabled = false;
                setSubmitButtonText("contact.submit");
                setFormStatus("contact.awaiting");
            }, formResetDelayMs);

        } catch (error) {
            console.error("EmailJS error:", error);

            const errorMessageKey = navigator.onLine
                ? "contact.failed"
                : "contact.connectionLost";

            setFormStatus(errorMessageKey);

            submitButton.disabled = false;
            setSubmitButtonText("contact.retry");
        }
    });
}


/*--------------------- Network Status ---------------------*/

window.addEventListener("offline", () => {
    setFormStatus("contact.offlineStatus");
});

window.addEventListener("online", () => {
    setFormStatus("contact.restored");
});

document.addEventListener("languagechange", () => {
    setFormStatus(currentFormStatusKey);
    setSubmitButtonText(currentSubmitButtonKey);
});
