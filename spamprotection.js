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