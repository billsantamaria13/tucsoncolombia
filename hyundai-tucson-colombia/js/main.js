/* ============================================================
   HTC — Hyundai Tucson Colombia · PREMIUM JS v3
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initHeroAnimations();
    initNewsCarousel();
    initGallerySlider();
    initScrollAnimations();
    initScrollTop();
    initCounters();
    initContactForm();
    initTiltEffect();
});

/* ----------------------------------------------------------------
   NAVBAR
   ---------------------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        links.forEach(l => l.classList.toggle('active', l.dataset.section === current));
    }, { passive: true });
}

/* ----------------------------------------------------------------
   MOBILE MENU
   ---------------------------------------------------------------- */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('open');
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ----------------------------------------------------------------
   HERO ANIMATIONS (staggered reveal)
   ---------------------------------------------------------------- */
function initHeroAnimations() {
    document.querySelectorAll('.hero-content .anim').forEach((el, i) => {
        setTimeout(() => el.classList.add('show'), 300 + i * 180);
    });
}

/* ----------------------------------------------------------------
   NEWS CAROUSEL
   ---------------------------------------------------------------- */
function initNewsCarousel() {
    createSlider({
        trackId: 'carouselTrack',
        dotsId: 'carouselDots',
        prevId: 'carouselPrev',
        nextId: 'carouselNext',
        slideSelector: '.carousel-slide',
        interval: 5500,
    });
}

/* ----------------------------------------------------------------
   GALLERY SLIDER
   ---------------------------------------------------------------- */
function initGallerySlider() {
    createSlider({
        trackId: 'galleryTrack',
        dotsId: 'galleryDots',
        prevId: 'galleryPrev',
        nextId: 'galleryNext',
        slideSelector: '.gallery-slide',
        interval: 4500,
        counterId: 'galleryCounter',
    });
}

/* ----------------------------------------------------------------
   GENERIC SLIDER ENGINE
   ---------------------------------------------------------------- */
function createSlider({ trackId, dotsId, prevId, nextId, slideSelector, interval, counterId }) {
    const track = document.getElementById(trackId);
    const dotsWrap = document.getElementById(dotsId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const counter = counterId ? document.getElementById(counterId) : null;
    if (!track || !dotsWrap) return;

    const slides = track.querySelectorAll(slideSelector);
    const dots = dotsWrap.querySelectorAll('button');
    const total = slides.length;
    let cur = 0, timer;

    function goTo(i) {
        cur = ((i % total) + total) % total;
        track.style.transform = `translateX(-${cur * 100}%)`;
        dots.forEach((d, idx) => d.classList.toggle('active', idx === cur));
        if (counter) counter.textContent = `${String(cur + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
    const next = () => goTo(cur + 1);
    const prev = () => goTo(cur - 1);
    const start = () => { stop(); timer = setInterval(next, interval); };
    const stop = () => clearInterval(timer);

    prevBtn.addEventListener('click', () => { prev(); start(); });
    nextBtn.addEventListener('click', () => { next(); start(); });
    dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); start(); }));

    // Touch / swipe
    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = sx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        start();
    }, { passive: true });

    // Pause on hover
    track.closest('.carousel, .gallery-slider')?.addEventListener('mouseenter', stop);
    track.closest('.carousel, .gallery-slider')?.addEventListener('mouseleave', start);

    start();
    goTo(0); // init counter
}

/* ----------------------------------------------------------------
   SCROLL ANIMATIONS — Intersection Observer
   ---------------------------------------------------------------- */
function initScrollAnimations() {
    const els = document.querySelectorAll('.anim-scroll');
    if (!els.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 90);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
}

/* ----------------------------------------------------------------
   SCROLL TOP
   ---------------------------------------------------------------- */
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ----------------------------------------------------------------
   COUNTERS
   ---------------------------------------------------------------- */
function initCounters() {
    const nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateNum(entry.target); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.5 });

    nums.forEach(el => obs.observe(el));
}

function animateNum(el) {
    const target = +el.dataset.count;
    const dur = 2200;
    const t0 = performance.now();
    (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4); // ease-out quart
        el.textContent = Math.round(target * ease) + '+';
        if (p < 1) requestAnimationFrame(tick);
    })(t0);
}

/* ----------------------------------------------------------------
   SUBTLE TILT on vehicle & service cards (desktop only)
   ---------------------------------------------------------------- */
function initTiltEffect() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.vehicle-card, .service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `
                perspective(800px)
                rotateY(${x * 4}deg)
                rotateX(${-y * 4}deg)
                translateY(-8px)
                scale(1.02)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ----------------------------------------------------------------
   CONTACT FORM → WhatsApp
   ---------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('fName').value.trim();
        const phone = document.getElementById('fPhone').value.trim();
        const subject = document.getElementById('fSubject').value;
        const msg = document.getElementById('fMsg').value.trim();

        if (!name || !phone || !subject || !msg) { toast('Por favor completa todos los campos', 'warn'); return; }

        const txt = encodeURIComponent(
            `¡Hola HTC! 🚗\n\n*Nombre:* ${name}\n*Teléfono:* ${phone}\n*Asunto:* ${subject}\n*Mensaje:* ${msg}`
        );
        toast('¡Redirigiendo a WhatsApp!', 'ok');
        setTimeout(() => window.open(`https://wa.me/573171798000?text=${txt}`, '_blank'), 900);
        form.reset();
    });
}

function toast(msg, type) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const el = document.createElement('div');
    el.className = 'toast';
    const bg = type === 'ok'
        ? 'linear-gradient(135deg,#27ae60,#2ecc71)'
        : 'linear-gradient(135deg,#e67e22,#f39c12)';
    el.innerHTML = `<i class="fas ${type === 'ok' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i> ${msg}`;
    Object.assign(el.style, {
        position: 'fixed', bottom: '30px', left: '50%',
        transform: 'translateX(-50%) translateY(18px)',
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '14px 28px', background: bg,
        color: '#fff', borderRadius: '8px', fontSize: '.85rem', fontWeight: '600',
        fontFamily: "'Inter',sans-serif", zIndex: 9999,
        boxShadow: '0 10px 40px rgba(0,0,0,.5)',
        opacity: 0, transition: 'all .4s cubic-bezier(.4,0,.2,1)'
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = 1; el.style.transform = 'translateX(-50%) translateY(0)'; });
    setTimeout(() => {
        el.style.opacity = 0;
        el.style.transform = 'translateX(-50%) translateY(18px)';
        setTimeout(() => el.remove(), 450);
    }, 3200);
}
