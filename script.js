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
        // The open panel is a mobile-only layout; leaving it up past the breakpoint
        // strands it over the desktop nav.
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) setOpen(false);
        }, { passive: true });
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

    // --- Hero mark: hovering a grid cell lifts every tile fragment in it. Hit squares are flat and
    //     never move, so there is no hover ping-pong as tiles rise. Tap does the same on touch.
    const heroMark = document.querySelector('.hero-mark');
    if (heroMark) {
        const tiles = Array.from(heroMark.querySelectorAll('.hero-tile'));
        let current = null;
        const clear = () => { tiles.forEach((t) => t.classList.remove('is-up')); current = null; };
        heroMark.addEventListener('pointerover', (e) => {
            const hit = e.target.closest && e.target.closest('.hero-hit');
            if (!hit) return;
            const cell = hit.dataset.cell;
            if (cell === current) return;
            clear();
            current = cell;
            tiles.forEach((t) => { if (t.dataset.cell === cell) t.classList.add('is-up'); });
        });
        heroMark.addEventListener('pointerleave', clear);
    }

    // --- Logo / client tickers: clone the track for a seamless loop, pace by card count ---
    if (!reduceMotion) {
        document.querySelectorAll('.ticker').forEach((ticker) => {
            const track = ticker.querySelector('.ticker-track');
            if (!track) return;
            const cards = Array.from(track.children);
            if (!cards.length) return;
            // ~6s per card (clamped) so more logos scroll proportionally — slow, readable
            const dur = Math.min(150, Math.max(34, cards.length * 6));
            track.style.setProperty('--ticker-dur', dur + 's');
            cards.forEach((c) => {
                const clone = c.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
                track.appendChild(clone);
            });
        });
    }

    // --- Scroll reveal (content is fully visible without JS; this only enhances) ---
    const revealSelector = '.section-head, .feature, .client-card, .explore-card, .portfolio-card, .capstone-card, .team-card, .fellowship-module, .pipeline-step, .stat, .path-card, .rvl, .path';
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

    // --- About: vertical path fill tracks scroll progress ---
    document.querySelectorAll('.vpath').forEach((vpath) => {
        if (reduceMotion) {
            vpath.style.setProperty('--vpath-progress', '100%');
        } else {
            const steps = Array.from(vpath.querySelectorAll('.vpath-step'));
            const onVPathScroll = () => {
                const r = vpath.getBoundingClientRect();
                // The horizontal variant is short, so scrubbing against its own height
                // would fill it almost instantly. Scrub it against a slice of the
                // viewport instead. (It reverts to the vertical layout under 861px.)
                const horizontal = vpath.classList.contains('vpath-h') && window.innerWidth > 860;
                let p;
                if (horizontal) {
                    const from = window.innerHeight * 0.9;
                    const to = window.innerHeight * 0.3;
                    p = (from - r.top) / (from - to);
                } else {
                    // Fill as the path crosses the lower half of the viewport…
                    p = (window.innerHeight * 0.72 - r.top) / r.height;
                }
                // …and guarantee 100% once the page can't scroll any further (path is the last section).
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                if (maxScroll - window.scrollY < 4) p = 1;
                p = Math.max(0, Math.min(1, p));
                vpath.style.setProperty('--vpath-progress', (p * 100).toFixed(1) + '%');

                // Light each node as the fill reaches it.
                if (horizontal && steps.length > 1) {
                    steps.forEach((step, i) => {
                        step.classList.toggle('is-lit', p >= i / (steps.length - 1) - 0.001);
                    });
                }
            };
            onVPathScroll();
            window.addEventListener('scroll', onVPathScroll, { passive: true });
            window.addEventListener('resize', onVPathScroll, { passive: true });
        }
    });

    // --- Careers: rotating editorial pull-quote ---
    const pq = document.querySelector('.pullquotes');
    if (pq) {
        const slides = Array.from(pq.querySelectorAll('.pullquote'));
        const dots = Array.from(pq.querySelectorAll('.pullquote-dots button'));
        if (slides.length > 1) {
            let idx = 0, timer = null;
            const show = (i) => {
                slides.forEach((s, n) => s.classList.toggle('is-active', n === i));
                dots.forEach((d, n) => d.classList.toggle('active', n === i));
                idx = i;
            };
            const restart = () => {
                if (timer) clearInterval(timer);
                if (!reduceMotion) timer = setInterval(() => show((idx + 1) % slides.length), 6000);
            };
            dots.forEach((d, n) => d.addEventListener('click', () => { show(n); restart(); }));
            show(0); restart();
        }
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
        stats.forEach((s) => { s.dataset.value = s.textContent; s.textContent = s.dataset.value.replace(/\d[\d,]*/, '0'); so.observe(s); });
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
            // Route the project inquiry to the club inbox via the visitor's email client
            const subject = 'Project inquiry from ' + (data.company || data.name || 'a company');
            const timelineLabel = { immediate: 'Immediate (under 1 month)', short: '1-3 months', medium: '3-6 months', long: '6+ months' }[data.timeline] || data.timeline || '';
            const body = [
                'Name: ' + (data.name || ''),
                'Email: ' + (data.email || ''),
                'Company: ' + (data.company || ''),
                'Timeline: ' + timelineLabel,
                '',
                (data.message || '')
            ].join('\n');
            window.location.href = 'mailto:productspacegeorgetown@gmail.com'
                + '?subject=' + encodeURIComponent(subject)
                + '&body=' + encodeURIComponent(body);
            showMessage(msg, 'Opening your email app to send this to our team. If nothing opens, email us at productspacegeorgetown@gmail.com.', 'success');
            form.reset();
        });
    });

    // --- Announcement banner: measure its height so the fixed navbar sits below it ---
    const banner = document.querySelector('.site-banner');
    if (banner) {
        const BANNER_KEY = 'ps-banner-dismissed-f26';
        let bannerDismissed = false;
        try { bannerDismissed = localStorage.getItem(BANNER_KEY) === '1'; } catch (e) { /* private mode */ }

        const clearBanner = () => {
            banner.remove();
            document.body.classList.remove('has-banner');
            document.documentElement.style.setProperty('--banner-h', '0px');
            document.body.style.setProperty('--banner-h', '0px');
            document.documentElement.style.setProperty('--nav-h', '0px');
            document.body.style.setProperty('--nav-h', '0px');
        };

        if (bannerDismissed) {
            clearBanner();
        } else {
            const syncBannerHeight = () => {
                const nav = document.querySelector('.navbar');
                const setVar = (name, value) => {
                    document.documentElement.style.setProperty(name, value);
                    document.body.style.setProperty(name, value);
                };
                if (nav) setVar('--nav-h', nav.offsetHeight + 'px');
                setVar('--banner-h', banner.offsetHeight + 'px');
            };
            syncBannerHeight();
            window.addEventListener('resize', syncBannerHeight, { passive: true });

            const closeBtn = banner.querySelector('.site-banner-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    clearBanner();
                    try { localStorage.setItem(BANNER_KEY, '1'); } catch (e) { /* private mode */ }
                });
            }
        }
    }

    // --- Students dropdown: hover and focus are CSS; JS adds tap, Escape, outside-click ---
    document.querySelectorAll('.nav-item-has-menu').forEach((item) => {
        const trigger = item.querySelector('.nav-trigger');
        const sub = item.querySelector('.nav-sub');
        if (!trigger || !sub) return;

        const setSubOpen = (open) => {
            sub.classList.toggle('open', open);
            trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            setSubOpen(!sub.classList.contains('open'));
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { setSubOpen(false); trigger.focus(); }
        });
        document.addEventListener('click', (e) => {
            if (!item.contains(e.target)) setSubOpen(false);
        });
    });

    // --- Cursor-following ambient glow on the lit sections ---
    if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.glow-follow').forEach((section) => {
            let frame = 0;
            let px = 0;
            let py = 0;
            const paint = () => {
                frame = 0;
                section.style.setProperty('--mx', px + 'px');
                section.style.setProperty('--my', py + 'px');
            };
            section.addEventListener('pointermove', (e) => {
                const rect = section.getBoundingClientRect();
                px = e.clientX - rect.left;
                py = e.clientY - rect.top;
                if (!frame) frame = window.requestAnimationFrame(paint);
            }, { passive: true });
            section.addEventListener('pointerenter', () => section.classList.add('glow-on'));
            section.addEventListener('pointerleave', () => section.classList.remove('glow-on'));
        });
    }

    // --- Leadership cards: CSS flips on hover; this covers touch and keyboard ---
    document.querySelectorAll('.team-card').forEach((card) => {
        const flip = () => {
            const willFlip = !card.classList.contains('is-flipped');
            document.querySelectorAll('.team-card.is-flipped').forEach((other) => {
                if (other !== card) {
                    other.classList.remove('is-flipped');
                    other.setAttribute('aria-pressed', 'false');
                }
            });
            card.classList.toggle('is-flipped', willFlip);
            card.setAttribute('aria-pressed', willFlip ? 'true' : 'false');
        };
        card.addEventListener('click', flip);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
        });
    });
})();
