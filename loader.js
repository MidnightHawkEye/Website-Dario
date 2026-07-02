window.onload = () => {
    gsap.to("#loader", {
        opacity:0,
        duration:2.5,
        onComplete: () => {
            document.getElementById("loader").style.display = "none";
        }
    });
};