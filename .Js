let ultimoScroll = 0;
const header = document.querySelector('.site-header');

if (header) {
    window.addEventListener('scroll', () => {
        const scrollActual = window.scrollY;
        if (scrollActual > ultimoScroll && scrollActual > 50) {
            header.classList.add('oculto');
        } else {
            header.classList.remove('oculto');
        }
        ultimoScroll = scrollActual;
    });
}

const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
let slideActual = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
let temporizadorCarrusel;

function mostrarSlide(indice) {
    if (!slides.length) return;
    slideActual = (indice + slides.length) % slides.length;
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === slideActual);
        slide.setAttribute('aria-hidden', i === slideActual ? 'false' : 'true');
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === slideActual);
        if (i === slideActual) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
    });
}

function currentSlide(indice) {
    mostrarSlide(indice);
    iniciarCarrusel();
}

function changeSlide(direccion) {
    mostrarSlide(slideActual + direccion);
    iniciarCarrusel();
}

function iniciarCarrusel() {
    window.clearInterval(temporizadorCarrusel);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        temporizadorCarrusel = window.setInterval(() => mostrarSlide(slideActual + 1), 5000);
    }
}

mostrarSlide(slideActual);
iniciarCarrusel();

// Carrusel infinito y suave con una copia de las tarjetas para cerrar el ciclo sin saltos.
(() => {
    const gallery = document.querySelector('#galleryContainer');
    if (!gallery) return;

    const originals = Array.from(gallery.querySelectorAll('.runway-item'));
    const clones = originals.map(item => {
        const clone = item.cloneNode(true);
        clone.dataset.carouselClone = 'true';
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a, button').forEach(control => control.setAttribute('tabindex', '-1'));
        gallery.appendChild(clone);
        return clone;
    });

    let direction = 1;
    let speed = 0.55;
    let targetDirection = 1;
    let previousX = null;
    let lastTime = 0;
    let loopWidth = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isVisible = item => item.style.display !== 'none';

    function updateLoopWidth() {
        const firstClone = clones.find(isVisible);
        if (firstClone) loopWidth = firstClone.offsetLeft - gallery.firstElementChild.offsetLeft;
    }

    function updateCenter() {
        const centerX = gallery.getBoundingClientRect().left + gallery.clientWidth / 2;
        const items = Array.from(gallery.querySelectorAll('.runway-item')).filter(isVisible);
        let nearest = null;
        let nearestDistance = Infinity;
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const distance = Math.abs(rect.left + rect.width / 2 - centerX);
            if (distance < nearestDistance) { nearest = item; nearestDistance = distance; }
        });
        items.forEach(item => item.classList.toggle('active-center', item === nearest));
    }

    function animate(time) {
        const delta = lastTime ? Math.min((time - lastTime) / 16.67, 2) : 1;
        if (!reduceMotion.matches) {
            direction += (targetDirection - direction) * 0.035;
            gallery.scrollLeft += direction * speed * delta;
            if (loopWidth > 0 && gallery.scrollLeft >= loopWidth) gallery.scrollLeft -= loopWidth;
            else if (loopWidth > 0 && gallery.scrollLeft < 0) gallery.scrollLeft += loopWidth;
            updateCenter();
        }
        lastTime = time;
        requestAnimationFrame(animate);
    }

    gallery.addEventListener('pointermove', event => {
        if (previousX !== null && Math.abs(event.clientX - previousX) > 1) {
            targetDirection = event.clientX > previousX ? 1 : -1;
        }
        previousX = event.clientX;
    });
    gallery.addEventListener('pointerleave', () => { previousX = null; targetDirection = 1; });
    gallery.addEventListener('wheel', event => {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) targetDirection = event.deltaX > 0 ? 1 : -1;
    }, { passive: true });
    window.addEventListener('resize', updateLoopWidth);
    updateLoopWidth();
    requestAnimationFrame(animate);
})();function filterCategory(categoria) {
    const items = document.querySelectorAll('.runway-item');
    document.querySelectorAll('.category-tabs .tab-btn').forEach(button => {
        button.classList.toggle('active', button.getAttribute('onclick')?.includes(`'${categoria}'`));
    });
    items.forEach(item => {
        item.style.display = categoria === 'all' || item.dataset.category === categoria ? '' : 'none';
    });
}

// Selector de idioma persistente para la navegación y las llamadas principales.
(() => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let actions = header.querySelector('.header-actions');
    if (!actions) {
        actions = document.createElement('div');
        actions.className = 'header-actions';
        header.appendChild(actions);
    }
    const label = document.createElement('label');
    label.className = 'language-control';
    label.innerHTML = '<span aria-hidden="true">◎</span><span class="language-label">ES</span><select aria-label="Cambiar idioma"><option value="es">ES</option><option value="en">EN</option></select>';
    actions.appendChild(label);
    const translations = {
        'Inicio': 'Home', 'Diseña': 'Design', 'Diseño': 'Design', 'Misión & Visión': 'Mission & Vision',
        'Marketplace': 'Marketplace', 'Blog': 'Journal', 'Explorar Marketplace': 'Explore the marketplace',
        'Descubre el upcycling': 'Discover upcycling', 'Visita el marketplace': 'Visit the marketplace',
        'Conoce el diseño': 'Discover the design', 'Historias REEVA': 'REEVA stories',
        'Diseña prendas que cuentan historias': 'Design garments that tell stories',
        'Marketplace REEVA': 'REEVA marketplace'
    };
    const nodes = Array.from(document.querySelectorAll('.main-nav a, .hero-content .sub-title, .hero-content h2, .hero-content p, .hero-buttons a, main > .sub-title, main > h2, .section-heading-editorial'));
    const originals = new Map(nodes.map(node => [node, node.textContent.trim()]));
    const select = label.querySelector('select');
    function setLanguage(language) {
        document.documentElement.lang = language;
        nodes.forEach(node => {
            const spanish = originals.get(node);
            node.textContent = language === 'en' ? (translations[spanish] || spanish) : spanish;
        });
        label.querySelector('.language-label').textContent = language.toUpperCase();
        localStorage.setItem('reeva-language', language);
    }
    select.value = localStorage.getItem('reeva-language') || 'es';
    select.addEventListener('change', () => setLanguage(select.value));
    setLanguage(select.value);
})();

// Entrada progresiva de las tarjetas, respetando la preferencia de movimiento reducido.
(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = document.querySelectorAll('.story-card, .subpage-card, .environmental-metrics article, .partners-grid article');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    cards.forEach(card => { card.classList.add('reveal-on-scroll'); observer.observe(card); });
})();
