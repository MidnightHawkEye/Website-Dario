function scrollToSection(id) {
    const section = document.getElementById(id);

    if (!section) {
        return;
    }

    section.scrollIntoView({
        behavior: getScrollBehavior()
    });
}

if (
    typeof gsap !== "undefined" &&
    typeof ScrollTrigger !== "undefined"
) {
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

    /*--------------------- Skills Bar Loader ---------------------*/

    gsap.utils.toArray(".skill-fill").forEach((bar) => {
        const targetWidth = bar.style.width;

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
}
