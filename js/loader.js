/*--------------------- Loader ---------------------*/
/*
window.onload = () => {
    gsap.to("#loader", {
        opacity:0,
        duration:1.5,
        onComplete: () => {
            document.getElementById("loader").style.display = "none";
        }
    });
};*/

/*==================================================
                    LOADER
==================================================*/

const loader = document.getElementById("loader");


function hideLoader() {
    if (!loader) {
        return;
    }

    loader.classList.add("loader-hidden");
    loader.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
        loader.style.display = "none";
    }, 700);
}

window.addEventListener("load", hideLoader);
window.addEventListener("pageshow", hideLoader);
window.setTimeout(hideLoader, 3000);