const signalRippleSelector = [
    ".hero-button",
    ".project-action-button",
    ".contact-button",
    "#return-to-top-button",
    ".error-button"
].join(",");

function removeSignalRipple(ripple) {
    if (ripple.isConnected) {
        ripple.remove();
    }
}

function createSignalRipple(control, event) {
    if (
        document.documentElement.classList.contains(
            "motion-reduced"
        ) ||
        document.documentElement.dataset.era === "1998" ||
        control.matches(":disabled")
    ) {
        return;
    }

    const controlBounds = control.getBoundingClientRect();
    const hasPointerPosition =
        event.clientX >= controlBounds.left &&
        event.clientX <= controlBounds.right &&
        event.clientY >= controlBounds.top &&
        event.clientY <= controlBounds.bottom;
    const rippleX = hasPointerPosition
        ? event.clientX - controlBounds.left
        : controlBounds.width / 2;
    const rippleY = hasPointerPosition
        ? event.clientY - controlBounds.top
        : controlBounds.height / 2;
    const rippleSize = Math.hypot(
        Math.max(rippleX, controlBounds.width - rippleX),
        Math.max(rippleY, controlBounds.height - rippleY)
    ) * 2;

    control.querySelectorAll(":scope > .signal-ripple").forEach((ripple) => {
        ripple.remove();
    });

    const ripple = document.createElement("span");
    ripple.className = "signal-ripple";
    ripple.setAttribute("aria-hidden", "true");
    ripple.style.setProperty("--signal-ripple-x", `${rippleX}px`);
    ripple.style.setProperty("--signal-ripple-y", `${rippleY}px`);
    ripple.style.setProperty("--signal-ripple-size", `${rippleSize}px`);

    ripple.addEventListener(
        "animationend",
        () => removeSignalRipple(ripple),
        { once: true }
    );

    control.append(ripple);
    window.setTimeout(() => removeSignalRipple(ripple), 700);
}

document.addEventListener("click", (event) => {
    const control = event.target.closest(signalRippleSelector);

    if (!control) {
        return;
    }

    createSignalRipple(control, event);
});
