gsap.registerPlugin(ScrollTrigger);

gsap.from(".hero-content", {
    opacity: 0,
    y: 100,
    duration: 2
});

gsap.utils.toArray(".section").forEach(section => {
    gsap.from(section, {
        scrollTrigger: section,
        opacity: 0,
        y: 100,
        duration: 1.5
    });
});

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}

/* Tipping intro Text */

const text = "Automation Specialist | JavaScript Developer | Future Pentester";
let i = 0;

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typing").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}

typeWriter();

/*--------------------- EmailJS ---------------------*/

emailjs.init({
    publicKey: "D5nlmTR93lnLoD6jw"
});

document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();

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