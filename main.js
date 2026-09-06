/**
 * LÍNEA DEL TIEMPO: LA EVOLUCIÓN DEL AUTOMÓVIL (1769 - 2026)
 * MOTOR DE INTERACCIÓN, ANIMACIONES FLUIDAS Y EXPERIENCIA ENTERPRISE
 * Estudiante: Ricardo Eleazar Reyes Amestica — 1° Medio Tecnología
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       1. SISTEMA DE AUDIO SINTÉTICO (WEB AUDIO API NATIVO)
       ========================================================================== */
    let audioCtx = null;
    let soundEnabled = localStorage.getItem('auto_timeline_sound') !== 'false';

    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const soundStateEl = document.getElementById('sound-state');

    const updateSoundUI = () => {
        if (soundStateEl) soundStateEl.textContent = soundEnabled ? 'ON' : 'OFF';
        if (soundToggleBtn) {
            soundToggleBtn.classList.toggle('muted', !soundEnabled);
            soundToggleBtn.setAttribute('title', soundEnabled ? 'Desactivar efectos de sonido' : 'Activar efectos de sonido');
        }
    };
    updateSoundUI();

    const initAudio = () => {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    };

    const playTone = (freq = 440, type = 'sine', duration = 0.08, gainVal = 0.02) => {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;

            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Silenciar errores de audio en navegadores restrictivos
        }
    };

    const playModalChime = () => {
        if (!soundEnabled) return;
        playTone(523.25, 'sine', 0.15, 0.025); // C5
        setTimeout(() => playTone(659.25, 'sine', 0.18, 0.02), 60); // E5
        setTimeout(() => playTone(783.99, 'sine', 0.22, 0.018), 120); // G5
    };

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('auto_timeline_sound', soundEnabled);
            updateSoundUI();
            if (soundEnabled) playTone(880, 'sine', 0.1, 0.03);
        });
    }

    /* ==========================================================================
       2. CANVAS DE FONDO: CONSTELACIÓN DE PARTÍCULAS INTERACTIVAS (60-120 FPS)
       ========================================================================== */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const isMobile = width < 768;
        const particleCount = isMobile ? 35 : 75;
        const maxDistance = isMobile ? 100 : 140;

        const mouse = { x: null, y: null, radius: 150 };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 1.8 + 0.8;
                this.baseAlpha = Math.random() * 0.4 + 0.2;
            }

            update(scrollDelta = 0) {
                this.x += this.vx;
                this.y += this.vy + scrollDelta * 0.1;

                // Rebote en bordes
                if (this.x < 0) this.x = width;
                else if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                else if (this.y > height) this.y = 0;

                // Interacción con mouse
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 1.2;
                        this.y -= (dy / dist) * force * 1.2;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${this.baseAlpha})`;
                ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        const particles = Array.from({ length: particleCount }, () => new Particle());

        let lastScrollY = window.scrollY;
        let scrollDelta = 0;

        const animateCanvas = () => {
            ctx.clearRect(0, 0, width, height);

            const currentScrollY = window.scrollY;
            scrollDelta = (currentScrollY - lastScrollY) * 0.05;
            lastScrollY = currentScrollY;

            // Dibujar líneas conectoras de constelación
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(scrollDelta);
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateCanvas);
        };

        requestAnimationFrame(animateCanvas);

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }, { passive: true });
    }

    /* ==========================================================================
       3. EFECTO 3D TILT HIPERFLUIDO EN TARJETAS (CARD TILT & SPECULAR SHINE)
       ========================================================================== */
    const cards = document.querySelectorAll('.content-card');

    cards.forEach((card) => {
        const glow = card.querySelector('.card-glow-overlay');
        let bounds;
        let isHovered = false;

        const onMouseEnter = () => {
            bounds = card.getBoundingClientRect();
            isHovered = true;
            playTone(900, 'sine', 0.04, 0.008); // micro-feedback sutil
        };

        const onMouseMove = (e) => {
            if (!isHovered || !bounds) bounds = card.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;

            const xPct = mouseX / bounds.width;
            const yPct = mouseY / bounds.height;

            // Inclinación máxima de 7 grados para máxima elegancia
            const rotateX = (0.5 - yPct) * 10;
            const rotateY = (xPct - 0.5) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

            if (glow) {
                glow.style.background = `radial-gradient(circle at ${xPct * 100}% ${yPct * 100}%, rgba(0, 240, 255, 0.15), transparent 60%)`;
            }
        };

        const onMouseLeave = () => {
            isHovered = false;
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        };

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mousemove', onMouseMove, { passive: true });
        card.addEventListener('mouseleave', onMouseLeave);
    });

    /* ==========================================================================
       4. SCROLL PROGRESS, ESPINAZO LUMINOSO Y REVEAL POR INTERSECTION OBSERVER
       ========================================================================== */
    const timelineItems = Array.from(document.querySelectorAll('.timeline-item'));
    const spineGlow = document.getElementById('timeline-spine-glow');
    const timelineTrack = document.getElementById('timeline-track');
    const progressBar = document.getElementById('reading-progress-bar');
    const backToTopBtn = document.getElementById('back-to-top');

    // Observer para animar entrada fluida de cada hito
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    });

    timelineItems.forEach((item) => revealObserver.observe(item));

    // Scroll Handler optimizado por requestAnimationFrame
    let ticking = false;

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

                // Barra superior de lectura
                if (progressBar) {
                    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
                }

                // Botón volver arriba
                if (backToTopBtn) {
                    backToTopBtn.classList.toggle('visible', scrollTop > 500);
                }

                // Espinazo luminoso central
                if (spineGlow && timelineTrack) {
                    const trackRect = timelineTrack.getBoundingClientRect();
                    const windowMid = window.innerHeight / 2;
                    const trackStart = trackRect.top;
                    const trackHeight = trackRect.height;

                    if (trackStart < windowMid) {
                        const progress = Math.min(1, Math.max(0, (windowMid - trackStart) / trackHeight));
                        spineGlow.style.height = `${progress * 100}%`;
                    } else {
                        spineGlow.style.height = '0%';
                    }
                }

                // Actualizar pip del minimapa activo
                updateMinimapActive();

                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            playTone(600, 'sine', 0.1, 0.02);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       5. MINIMAPA LATERAL TEMPORAL RÁPIDO (DESKTOP)
       ========================================================================== */
    const minimapTrack = document.querySelector('.minimap-track');

    if (minimapTrack && timelineItems.length > 0) {
        timelineItems.forEach((item, index) => {
            const year = item.getAttribute('data-year') || '';
            const title = item.querySelector('.card-title')?.textContent || '';

            const pip = document.createElement('div');
            pip.className = 'minimap-pip';
            pip.dataset.index = index;
            pip.setAttribute('aria-label', `Saltar al año ${year}`);

            const tooltip = document.createElement('span');
            tooltip.className = 'minimap-tooltip';
            tooltip.textContent = `${year} — ${title.substring(0, 24)}...`;

            pip.appendChild(tooltip);

            pip.addEventListener('click', () => {
                playTone(750, 'sine', 0.08, 0.02);
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            minimapTrack.appendChild(pip);
        });
    }

    const updateMinimapActive = () => {
        const pips = document.querySelectorAll('.minimap-pip');
        if (!pips.length) return;

        const windowMid = window.innerHeight / 2;
        let activeIdx = 0;

        timelineItems.forEach((item, i) => {
            const rect = item.getBoundingClientRect();
            if (rect.top <= windowMid) {
                activeIdx = i;
            }
        });

        pips.forEach((pip, i) => {
            pip.classList.toggle('active', i === activeIdx);
        });
    };

    /* ==========================================================================
       6. SISTEMA DE FILTRADO POR CATEGORÍA Y BÚSQUEDA EN VIVO
       ========================================================================== */
    const filterPills = document.querySelectorAll('.filter-pill');
    const searchInput = document.getElementById('timeline-search');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    let currentFilter = 'all';
    let searchQuery = '';

    const applyFilters = () => {
        let visibleCount = 0;

        timelineItems.forEach((item) => {
            const categories = (item.getAttribute('data-categories') || '').split(' ');
            const cardText = item.textContent.toLowerCase();

            const matchesCategory = currentFilter === 'all' || categories.includes(currentFilter);
            const matchesSearch = !searchQuery || cardText.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                item.style.display = '';
                setTimeout(() => item.classList.add('in-view'), 50);
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.remove('in-view');
            }
        });

        // Actualizar espinazo y lectura
        onScroll();
    };

    filterPills.forEach((pill) => {
        pill.addEventListener('click', () => {
            filterPills.forEach((p) => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.getAttribute('data-filter') || 'all';
            playTone(550, 'triangle', 0.06, 0.02);
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            if (clearSearchBtn) {
                clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
            }
            applyFilters();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                clearSearchBtn.style.display = 'none';
                applyFilters();
                searchInput.focus();
            }
        });
    }

    /* ==========================================================================
       7. GESTIÓN DE ERRORES DE IMAGEN Y FALLBACK DE INGENIERÍA
       ========================================================================== */
    const cardImages = document.querySelectorAll('.card-img');

    cardImages.forEach((img) => {
        const fallback = img.parentElement.querySelector('.img-fallback');

        img.addEventListener('load', () => {
            if (fallback) fallback.style.display = 'none';
            img.style.display = 'block';
        });

        img.addEventListener('error', () => {
            if (fallback) fallback.style.display = 'flex';
            img.style.display = 'none';
        });

        // Verificación si ya falló
        if (img.complete && img.naturalWidth === 0) {
            if (fallback) fallback.style.display = 'flex';
            img.style.display = 'none';
        }
    });

    /* ==========================================================================
       8. MODAL CINEMÁTICO ENTERPRISE: TABS, NAVEGACIÓN CONTINUA Y ATAJOS
       ========================================================================== */
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-btn');
    const modPrevBtn = document.getElementById('mod-prev-btn');
    const modNextBtn = document.getElementById('mod-next-btn');

    const modCounterText = document.getElementById('mod-counter-text');
    const modImg = document.getElementById('mod-img');
    const modImgFallback = document.getElementById('mod-img-fallback');
    const modFallbackName = document.getElementById('mod-fallback-name');
    const modFallbackDesc = document.getElementById('mod-fallback-desc');
    const modMetaYear = document.getElementById('mod-meta-year');
    const modMetaCategory = document.getElementById('mod-meta-category');
    const modTitle = document.getElementById('mod-title');
    const modDesc = document.getElementById('mod-desc');
    const modFactor = document.getElementById('mod-factor');
    const modSpecsContent = document.getElementById('mod-specs-content');
    const modImpactContent = document.getElementById('mod-impact-content');

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    let currentModalIndex = 0;

    // Conmutación de Pestañas del Modal
    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            tabButtons.forEach((b) => b.classList.remove('active'));
            tabContents.forEach((c) => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');

            playTone(700, 'sine', 0.05, 0.015);
        });
    });

    const resetModalTabs = () => {
        tabButtons.forEach((b, i) => b.classList.toggle('active', i === 0));
        tabContents.forEach((c, i) => c.classList.toggle('active', i === 0));
    };

    const populateModalByIndex = (index) => {
        if (index < 0) index = timelineItems.length - 1;
        if (index >= timelineItems.length) index = 0;
        currentModalIndex = index;

        const item = timelineItems[index];
        if (!item) return;

        const year = item.getAttribute('data-year') || '';
        const categoryBadge = item.querySelector('.category-badge')?.textContent || '';
        const title = item.querySelector('.card-title')?.textContent || '';
        const rawImg = item.querySelector('.card-img');
        const imgSrc = rawImg?.getAttribute('src') || `${index + 1}.jpg`;
        const imgSrc = rawImg?.getAttribute('src') || '';
        const desc = item.querySelector('.desc-text')?.innerHTML || '';
        const factor = item.querySelector('.factor-box')?.innerHTML || '';

        const extraSpec = item.querySelector('.tab-data-spec')?.innerHTML || '<p>Datos técnicos en procesamiento.</p>';
        const extraImpact = item.querySelector('.tab-data-impact')?.innerHTML || '<p>Impacto histórico en verificación.</p>';

        // Poblar contenido
        if (modCounterText) modCounterText.textContent = `Hito ${index + 1} de ${timelineItems.length}`;
        if (modMetaYear) modMetaYear.textContent = year;
        if (modMetaCategory) modMetaCategory.textContent = categoryBadge;
        if (modTitle) modTitle.textContent = `${year} — ${title}`;
        if (modDesc) modDesc.innerHTML = desc;
        if (modFactor) modFactor.innerHTML = factor;
        if (modSpecsContent) modSpecsContent.innerHTML = extraSpec;
        if (modImpactContent) modImpactContent.innerHTML = extraImpact;

        // Gestión de imagen del modal
        if (modImg) {
            modImg.src = imgSrc;
            modImg.alt = title;

            modImg.onload = () => {
                modImg.style.display = 'block';
                if (modImgFallback) modImgFallback.style.display = 'none';
            };

            modImg.onerror = () => {
                modImg.style.display = 'none';
                if (modImgFallback) {
                    modImgFallback.style.display = 'flex';
                    if (modFallbackName) modFallbackName.textContent = `Archivo: ${imgSrc}`;
                    if (modFallbackDesc) modFallbackDesc.textContent = `${year} — ${title}`;
                }
            };

            // Comprobación si la imagen ya falló previamente
            if (rawImg && rawImg.naturalWidth === 0 && rawImg.complete) {
                modImg.style.display = 'none';
                if (modImgFallback) {
                    modImgFallback.style.display = 'flex';
                    if (modFallbackName) modFallbackName.textContent = `Archivo: ${imgSrc}`;
                    if (modFallbackDesc) modFallbackDesc.textContent = `${year} — ${title}`;
                }
            }
        }
    };

    const openModal = (index) => {
        resetModalTabs();
        populateModalByIndex(index);
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        playModalChime();
    };

    const closeModal = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        playTone(380, 'sine', 0.08, 0.02);
    };

    // Asignar click en cada tarjeta
    timelineItems.forEach((item, index) => {
        const card = item.querySelector('.content-card');
        if (card) {
            card.addEventListener('click', () => openModal(index));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(index);
                }
            });
        }
    });

    // Navegación anterior / siguiente dentro del modal
    if (modPrevBtn) {
        modPrevBtn.addEventListener('click', () => {
            playTone(480, 'sine', 0.06, 0.02);
            populateModalByIndex(currentModalIndex - 1);
        });
    }

    if (modNextBtn) {
        modNextBtn.addEventListener('click', () => {
            playTone(540, 'sine', 0.06, 0.02);
            populateModalByIndex(currentModalIndex + 1);
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Navegación con teclado (Accesibilidad Integral)
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            populateModalByIndex(currentModalIndex - 1);
            playTone(480, 'sine', 0.05, 0.02);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            populateModalByIndex(currentModalIndex + 1);
            playTone(540, 'sine', 0.05, 0.02);
        }
    });
});
