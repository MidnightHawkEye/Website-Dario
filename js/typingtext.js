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
    "Welcome, USER."
];


let line = 0;
let character = 0;

function typeLine() {
        if (!terminal) {
            return;
        }

        if (line >= lines.length) {
            finishHeroSequence();
            return;
        }

    const currentLine = lines[line];

        if (character < currentLine.length) {
            terminal.append(currentLine.charAt(character));
            character++;
            setTimeout(typeLine, 35);
            return;
        }

    terminal.appendChild(document.createElement("br"));

    line++;
    character = 0;

    setTimeout(typeLine, 350);
}

function finishHeroSequence() {
    const button = document.querySelector(".hero-button");
    const motto = document.querySelector(".hero-motto");

        if (button) {
            button.classList.add("show");
        }

    setTimeout(() => {
        if (motto) {
            motto.classList.add("show");
        }
    }, 250);
}

typeLine();