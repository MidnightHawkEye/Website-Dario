
/*--------------------- Mouse Movement ---------------------*/

const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/*--------------------- Particle ---------------------*/

const particleCanvas = document.getElementById("particles");
const particleCtx = particleCanvas.getContext("2d");

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

        /*--------------------- Position Memory ---------------------*/

        this.baseX = this.x;
        this.baseY = this.y;

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


    const gradient = particleCtx.createRadialGradient(
    this.x,
    this.y,
    0,
    this.x,
    this.y,
    glowRadius
    );

    gradient.addColorStop(0, `rgba(120,255,180,${this.opacity})`);
    gradient.addColorStop(1, "rgba(0,255,136,0)");

    particleCtx.beginPath();

    particleCtx.fillStyle = gradient;

    particleCtx.arc(
    this.x,
    this.y,
    glowRadius,
    0,
    Math.PI * 2
    );

    particleCtx.fill();
    }

    /*--------------------- Particle Movement ---------------------*/

    update(){

    this.y-=this.speedY;

    this.x += Math.sin(this.angle) * 0.25;

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

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {

        this.x -= dx * 0.002;
        this.y -= dy * 0.002;

        }


    this.draw();

}
}


/*--------------------- Particle Creating many Particles ---------------------*/

const particles=[];

for(let i=0;i<60;i++){

    particles.push(new Particle());

}

/*--------------------- Particle Animates ---------------------*/

function animate(){

    particleCtx.clearRect(
        0,
        0,
        particleCanvas.width,
        particleCanvas.height
    );

    particles.forEach(particle=>{

        particle.update();

    });
    connectParticles();

    requestAnimationFrame(animate);

}

animate();

/*--------------------- Connection Particle Animates ---------------------*/

function connectParticles() {

    for (let a = 0; a < particles.length; a++) {

        for (let b = a + 1; b < particles.length; b++) {

            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {

                const alpha = (1 - distance / 140) * 0.35;

                particleCtx.beginPath();

                particleCtx.moveTo(
                    particles[a].x,
                    particles[a].y
                );

                particleCtx.lineTo(
                    particles[b].x,
                    particles[b].y
                );

                particleCtx.strokeStyle = `rgba(0,255,136,${alpha})`;

                particleCtx.lineWidth = 0.8;

                particleCtx.stroke();

            }

        }

    }

}


/*--------------------- Particle Resize ---------------------*/

window.addEventListener("resize",()=>{

    particleCanvas.width=window.innerWidth;

    particleCanvas.height=window.innerHeight;

});