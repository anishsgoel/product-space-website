// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Canvas particle system for hero
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Create particles
        for (let i = 0; i < 80; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                radius: Math.random() * 3 + 1,
                originalX: 0,
                originalY: 0,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const time = Date.now() * 0.001;

        this.particles.forEach((particle, index) => {
            // Mouse interaction with stronger repulsion
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 200;

            if (distance < maxDistance) {
                const force = Math.pow((maxDistance - distance) / maxDistance, 2);
                particle.x -= dx * force * 0.08;
                particle.y -= dy * force * 0.08;
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Boundaries with smooth bounce
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -0.9;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -0.9;

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

            // Pulsing effect
            const pulseRadius = particle.radius + Math.sin(time * 2 + particle.pulseOffset) * 0.5;

            // Draw particle with glow effect
            const gradient = this.ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, pulseRadius * 3);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(191, 96, 136, 0.4)');
            gradient.addColorStop(1, 'rgba(106, 43, 116, 0)');

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Core particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseRadius * 0.5, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.fill();
        });

        // Draw connections with gradient
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    const opacity = 0.3 * (1 - distance / 150);
                    gradient.addColorStop(0, `rgba(191, 96, 136, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity})`);
                    gradient.addColorStop(1, `rgba(106, 43, 116, ${opacity})`);

                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 1.5;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize particle system
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }


    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    ScrollTrigger.create({
        start: 'top -50',
        onUpdate: self => {
            if (self.direction === 1) {
                navbar.classList.add('scrolled');
            } else if (self.progress === 0) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Initial load animation
    const tl = gsap.timeline();
    
    // Navbar
    tl.from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
    
    // Hero title - simple and impactful
    .from('.hero-line-1', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-line-2', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.7')
    
    // Subtitle and CTA
    .from(['.hero-subtitle', '.hero .btn'], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    }, '-=0.5');

    // Scroll indicator
    gsap.to('.scroll-down::before', {
        y: 10,
        opacity: 0.3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });

    // Section headings only - high impact
    gsap.utils.toArray('section h2').forEach(heading => {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: 'top 80%',
                once: true
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Features - reveal all together
    ScrollTrigger.batch('.feature', {
        start: 'top 85%',
        onEnter: batch => gsap.from(batch, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }),
        once: true
    });

    // Client cards - reveal all together
    ScrollTrigger.batch('.client-card', {
        start: 'top 85%',
        onEnter: batch => gsap.from(batch, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }),
        once: true
    });

    // Fellowship modules - reveal all together
    ScrollTrigger.batch('.fellowship-module', {
        start: 'top 85%',
        onEnter: batch => gsap.from(batch, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }),
        once: true
    });

    // Company logos - reveal all together
    ScrollTrigger.batch('.company-logo', {
        start: 'top 90%',
        onEnter: batch => gsap.from(batch, {
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }),
        once: true
    });

    // Stats counter
    gsap.utils.toArray('.stat h3').forEach(stat => {
        const originalText = stat.textContent;
        
        // Special handling for "0→1"
        if (originalText === '0→1') {
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%',
                    once: true
                },
                opacity: 0,
                scale: 0.5,
                duration: 1,
                ease: 'back.out(1.7)'
            });
        } 
        // Special handling for "$35k+"
        else if (originalText.includes('$')) {
            const endValue = parseInt(originalText.replace(/\D/g, ''));
            const obj = { value: 0 };
            
            gsap.to(obj, {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%',
                    once: true
                },
                value: endValue,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                    stat.textContent = '$' + Math.round(obj.value) + 'k+';
                }
            });
        }
        else {
            const endValue = parseInt(originalText);
            const obj = { value: 0 };
            
            gsap.to(obj, {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%',
                    once: true
                },
                value: endValue,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                    stat.textContent = Math.round(obj.value) + (originalText.includes('+') ? '+' : '');
                }
            });
        }
    });

    // Form reveal
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 85%',
            once: true
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Smooth scroll progress
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    gsap.to(progressBar, {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        },
        scaleX: 1,
        transformOrigin: 'left center',
        ease: 'none'
    });

    // Hero content parallax
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        opacity: 0.5,
        ease: 'none'
    });

    // Interactive hover for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
});