
/*--------------------- Loader ---------------------*/

window.onload = () => {
    gsap.to("#loader", {
        opacity:0,
        duration:1.5,
        onComplete: () => {
            document.getElementById("loader").style.display = "none";
        }
    });
};