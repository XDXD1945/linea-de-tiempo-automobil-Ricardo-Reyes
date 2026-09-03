document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM del modal
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-btn');
    
    // Referencias a los campos vacíos del modal
    const modImg = document.getElementById('mod-img');
    const modTitle = document.getElementById('mod-title');
    const modDesc = document.getElementById('mod-desc');
    const modFactor = document.getElementById('mod-factor');
    const modExtra = document.getElementById('mod-extra');

    // Seleccionamos todas las tarjetas
    const cards = document.querySelectorAll('.content-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // 1. Extraemos los datos de la tarjeta de forma segura
            const year = card.querySelector('.year-tag')?.textContent || '';
            const title = card.querySelector('.card-title')?.textContent || '';
            const imgSrc = card.querySelector('.card-img')?.src || '';
            const desc = card.querySelector('.desc-text')?.innerHTML || '';
            const factor = card.querySelector('.factor-box')?.innerHTML || '';
            const extra = card.querySelector('.extra-info-hidden')?.innerHTML || '';

            // 2. Inyectamos los datos en el Modal
            modTitle.innerHTML = `<span class="year-tag">${year}</span> ${title}`;
            modImg.src = imgSrc;
            modDesc.innerHTML = desc;
            modFactor.innerHTML = factor;
            modExtra.innerHTML = extra;

            // 3. Mostramos el modal con el efecto Zoom
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Evita scrollear el fondo
        });
    });

    // Lógica para cerrar
    const closeModal = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaura el scroll
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        // Cierra si se hace clic fuera del recuadro
        if (e.target === overlay) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
