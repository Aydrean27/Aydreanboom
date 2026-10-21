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

function filterCategory(categoria) {
    const items = document.querySelectorAll('.runway-item');
    document.querySelectorAll('.category-tabs .tab-btn').forEach(button => {
        button.classList.toggle('active', button.getAttribute('onclick')?.includes(`'${categoria}'`));
    });
    items.forEach(item => {
        item.style.display = categoria === 'all' || item.dataset.category === categoria ? '' : 'none';
    });
}
