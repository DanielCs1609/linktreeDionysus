document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    init3DTilt();
});

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 60;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 0.15 + 0.05;
            this.speedX = (Math.random() - 0.5) * 0.05;
            
            const colorRand = Math.random();
            if (colorRand < 0.6) {
                this.color = `rgba(229, 193, 88, ${Math.random() * 0.4 + 0.15})`;
            } else if (colorRand < 0.8) {
                this.color = `rgba(0, 240, 255, ${Math.random() * 0.3 + 0.1})`;
            } else {
                this.color = `rgba(255, 0, 127, ${Math.random() * 0.3 + 0.1})`;
            }
            
            this.pulse = Math.random() * Math.PI;
            this.pulseSpeed = Math.random() * 0.008 + 0.002;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.pulse += this.pulseSpeed;

            if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                this.reset();
            }
        }

        draw() {
            const currentOpacity = Math.sin(this.pulse) * 0.5 + 0.5;
            ctx.save();
            ctx.globalAlpha = currentOpacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.shadowBlur = this.size * 3;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        const p = new Particle();
        p.y = Math.random() * height;
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function init3DTilt() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    cards.forEach(card => {
        const inner = card.querySelector('.card-inner');
        const glow = card.querySelector('.card-glow-overlay');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xNorm = (x / rect.width) - 0.5;
            const yNorm = (y / rect.height) - 0.5;
            
            const maxTilt = 8;
            const rotateX = -yNorm * maxTilt;
            const rotateY = xNorm * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
            if (inner) {
                inner.style.transform = 'translateZ(30px)';
            }

            if (glow) {
                glow.style.opacity = '1';
                
                let glowColor = 'rgba(255, 255, 255, 0.08)';
                if (card.classList.contains('link-classic')) {
                    glowColor = 'rgba(229, 193, 88, 0.08)';
                } else if (card.classList.contains('link-retro')) {
                    glowColor = 'rgba(0, 240, 255, 0.08)';
                }
                
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glowColor} 0%, transparent 60%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
            if (inner) {
                inner.style.transform = 'translateZ(20px)';
            }
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
}
