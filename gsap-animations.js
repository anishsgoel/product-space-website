// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
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
    .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.5');


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

    // Alumni logos - reveal all together
    ScrollTrigger.batch('.alumni-logo', {
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