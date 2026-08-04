/*--------------------- Animation ---------------------*/

const animatedElements =
document.querySelectorAll(
".reveal-fade-up,.reveal-fade-right,.reveal-zoom,.reveal-blur"
);

function showAllRevealElements() {
    animatedElements.forEach((element) => {
        element.classList.add("show");
    });
}

if (
    prefersReducedMotion() ||
    !("IntersectionObserver" in window)
) {
    showAllRevealElements();
} else {
    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
            
        });
    },
    {
        threshold: 0.30
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

addReducedMotionListener((event) => {
    if (event.matches) {
        showAllRevealElements();
    }
});
