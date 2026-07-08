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

/*--------------------- Tipping intro Text ---------------------*/

const text = "Building systems. Breaking limits. Learning code.";
let i = 0;

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typing").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}

typeWriter();



/*--------------------- Skills Bar Loader ---------------------*/

gsap.utils.toArray(".skill-fill").forEach((bar) => {
    let targetWidth = bar.style.width;

    gsap.fromTo(
        bar,
        { width: "0%" },
        {
            width: targetWidth,
            duration: 2,
            scrollTrigger: {
                trigger: bar,
                start: "top 85%"
            }
        }
    );
});