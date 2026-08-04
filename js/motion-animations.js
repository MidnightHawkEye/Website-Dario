function scrollToSection(id) {
    const section = document.getElementById(id);

    if (!section) {
        return;
    }

    section.scrollIntoView({
        behavior: getScrollBehavior()
    });
}

const motionSections = document.querySelectorAll(".section");
const animatedSkillBars = document.querySelectorAll(".skill-fill");

function revealAllMotionElements() {
    motionSections.forEach((section) => {
        section.classList.add("motion-visible");
    });

    animatedSkillBars.forEach((bar) => {
        bar.classList.add("motion-visible");
    });
}

if (
    prefersReducedMotion() ||
    !("IntersectionObserver" in window)
) {
    revealAllMotionElements();
} else {
    const sectionObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("motion-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12
        }
    );

    const skillBarObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("motion-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.01,
            rootMargin: "0px 0px -15% 0px"
        }
    );

    motionSections.forEach((section) => {
        sectionObserver.observe(section);
    });

    animatedSkillBars.forEach((bar) => {
        skillBarObserver.observe(bar);
    });
}

addReducedMotionListener((event) => {
    if (event.matches) {
        revealAllMotionElements();
    }
});
