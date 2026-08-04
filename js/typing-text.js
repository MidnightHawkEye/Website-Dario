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
let heroTypingTimeoutId = null;
let mottoRevealTimeoutId = null;

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
            heroTypingTimeoutId = setTimeout(
                typeNextHeroCharacter,
                characterDelayMs
            );
            return;
        }

    heroTerminalOutputElement.appendChild(
        document.createElement("br")
    );

    currentLineIndex++;
    currentCharacterIndex = 0;

    heroTypingTimeoutId = setTimeout(
        typeNextHeroCharacter,
        lineDelayMs
    );
}

function finishHeroSequence(showImmediately = false) {
    const heroButtonElement =
        document.querySelector(".hero-button");
    const heroMottoElement =
        document.querySelector(".hero-motto");

        if (heroButtonElement) {
            heroButtonElement.classList.add("show");
        }

    if (mottoRevealTimeoutId !== null) {
        clearTimeout(mottoRevealTimeoutId);
        mottoRevealTimeoutId = null;
    }

    if (showImmediately) {
        if (heroMottoElement) {
            heroMottoElement.classList.add("show");
        }

        return;
    }

    mottoRevealTimeoutId = setTimeout(() => {
        if (heroMottoElement) {
            heroMottoElement.classList.add("show");
        }

        mottoRevealTimeoutId = null;
    }, mottoRevealDelayMs);
}

function completeHeroSequenceImmediately() {
    if (heroTypingTimeoutId !== null) {
        clearTimeout(heroTypingTimeoutId);
        heroTypingTimeoutId = null;
    }

    if (heroTerminalOutputElement) {
        heroTerminalOutputElement.textContent =
            terminalLines.join("\n");
    }

    currentLineIndex = terminalLines.length;
    currentCharacterIndex = 0;
    finishHeroSequence(true);
}

addReducedMotionListener((event) => {
    if (event.matches) {
        completeHeroSequenceImmediately();
    }
});

if (prefersReducedMotion()) {
    completeHeroSequenceImmediately();
} else {
    typeNextHeroCharacter();
}
