document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-btn');
    
    const modImg = document.getElementById('mod-img');
    const modTitle = document.getElementById('mod-title');
    const modDesc = document.getElementById('mod-desc');
    const modFactor = document.getElementById('mod-factor');
    const modExtra = document.getElementById('mod-extra');

    const cards = document.querySelectorAll('.content-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Lectura de datos
            const year = card.querySelector('.year-tag')?.outerHTML || '';
            const title = card.querySelector('.card-title')?.textContent || '';
            const imgSrc = card.querySelector('.card-img')?.src || '';
            const desc = card.querySelector('.desc-text')?.innerHTML || '';
            const factor = card.querySelector('.factor-box')?.innerHTML || '';
            const extra = card.querySelector('.extra-info-hidden')?.innerHTML || '';

            // Inyección al modal
            modTitle.innerHTML = `${year} ${title}`;
            modImg.src = imgSrc;
            modDesc.innerHTML = desc;
            modFactor.innerHTML = factor;
            modExtra.innerHTML = extra;

            // Apertura y bloqueo de scroll base
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
