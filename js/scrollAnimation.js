/*--------------------- Animation ---------------------*/

const animatedElements =
document.querySelectorAll(
".fade-up,.fade-right,.zoom,.blur"
);

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

animatedElements.forEach(element=>{
observer.observe(element);
});
