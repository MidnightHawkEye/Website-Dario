let lastSubmit = 0;

document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();

        if (document.getElementById("website").value !== "") {
            alert("[SECURITY ALERT] Unauthorized system interaction detected.");
            return;
        }

    const now = Date.now();

        if (now - lastSubmit < 30000) {
            alert("Please wait 30 seconds.");
            return;
        }

    const email = document.querySelector('input[name="email"]').value;

        if (!email.includes("@") || !email.includes(".")) {
            alert("Invalid email.");
            return;
        }

    const blockedDomains = ["tempmail.com", "10minutemail.com"];
    const domain = email.split("@")[1];

        if (blockedDomains.includes(domain)) {
            alert("Disposable emails not allowed.");
            return;
        }

    lastSubmit = now;


    
    emailjs.sendForm(
        "service_rqtw9ef",
        "template_8nufkke",
        this
    )
    .then(() => {
        alert("Thanks for contacting DARIO.exe. System received.");
        this.reset();
    })
    .catch((error) => {
        alert("Transmission failed ❌");
        console.log(error);
    });
});

/*--------------------- New page may look for the old one  ---------------------*/


const contactForm = document.getElementById("contact-form");
const terminalFooter = document.querySelector(".terminal-footer");

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

        if (now - lastSubmit < 30000) {
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
            }, 3000);

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