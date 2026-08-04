const heroTerminalOutputElement = document.getElementById(
    "hero-terminal-output"
);
const characterDelayMs = 35;
const lineDelayMs = 350;
const mottoRevealDelayMs = 250;

const terminalLines = [
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


let currentLineIndex = 0;
let currentCharacterIndex = 0;

function typeNextHeroCharacter() {
        if (!heroTerminalOutputElement) {
            return;
        }

        if (currentLineIndex >= terminalLines.length) {
            finishHeroSequence();
            return;
        }

    const currentLine = terminalLines[currentLineIndex];

        if (currentCharacterIndex < currentLine.length) {
            heroTerminalOutputElement.append(
                currentLine.charAt(currentCharacterIndex)
            );
            currentCharacterIndex++;
            setTimeout(typeNextHeroCharacter, characterDelayMs);
            return;
        }

    heroTerminalOutputElement.appendChild(
        document.createElement("br")
    );

    currentLineIndex++;
    currentCharacterIndex = 0;

    setTimeout(typeNextHeroCharacter, lineDelayMs);
}

function finishHeroSequence() {
    const heroButtonElement =
        document.querySelector(".hero-button");
    const heroMottoElement =
        document.querySelector(".hero-motto");

        if (heroButtonElement) {
            heroButtonElement.classList.add("show");
        }

    setTimeout(() => {
        if (heroMottoElement) {
            heroMottoElement.classList.add("show");
        }
    }, mottoRevealDelayMs);
}

typeNextHeroCharacter();
