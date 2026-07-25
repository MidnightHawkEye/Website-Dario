const ReturnButtonThresholdPx = 500;
const DefaultTypingSpeedMs = 40;
const SystemReadyDelayMs = 300;
const SystemMassageDurationMs = 1200;
const TopPositionTolerancePx = 5;
const ScrollCheckIntervalMs =30;

const returnButton =
document.getElementById("return-button");

window.addEventListener("scroll", () => {

    if (window.scrollY > ReturnButtonThresholdPx) {
        returnButton.classList.add("show");
    } else {
        returnButton.classList.remove("show");
    }
});



const systemMessage =
document.getElementById("system-message");

const systemText =
document.getElementById("system-text");


function typeMessage(message,speed=DefaultTypingSpeedMs){

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
    await sleep(SystemReadyDelayMs);
    await typeMessage("> System ready.");
    await sleep(SystemMassageDurationMs);

    systemMessage.classList.remove("show");
}


function waitForTop(){

    return new Promise(resolve=>{

        const check=setInterval(()=>{

                if(window.scrollY<=TopPositionTolerancePx){
                    clearInterval(check);
                    resolve();
                }

        },ScrollCheckIntervalMs);
    });
}


function sleep(ms){

    return new Promise(resolve=>{
        setTimeout(resolve,ms);
    });

}