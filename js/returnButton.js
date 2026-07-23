const returnButton =
document.getElementById("return-button");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {
        returnButton.classList.add("show");
    } else {
        returnButton.classList.remove("show");
    }
});



const systemMessage =
document.getElementById("system-message");

const systemText =
document.getElementById("system-text");


function typeMessage(message,speed=40){

    return new Promise(resolve=>{

        systemText.textContent="";
        let i=0;

        const typing=setInterval(()=>{

            systemText.textContent += message.charAt(i);
            i++;

                if(i>=message.length){
                    clearInterval(typing);
                    resolve();
                }

        },speed);
    });
}


async function returnToSystem(){

    systemMessage.classList.add("show");

    await typeMessage("> Returning to system...");

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    await waitForTop();
    await sleep(300);
    await typeMessage("> System ready.");
    await sleep(1200);

    systemMessage.classList.remove("show");
}


function waitForTop(){

    return new Promise(resolve=>{

        const check=setInterval(()=>{

                if(window.scrollY<=5){
                    clearInterval(check);
                    resolve();
                }

        },30);
    });
}


function sleep(ms){

    return new Promise(resolve=>{
        setTimeout(resolve,ms);
    });

}