(function() {
    const loader = document.getElementById('loader');
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const cursorGlow = document.getElementById('cursorGlow');
    const canvas = document.getElementById('particles-canvas');
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    function closeNav() {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
    }

    function animateCounters() {
        document.querySelectorAll('.hero-stat-number[data-count]').forEach((c) => {
            const target = +c.dataset.count;
            const duration = 2000;
            const start = performance.now();
            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const value = Math.round((1 - Math.pow(1 - progress, 3)) * target);
                c.textContent = value + '+';
                if (progress < 1) requestAnimationFrame(update);
                else c.textContent = target + '+';
            }
            requestAnimationFrame(update);
        });
    }

    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                animateCounters();
            }, 800);
        });
        if (document.readyState === 'complete') {
            setTimeout(() => {
                loader.classList.add('hidden');
                animateCounters();
            }, 400);
        }
    }

    if (nav && hamburger && navLinks) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        window.closeNav = closeNav;
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('active')) closeNav();
        });
    } else {
        window.closeNav = closeNav;
    }

    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        function initParticles() {
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / 16000);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 1.6 + 0.3,
                    dx: (Math.random() - 0.5) * 0.35,
                    dy: (Math.random() - 0.5) * 0.35,
                    opacity: Math.random() * 0.4 + 0.2
                });
            }
        }
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;
                if (p.y < -20) p.y = canvas.height + 20;
                if (p.y > canvas.height + 20) p.y = -20;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(184,134,11,${p.opacity})`;
                ctx.fill();
            });
            requestAnimationFrame(drawParticles);
        }
        resizeCanvas();
        initParticles();
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
        drawParticles();
    }

    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach((el) => observer.observe(el));
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const originalText = btn ? btn.textContent : 'Send Message';
            if (btn) {
                btn.textContent = 'Sending...';
                btn.disabled = true;
            }

            try {
                const formData = new FormData(this);
                const payload = Object.fromEntries(formData.entries());
                payload._replyto = payload.email;

                const response = await fetch(this.action, {
                    method: this.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('Submission failed');
                }

                this.reset();
                if (toast) {
                    toast.textContent = '✓ Message sent successfully! I will reply soon.';
                    toast.classList.add('show');
                    setTimeout(() => toast.classList.remove('show'), 4000);
                }
            } catch (error) {
                if (toast) {
                    toast.textContent = '✕ Please try again or email me directly at ainomugishalinda8@gmail.com.';
                    toast.classList.add('show');
                    setTimeout(() => toast.classList.remove('show'), 4000);
                }
            } finally {
                if (btn) {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            }
        });
    }

    // WhatsApp Floating Button Scroll Handler
    const whatsappButton = document.getElementById('whatsappFloat');
    if (whatsappButton) {
        function checkWhatsappVisibility() {
            if (window.scrollY > 100) {
                whatsappButton.classList.add('show');
            } else {
                whatsappButton.classList.remove('show');
            }
        }

        window.addEventListener('scroll', checkWhatsappVisibility, { passive: true });
        setTimeout(checkWhatsappVisibility, 1000);
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = nav ? nav.offsetHeight : 0;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - offset - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Property Image Slider Functionality (Smooth, responsive, cross-device)
    function initImageSliders() {
        const sliders = document.querySelectorAll('.property-slider');
        sliders.forEach((slider) => {
            const track = slider.querySelector('.slider-track');
            const slides = slider.querySelectorAll('.slide');
            const prevBtn = slider.querySelector('.prev-arrow');
            const nextBtn = slider.querySelector('.next-arrow');
            const counterCurrent = slider.querySelector('.current-slide');
            const counterTotal = slider.querySelector('.total-slides');
            const dots = slider.querySelectorAll('.dot');
            const heartBtn = slider.querySelector('.slider-heart-btn');

            if (!track || slides.length === 0) return;

            let currentIndex = 0;
            const totalSlides = slides.length;

            if (counterTotal) {
                counterTotal.textContent = totalSlides;
            }

            function updateSlider(animate = true) {
                track.style.transition = animate ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                if (counterCurrent) {
                    counterCurrent.textContent = currentIndex + 1;
                }
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === currentIndex);
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    updateSlider();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateSlider();
                });
            }

            dots.forEach((dot) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const index = parseInt(dot.getAttribute('data-index'), 10);
                    if (!isNaN(index)) {
                        currentIndex = index;
                        updateSlider();
                    }
                });
            });

            if (heartBtn) {
                heartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    heartBtn.classList.toggle('liked');
                });
            }

            // Universal Smooth Drag & Touch Swipe implementation
            let startX = 0;
            let startY = 0;
            let currentTranslate = 0;
            let isDragging = false;
            let isScrolling = false;
            let draggedDistance = 0;

            function getPositionX(e) {
                return e.type.includes('mouse') ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            }

            function getPositionY(e) {
                return e.type.includes('mouse') ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
            }

            function dragStart(e) {
                if (e.type === 'mousedown' && e.button !== 0) return;
                isDragging = true;
                isScrolling = false;
                startX = getPositionX(e);
                startY = getPositionY(e);
                draggedDistance = 0;
                currentTranslate = -currentIndex * slider.offsetWidth;
                track.style.transition = 'none';
                if (e.type === 'mousedown') {
                    slider.style.cursor = 'grabbing';
                }
            }

            function dragMove(e) {
                if (!isDragging) return;
                const currentX = getPositionX(e);
                const currentY = getPositionY(e);
                const diffX = currentX - startX;
                const diffY = currentY - startY;

                if (!isScrolling) {
                    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 8) {
                        isScrolling = true;
                        isDragging = false;
                        if (e.type === 'mousedown') slider.style.cursor = '';
                        return;
                    }
                }

                if (isScrolling) return;

                if (e.cancelable && Math.abs(diffX) > 5) {
                    e.preventDefault();
                }

                draggedDistance = diffX;
                let moveTranslate = currentTranslate + diffX;

                // Resistance at edges
                if ((currentIndex === 0 && diffX > 0) || (currentIndex === totalSlides - 1 && diffX < 0)) {
                    moveTranslate = currentTranslate + diffX * 0.3;
                }

                track.style.transform = `translateX(${moveTranslate}px)`;
            }

            function dragEnd() {
                if (!isDragging) return;
                isDragging = false;
                slider.style.cursor = '';

                const width = slider.offsetWidth;
                const threshold = width * 0.18; // 18% width threshold for slide trigger

                if (draggedDistance < -threshold && currentIndex < totalSlides - 1) {
                    currentIndex++;
                } else if (draggedDistance > threshold && currentIndex > 0) {
                    currentIndex--;
                }

                updateSlider(true);
            }

            // Touch events
            slider.addEventListener('touchstart', dragStart, { passive: true });
            slider.addEventListener('touchmove', dragMove, { passive: false });
            slider.addEventListener('touchend', dragEnd);

            // Mouse events for desktop drag compatibility
            slider.addEventListener('mousedown', dragStart);
            slider.addEventListener('mousemove', dragMove);
            slider.addEventListener('mouseup', dragEnd);
            slider.addEventListener('mouseleave', () => { if (isDragging) dragEnd(); });
        });
    }

    initImageSliders();

    // Auto-floating Testimonials Slider
    function initTestimonialsAutoScroll() {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;

        // Clone cards to create a smooth seamless infinite loop
        const cards = Array.from(slider.children);
        if (cards.length > 0) {
            cards.forEach((card) => {
                const clone = card.cloneNode(true);
                slider.appendChild(clone);
            });
        }

        let isHovered = false;
        let isMouseDown = false;
        let startX, scrollLeftPos;

        function autoScrollStep() {
            if (!isHovered && !isMouseDown) {
                slider.scrollLeft += 0.75; // Calm, elegant floating speed
                const halfContentWidth = slider.scrollWidth / 2;
                if (slider.scrollLeft >= halfContentWidth) {
                    slider.scrollLeft -= halfContentWidth;
                }
            }
            requestAnimationFrame(autoScrollStep);
        }

        slider.addEventListener('mouseenter', () => { isHovered = true; });
        slider.addEventListener('mouseleave', () => {
            isHovered = false;
            isMouseDown = false;
        });

        slider.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
        slider.addEventListener('touchend', () => { isHovered = false; });

        slider.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeftPos = slider.scrollLeft;
        });

        slider.addEventListener('mouseup', () => { isMouseDown = false; });

        slider.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            slider.scrollLeft = scrollLeftPos - walk;
        });

        requestAnimationFrame(autoScrollStep);
    }

    initTestimonialsAutoScroll();
})();