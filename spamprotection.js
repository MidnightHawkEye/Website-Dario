
/*--------------------- Spam Protection Botfillin ---------------------*/

document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();

    if (document.getElementById("website").value !== "") {
        alert("[SECURITY ALERT] Unauthorized system interaction detected.");
        console.log("INTRUSION LOGGED.");
        return;
    }

    emailjs.sendForm(
        "service_rqtw9ef",
        "template_8nufkke",
        this
    )
});

/*--------------------- Spam Protection Klick ---------------------*/

let lastSubmit = 0;

document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const now = Date.now();

    if (now - lastSubmit < 30000) {
        alert("Please wait 30 seconds before sending again.");
        return;
    }

    lastSubmit = now;
});

/*--------------------- Spam Protection block E-Mail ---------------------*/

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
