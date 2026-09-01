/*--------------------- Particle Settings ---------------------*/

const desktopParticleCount = 60;
const mobileParticleDivider = 3;
const retroEra = "1998";
const modernSnowflakeCount = 46;
const retroSnowflakeCount = 34;
const mobileSnowflakeDivider = 2.4;
const reducedMotionSnowflakeDivider = 3.5;
const retroAmbientDesktopPixelCount = 18;
const retroAmbientMobileDivider = 2.25;
const retroAmbientFrameIntervalMs = 100;

const mobileParticleQuery = window.matchMedia(
    `(max-width: ${mobileBreakpointPx}px)`
);

const mouseRepelDistancePx = 150;
const connectionDistancePx = 120;
const connectionFadeDistancePx = 140;

function getTargetParticleCount() {
    if (mobileParticleQuery.matches) {
        return Math.floor(
            desktopParticleCount / mobileParticleDivider
        );
    }

    return desktopParticleCount;
}

function snowModeEnabled() {
    return document.documentElement.classList.contains("snow-mode");
}

function retroAmbientModeEnabled() {
    return !snowModeEnabled() &&
        document.documentElement.dataset.era === retroEra;
}

function getTargetRetroAmbientPixelCount() {
    const targetCount = mobileParticleQuery.matches
        ? retroAmbientDesktopPixelCount / retroAmbientMobileDivider
        : retroAmbientDesktopPixelCount;

    return Math.max(6, Math.round(targetCount));
}

function getTargetSnowflakeCount() {
    const isRetroEra =
        document.documentElement.dataset.era === retroEra;
    let targetCount = isRetroEra
        ? retroSnowflakeCount
        : modernSnowflakeCount;

    if (mobileParticleQuery.matches) {
        targetCount /= mobileSnowflakeDivider;
    }

    if (prefersReducedMotion()) {
        targetCount /= reducedMotionSnowflakeDivider;
    }

    return Math.max(6, Math.round(targetCount));
}

/*--------------------- Mouse Movement ---------------------*/

const pointerPosition = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

window.addEventListener("mousemove", (event) => {
    pointerPosition.x = event.clientX;
    pointerPosition.y = event.clientY;
});

/*--------------------- Particle ---------------------*/

const particleCanvas = document.getElementById("particle-canvas");
const particleContext = particleCanvas.getContext("2d");

particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

/*--------------------- Particle Random Position ---------------------*/

class Particle{

    constructor(){

        this.x = Math.random()*particleCanvas.width;
        this.y = Math.random()*particleCanvas.height;

        const random = Math.random();

            if(random < 0.70){

                // little particles
                this.type = "small";
                this.radius = Math.random()*1.5+1.2;
                this.opacity = 0.12;
                this.speedY = Math.random()*0.12+0.03;

            }else if(random < 0.95){

                // middle particles
                this.type = "medium";
                this.radius = Math.random()*2+2;
                this.opacity = 0.35;
                this.speedY = Math.random()*0.18+0.05;

            }else{

                // big particles
                this.type = "large";
                this.radius = Math.random()*2+3;
                this.opacity = 0.3;
                this.speedY = Math.random()*0.08+0.02;

            }

        this.angle = Math.random() * Math.PI * 2;
        this.speedX = (Math.random() - 0.5) * 0.3;

    }

    /*--------------------- Particle Drawing ---------------------*/

    draw(){

        /*--------------------- Glow ---------------------*/

        let glowRadius;

        if(this.type==="small"){
            glowRadius=this.radius*3;

        }else if(this.type==="medium"){
            glowRadius=this.radius*5;

        }else{
            glowRadius=this.radius*8;
        }


    const gradient = particleContext.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        glowRadius
        );

    gradient.addColorStop(0, `rgba(120,255,180,${this.opacity})`);
    gradient.addColorStop(1, "rgba(0,255,136,0)");
    particleContext.beginPath();
    particleContext.fillStyle = gradient;

    particleContext.arc(
        this.x,
        this.y,
        glowRadius,
        0,
        Math.PI * 2
        );

    particleContext.fill();
    }

    /*--------------------- Particle Movement ---------------------*/

    update(){

    this.y-=this.speedY;
    this.x += Math.sin(this.angle) * 0.05;
    this.angle += 0.01;
    this.x += this.speedX;

        if(this.y<0){
            this.y=particleCanvas.height;
            this.x=Math.random()*particleCanvas.width;
        }

        if(this.x < 0){
            this.x = particleCanvas.width;
        }

        if(this.x > particleCanvas.width){
            this.x = 0;
        }

    const dx = pointerPosition.x - this.x;
    const dy = pointerPosition.y - this.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRepelDistancePx) {
            this.x -= dx * 0.002;
            this.y -= dy * 0.002;
        }
    this.draw();
}
}

/*--------------------- Winter Snowflake ---------------------*/

class Snowflake {
    constructor(isRetroEra) {
        this.isRetroEra = isRetroEra;
        this.reset(true);
    }

    reset(initialPosition = false) {
        this.x = Math.random() * particleCanvas.width;
        this.y = initialPosition
            ? Math.random() * particleCanvas.height
            : -8;
        this.size = this.isRetroEra
            ? Math.floor(Math.random() * 4) + 2
            : Math.random() * 2.8 + 1.2;
        this.opacity = this.isRetroEra
            ? Math.random() * 0.32 + 0.42
            : Math.random() * 0.48 + 0.28;
        this.speedY = this.isRetroEra
            ? Math.random() * 22 + 18
            : Math.random() * 38 + 22;
        this.driftSpeed = (Math.random() - 0.5) *
            (this.isRetroEra ? 12 : 18);
        this.driftPhase = Math.random() * Math.PI * 2;
        this.driftRate = Math.random() * 0.0012 + 0.00045;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.0007;
    }

    drawModern() {
        particleContext.save();
        particleContext.translate(this.x, this.y);
        particleContext.rotate(this.rotation);
        particleContext.globalAlpha = this.opacity;
        particleContext.fillStyle = "#ffffff";
        particleContext.shadowColor = "rgba(220, 242, 255, 0.9)";
        particleContext.shadowBlur = this.size * 2.6;
        particleContext.beginPath();
        particleContext.arc(0, 0, this.size, 0, Math.PI * 2);
        particleContext.fill();

        if (this.size > 2.8) {
            particleContext.lineWidth = 0.55;
            particleContext.strokeStyle = "rgba(255, 255, 255, 0.78)";

            for (let arm = 0; arm < 3; arm += 1) {
                particleContext.rotate(Math.PI / 3);
                particleContext.beginPath();
                particleContext.moveTo(-this.size * 1.55, 0);
                particleContext.lineTo(this.size * 1.55, 0);
                particleContext.stroke();
            }
        }

        particleContext.restore();
    }

    drawRetro() {
        particleContext.save();
        particleContext.globalAlpha = this.opacity;
        particleContext.fillStyle = "#ffffff";
        particleContext.shadowBlur = 0;
        particleContext.fillRect(
            Math.round(this.x),
            Math.round(this.y),
            this.size,
            this.size
        );
        particleContext.restore();
    }

    update(deltaTimeMs) {
        const motionScale = prefersReducedMotion() ? 0.22 : 1;
        const deltaSeconds = deltaTimeMs / 1000;

        this.y += this.speedY * deltaSeconds * motionScale;
        this.driftPhase += this.driftRate * deltaTimeMs * motionScale;
        this.x += (
            this.driftSpeed + Math.sin(this.driftPhase) * 8
        ) * deltaSeconds * motionScale;
        this.rotation += this.rotationSpeed * deltaTimeMs * motionScale;

        if (
            this.y > particleCanvas.height + this.size ||
            this.x < -24 ||
            this.x > particleCanvas.width + 24
        ) {
            this.reset(false);
        }

        if (this.isRetroEra) {
            this.drawRetro();
            return;
        }

        this.drawModern();
    }
}

/*--------------------- Win98 Ambient Data Pixels ---------------------*/

class RetroAmbientPixel {
    constructor() {
        this.reset(true);
    }

    reset(initialPosition = false) {
        this.x = initialPosition
            ? Math.random() * particleCanvas.width
            : -8;
        this.y = Math.random() * particleCanvas.height;
        const sizeVariation = Math.random();
        this.size = sizeVariation < 0.7
            ? 2
            : sizeVariation < 0.94
                ? 3
                : 4;
        this.opacity = Math.random() * 0.14 + 0.18;
        this.speedX = Math.random() * 3.5 + 3;
        this.speedY = (Math.random() - 0.5) * 2.4;
        this.flickerPhase = Math.random() * Math.PI * 2;
        this.flickerRate = Math.random() * 0.00028 + 0.00024;
        this.hasDataTick = Math.random() < 0.32;
        this.color = Math.random() < 0.18
            ? "#c0c0c0"
            : Math.random() < 0.55
                ? "#000080"
                : "#003f5c";
    }

    draw(timestamp) {
        const flicker = 0.68 +
            Math.sin(timestamp * this.flickerRate + this.flickerPhase) * 0.32;
        const x = Math.round(this.x);
        const y = Math.round(this.y);

        particleContext.globalAlpha = this.opacity * flicker;
        particleContext.fillStyle = this.color;
        particleContext.fillRect(x, y, this.size, this.size);

        if (this.hasDataTick && flicker > 0.94) {
            particleContext.fillRect(
                x - this.size * 3,
                y,
                this.size * 2,
                1
            );
        }

        particleContext.globalAlpha = 1;
    }

    update(deltaTimeMs, timestamp) {
        const deltaSeconds = deltaTimeMs / 1000;

        this.x += this.speedX * deltaSeconds;
        this.y += this.speedY * deltaSeconds;

        if (
            this.x > particleCanvas.width + 8 ||
            this.y < -8 ||
            this.y > particleCanvas.height + 8
        ) {
            this.reset(false);
        }

        this.draw(timestamp);
    }
}

/*--------------------- Particle Creating many Particles ---------------------*/

const particles = [];
const snowflakes = [];
const retroAmbientPixels = [];
let snowflakeEra = null;

function adjustParticleCount() {
    const targetParticleCount = getTargetParticleCount();

    while (particles.length > targetParticleCount) {
        particles.pop();
    }

    while (particles.length < targetParticleCount) {
        particles.push(new Particle());
    }
}

function adjustSnowflakeCount() {
    const currentEra = document.documentElement.dataset.era;

    if (snowflakeEra !== currentEra) {
        snowflakes.length = 0;
        snowflakeEra = currentEra;
    }

    const targetSnowflakeCount = getTargetSnowflakeCount();
    const isRetroEra = currentEra === retroEra;

    while (snowflakes.length > targetSnowflakeCount) {
        snowflakes.pop();
    }

    while (snowflakes.length < targetSnowflakeCount) {
        snowflakes.push(new Snowflake(isRetroEra));
    }
}

function adjustRetroAmbientPixelCount() {
    const targetPixelCount = getTargetRetroAmbientPixelCount();

    while (retroAmbientPixels.length > targetPixelCount) {
        retroAmbientPixels.pop();
    }

    while (retroAmbientPixels.length < targetPixelCount) {
        retroAmbientPixels.push(new RetroAmbientPixel());
    }
}

/*--------------------- Particle Animates ---------------------*/

let particleAnimationFrameId = null;
let lastParticleFrameTimestamp = 0;

function animateParticles(timestamp) {
    const snowIsActive = snowModeEnabled();
    const retroAmbientIsActive = retroAmbientModeEnabled();
    const elapsedSinceLastFrameMs = lastParticleFrameTimestamp === 0
        ? 1000 / 60
        : timestamp - lastParticleFrameTimestamp;
    const targetFrameIntervalMs = snowIsActive
        ? prefersReducedMotion()
            ? 160
            : document.documentElement.dataset.era === retroEra
                ? 80
                : 0
        : retroAmbientIsActive
            ? retroAmbientFrameIntervalMs
            : 0;

    if (
        targetFrameIntervalMs > 0 &&
        lastParticleFrameTimestamp !== 0 &&
        elapsedSinceLastFrameMs < targetFrameIntervalMs
    ) {
        particleAnimationFrameId =
            requestAnimationFrame(animateParticles);
        return;
    }

    const elapsedTimeMs = Math.min(200, elapsedSinceLastFrameMs);
    lastParticleFrameTimestamp = timestamp;
    particleContext.clearRect(
        0,
        0,
        particleCanvas.width,
        particleCanvas.height
    );

    if (snowIsActive) {
        snowflakes.forEach((snowflake) => {
            snowflake.update(elapsedTimeMs);
        });
    } else if (retroAmbientIsActive) {
        retroAmbientPixels.forEach((pixel) => {
            pixel.update(elapsedTimeMs, timestamp);
        });
    } else {
        particles.forEach((particle) => {
            particle.update();
        });

        connectParticles();
    }

    particleAnimationFrameId =
        requestAnimationFrame(animateParticles);
}

function drawStaticSnow() {
    clearParticleAnimation();
    snowflakes.forEach((snowflake) => {
        if (snowflake.isRetroEra) {
            snowflake.drawRetro();
            return;
        }

        snowflake.drawModern();
    });
}

function startParticleAnimation() {
    const snowIsActive = snowModeEnabled();

    if (
        particleAnimationFrameId !== null ||
        !isTabActive()
    ) {
        return;
    }

    if (prefersReducedMotion()) {
        if (snowIsActive) {
            adjustSnowflakeCount();
            drawStaticSnow();
        }

        return;
    }

    if (snowIsActive) {
        adjustSnowflakeCount();
    } else if (retroAmbientModeEnabled()) {
        adjustRetroAmbientPixelCount();
    } else {
        adjustParticleCount();
    }

    lastParticleFrameTimestamp = 0;
    particleAnimationFrameId =
        requestAnimationFrame(animateParticles);
}

function stopParticleAnimation() {
    if (particleAnimationFrameId === null) {
        return;
    }

    cancelAnimationFrame(
        particleAnimationFrameId
    );

    particleAnimationFrameId = null;
    lastParticleFrameTimestamp = 0;
}

function clearParticleAnimation() {
    particleContext.clearRect(
        0,
        0,
        particleCanvas.width,
        particleCanvas.height
    );
}

function updateParticleMotionPreference(event) {
    stopParticleAnimation();
    clearParticleAnimation();

    if (snowModeEnabled()) {
        adjustSnowflakeCount();
    }

    startParticleAnimation();
}

addReducedMotionListener(updateParticleMotionPreference);

window.addEventListener("dario:era-change", (event) => {
    stopParticleAnimation();
    clearParticleAnimation();

    if (snowModeEnabled()) {
        retroAmbientPixels.length = 0;
        snowflakes.length = 0;
        snowflakeEra = null;
        adjustSnowflakeCount();
    } else if (event.detail?.era === retroEra) {
        retroAmbientPixels.length = 0;
        adjustRetroAmbientPixelCount();
    } else {
        retroAmbientPixels.length = 0;
        adjustParticleCount();
    }

    startParticleAnimation();
});

window.addEventListener("dario:snow-mode-change", (event) => {
    stopParticleAnimation();
    clearParticleAnimation();

    if (event.detail?.enabled) {
        retroAmbientPixels.length = 0;
        snowflakes.length = 0;
        snowflakeEra = null;
        adjustSnowflakeCount();
    } else {
        snowflakes.length = 0;
        snowflakeEra = null;

        if (retroAmbientModeEnabled()) {
            retroAmbientPixels.length = 0;
            adjustRetroAmbientPixelCount();
        } else {
            adjustParticleCount();
        }
    }

    startParticleAnimation();
});

document.addEventListener("visibilitychange", () => {
    if (isTabActive()) {
        startParticleAnimation();
    } else {
        stopParticleAnimation();
    }
});

startParticleAnimation();

/*--------------------- Connection Particle Animates ---------------------*/

function connectParticles() {

    for (let a = 0; a < particles.length; a++) {

        for (let b = a + 1; b < particles.length; b++) {

            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;

            const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistancePx) {

                    const alpha = (1 - distance / connectionFadeDistancePx) * 0.35;

                    particleContext.beginPath();

                    particleContext.moveTo(
                        particles[a].x,
                        particles[a].y
                    );

                    particleContext.lineTo(
                        particles[b].x,
                        particles[b].y
                    );

                    particleContext.strokeStyle = `rgba(0,255,136,${alpha})`;

                    particleContext.lineWidth = 0.8;

                    particleContext.stroke();
            }
        }
    }
}

/*--------------------- Particle Resize ---------------------*/

window.addEventListener("resize", () => {

    const oldWidth = particleCanvas.width;
    const oldHeight = particleCanvas.height;

    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Distribute existing particles proportionally across the new area
    particles.forEach((particle) => {

        if (oldWidth > 0) {
            particle.x =
                (particle.x / oldWidth) * newWidth;
        }

        if (oldHeight > 0) {
            particle.y =
                (particle.y / oldHeight) * newHeight;
        }

    });

    snowflakes.forEach((snowflake) => {
        if (oldWidth > 0) {
            snowflake.x =
                (snowflake.x / oldWidth) * newWidth;
        }

        if (oldHeight > 0) {
            snowflake.y =
                (snowflake.y / oldHeight) * newHeight;
        }
    });

    retroAmbientPixels.forEach((pixel) => {
        if (oldWidth > 0) {
            pixel.x = (pixel.x / oldWidth) * newWidth;
        }

        if (oldHeight > 0) {
            pixel.y = (pixel.y / oldHeight) * newHeight;
        }
    });

    // Resize the canvas to the new viewport size
    particleCanvas.width = newWidth;
    particleCanvas.height = newHeight;

    // Keep the mouse position within the new viewport
    pointerPosition.x = Math.max(
        0,
        Math.min(pointerPosition.x, newWidth)
    );

    pointerPosition.y = Math.max(
        0,
        Math.min(pointerPosition.y, newHeight)
    );

    if (snowModeEnabled()) {
        adjustSnowflakeCount();
    } else if (retroAmbientModeEnabled()) {
        adjustRetroAmbientPixelCount();
    } else {
        adjustParticleCount();
    }

    if (prefersReducedMotion() && snowModeEnabled()) {
        drawStaticSnow();
    }
});
