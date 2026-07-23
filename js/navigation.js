
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-menu a");


window.addEventListener("scroll",()=>{
    let current="";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 150;

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
    menuToggle.setAttribute("aria-label", "Close navigation");
}


function closeMobileMenu() {
        if (!navMenu || !menuToggle || !menuOverlay) {
            return;
        }

    navMenu.classList.remove("open");
    menuOverlay.classList.remove("show");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
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
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });


    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeMobileMenu();
        }
});