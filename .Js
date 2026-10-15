let ultimoScroll = 0;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
    const scrollActual = window.scrollY;;;

    // Si bajas más de 50 píxeles, el menú se ESCONDE hacia arriba
    if (scrollActual > ultimoScroll && scrollActual > 50) {
        header.classList.add('oculto');
    } 
    // Si subes con el mouse, el menú APARECE de nuevo
    else {
        header.classList.remove('oculto');
    }
    
    ultimoScroll = scrollActual;
});