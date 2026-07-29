
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-menu a");
const sectionActivationOffsetPx = 150;
const mobileBreakpointPx = 900;


window.addEventListener("scroll",()=>{
    let current="";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - sectionActivationOffsetPx;

            if(window.scrollY >= sectionTop){
                current = section.getAttribute("id");
            }
    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

            if(link.getAttribute("href")==="#" + current){
                link.classList.add("active");
            }
    });

    const logoDot = document.getElementById("logo-dot");

        if(current === "hero"){
            logoDot.classList.add("active");
        }else{
            logoDot.classList.remove("active");
        }
});

window.dispatchEvent(new Event("scroll"));



/*==================================================
                    MOBILE MENU
==================================================*/

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const menuOverlay = document.querySelector(".mobile-menu-overlay");

window.addEventListener("orientationchange", closeMobileMenu);

function openMobileMenu() {
        if (!navMenu || !menuToggle || !menuOverlay) {
            return;
        }

    navMenu.classList.add("open");
    menuOverlay.classList.add("show");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
}


function closeMobileMenu() {
        if (!navMenu || !menuToggle || !menuOverlay) {
            return;
        }

    navMenu.classList.remove("open");
    menuOverlay.classList.remove("show");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}


        if (menuToggle) {
        menuToggle.addEventListener("click", () => {

            if (navMenu.classList.contains("open")) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        }

        if (menuOverlay) {
            menuOverlay.addEventListener("click", closeMobileMenu);
        }


    navLinks.forEach(link => {
    link.addEventListener("click", closeMobileMenu);
    });


    document.addEventListener("keydown", event => {
    const isMenuOpen = navMenu?.classList.contains("open");

    if (event.key === "Escape" && isMenuOpen) {
        closeMobileMenu();
        menuToggle.focus();
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