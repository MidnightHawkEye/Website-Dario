
const sections =
document.querySelectorAll("section");

const navLinks =
document.querySelectorAll("nav a");


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