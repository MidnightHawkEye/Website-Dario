
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-menu a");
const sectionActivationOffsetPx = 150;
const mobileBreakpointPx = 900;


window.addEventListener("scroll",()=>{
    let activeSectionId="";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - sectionActivationOffsetPx;

            if(window.scrollY >= sectionTop){
                activeSectionId = section.getAttribute("id");
            }
    });

    navLinks.forEach(link=>{

        if (link.getAttribute("aria-current") === "page") {
            link.classList.add("active");
            return;
        }

        link.classList.remove("active");

            if(link.getAttribute("href")==="#" + activeSectionId){
                link.classList.add("active");
            }
    });

    const logoStatusDotElement =
        document.getElementById("logo-status-dot");

        if(activeSectionId === "hero"){
            logoStatusDotElement.classList.add("active");
        }else{
            logoStatusDotElement.classList.remove("active");
        }
});

window.dispatchEvent(new Event("scroll"));



/*==================================================
                    MOBILE MENU
==================================================*/

const menuToggleButton = document.querySelector(".menu-toggle");
const navigationMenu = document.querySelector(".nav-menu");
const navigationOverlayElement =
    document.querySelector(".mobile-menu-overlay");

function updateMobileMenuLabel() {
    if (!menuToggleButton) {
        return;
    }

    const isMenuOpen = navigationMenu?.classList.contains("open");
    menuToggleButton.setAttribute(
        "aria-label",
        translate(isMenuOpen ? "nav.close" : "nav.open")
    );
}

window.addEventListener("orientationchange", closeMobileMenu);

function openMobileMenu() {
        if (
            !navigationMenu ||
            !menuToggleButton ||
            !navigationOverlayElement
        ) {
            return;
        }

    navigationMenu.classList.add("open");
    navigationOverlayElement.classList.add("show");
    document.body.classList.add("menu-open");

    menuToggleButton.setAttribute("aria-expanded", "true");
    updateMobileMenuLabel();
}


function closeMobileMenu() {
        if (
            !navigationMenu ||
            !menuToggleButton ||
            !navigationOverlayElement
        ) {
            return;
        }

    navigationMenu.classList.remove("open");
    navigationOverlayElement.classList.remove("show");
    document.body.classList.remove("menu-open");

    menuToggleButton.setAttribute("aria-expanded", "false");
    updateMobileMenuLabel();
}


        if (menuToggleButton) {
        menuToggleButton.addEventListener("click", () => {

            if (navigationMenu.classList.contains("open")) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        }

        if (navigationOverlayElement) {
            navigationOverlayElement.addEventListener(
                "click",
                closeMobileMenu
            );
        }


    navLinks.forEach(link => {
    link.addEventListener("click", closeMobileMenu);
    });


    document.addEventListener("keydown", event => {
    const isMenuOpen =
        navigationMenu?.classList.contains("open");

    if (event.key === "Escape" && isMenuOpen) {
        closeMobileMenu();
        menuToggleButton.focus();
    }
});


    window.addEventListener("resize", () => {
        if (window.innerWidth > mobileBreakpointPx) {
            closeMobileMenu();
        }
});


/*==================================================
            RESET AFTER PAGE REFRESH
==================================================*/

function resetNavigationState() {
    closeMobileMenu();

    requestAnimationFrame(() => {
        window.dispatchEvent(new Event("scroll"));
    });
}

window.addEventListener("load", resetNavigationState);
window.addEventListener("pageshow", resetNavigationState);
document.addEventListener("languagechange", updateMobileMenuLabel);
