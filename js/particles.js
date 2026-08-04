/*--------------------- Particle Settings ---------------------*/

const desktopParticleCount = 60;
const mobileParticleDivider = 3;

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

/*--------------------- Particle Creating many Particles ---------------------*/

const particles = [];

function adjustParticleCount() {
    const targetParticleCount = getTargetParticleCount();

    while (particles.length > targetParticleCount) {
        particles.pop();
    }

    while (particles.length < targetParticleCount) {
        particles.push(new Particle());
    }
}

adjustParticleCount();
/*--------------------- Particle Animates ---------------------*/

let particleAnimationFrameId = null;

function animateParticles() {
    particleContext.clearRect(
        0,
        0,
        particleCanvas.width,
        particleCanvas.height
    );

    particles.forEach((particle) => {
        particle.update();
    });

    connectParticles();

    particleAnimationFrameId =
        requestAnimationFrame(animateParticles);
}

function startParticleAnimation() {
    if (
        particleAnimationFrameId !== null ||
        !isTabActive() ||
        prefersReducedMotion()
    ) {
        return;
    }

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
    if (event.matches) {
        stopParticleAnimation();
        clearParticleAnimation();
        return;
    }

    startParticleAnimation();
}

addReducedMotionListener(updateParticleMotionPreference);

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

    adjustParticleCount();
});
