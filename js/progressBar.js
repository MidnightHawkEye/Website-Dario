const progressBar = document.getElementById("progress-bar");

function updateProgressBar() {

    const scrollTop =
        document.documentElement.scrollTop || window.scrollY;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress =
        (scrollTop / scrollHeight) * 100;

    progressBar.style.width = progress + "%";
}

window.addEventListener("scroll", updateProgressBar);

window.addEventListener("load", updateProgressBar);