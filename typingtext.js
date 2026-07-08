const terminal = document.getElementById("typing-text");

const lines = [
    "> booting DARIO.exe...",
    "> loading modules...",
    "> initializing AI systems...",
    "> connecting network...",
    "> verifying identity...",
    "",
    "ACCESS GRANTED",
    "",
    "Welcome, USER.",
];


let line = 0;
let character = 0;

function typeLine(){

    if(line >= lines.length){
        const button = document.querySelector(".hero-button");
        button.classList.add("show");
        return;
    }

    const current = lines[line];

    terminal.innerHTML += current.charAt(character);
    character++;

        if(character < current.length){
            setTimeout(typeLine,35);
            
        }else{
            terminal.innerHTML += "<br>";
            line++;
            character = 0;
            setTimeout(typeLine,350);
        }
}

typeLine();
