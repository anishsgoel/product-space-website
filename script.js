// Product Space @ Georgetown — site interactions (GSAP-free)
(function () {
    'use strict';

    // --- Mobile menu ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        const setOpen = (open) => {
            navMenu.classList.toggle('active', open);
            hamburger.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
        };
        hamburger.addEventListener('click', () => setOpen(!navMenu.classList.contains('active')));
        navMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    }

    // --- Navbar shadow on scroll (stays visible; no auto-hide) ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- Smooth in-page anchor scrolling ---
    document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
            }
        });
    });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Scroll reveal (content is fully visible without JS; this only enhances) ---
    const revealSelector = '.section-head, .feature, .client-card, .explore-card, .portfolio-card, .capstone-card, .team-card, .fellowship-module, .pipeline-step, .stat, .path-card';
    const revealEls = Array.from(document.querySelectorAll(revealSelector));
    const revealAll = () => revealEls.forEach((el) => el.classList.add('in-view'));

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealAll();
    } else {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach((el) => io.observe(el));
        window.setTimeout(revealAll, 2500); // hard failsafe: never leave content hidden
    }

    // --- Count-up for stats (real numbers live in HTML; JS only animates from 0) ---
    const stats = Array.from(document.querySelectorAll('.stat h3'));
    const runCount = (el) => {
        const raw = el.dataset.value || el.textContent;
        const num = parseInt(raw.replace(/\D/g, ''), 10);
        if (!num || reduceMotion) return;
        const prefix = raw.trim().charAt(0) === '$' ? '$' : '';
        const suffix = raw.indexOf('+') !== -1 ? '+' : '';
        const unit = /k/i.test(raw) ? 'k' : '';
        const start = performance.now();
        const dur = 1400;
        const step = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const val = Math.round(num * (0.5 - Math.cos(Math.PI * p) / 2));
            el.textContent = prefix + val + unit + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    if (stats.length && 'IntersectionObserver' in window && !reduceMotion) {
        const so = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) { runCount(entry.target); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.5 });
        stats.forEach((s) => { s.dataset.value = s.textContent; so.observe(s); });
    }

    // --- Apply page: student / company toggle ---
    const tabs = Array.from(document.querySelectorAll('.apply-tab'));
    if (tabs.length) {
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.target;
                tabs.forEach((t) => {
                    const on = t === tab;
                    t.classList.toggle('active', on);
                    t.setAttribute('aria-pressed', on ? 'true' : 'false');
                });
                document.querySelectorAll('.apply-form').forEach((form) => {
                    form.classList.toggle('hidden', form.dataset.role !== target);
                });
            });
        });
    }

    // --- Form handling (validates the visible form only) ---
    const showMessage = (el, text, type) => {
        if (!el) return;
        el.textContent = text;
        el.className = 'form-message ' + type;
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 6000);
    };
    document.querySelectorAll('form.apply-form, form#contact-form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form));
            const msg = (form.closest('.container') || document).querySelector('.form-message') ||
                document.getElementById('form-message');
            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '');
            const filled = Array.from(form.querySelectorAll('[required]')).every(
                (el) => el.value && el.value.trim() !== ''
            );
            if (!filled || !emailOk) {
                showMessage(msg, 'Please fill in all required fields correctly.', 'error');
                return;
            }
            showMessage(msg, "Thanks for your interest! This is a preview form, so nothing was sent yet. Our official application is coming soon.", 'success');
            form.reset();
        });
    });
})();
