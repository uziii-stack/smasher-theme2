/**
 * @file index.js
 * @description Main client-side logic for Smashers Cricket website.
 * Handles mobile navbar toggling, accessibility, and navigation state.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navbar Logic ---
    const toggleBtn = document.querySelector('.navbar__mobile-toggle');
    const navbar = document.querySelector('.navbar');

    if (toggleBtn && navbar) {
        toggleBtn.addEventListener('click', () => {
            const isOpening = !navbar.classList.contains('is-open');
            navbar.classList.toggle('is-open');
            toggleBtn.setAttribute('aria-expanded', isOpening);
            document.body.style.overflow = isOpening ? 'hidden' : '';
        });
    }

    // --- Sticky Navbar Refinement ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('is-sticky');
        } else {
            navbar.classList.remove('is-sticky');
        }
    });

    // --- Handle Mobile Submenus ---
    const dropdownLinks = document.querySelectorAll('.navbar__link--dropdown');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 1350) {
                e.preventDefault();
                const item = link.closest('.navbar__item');
                item.classList.toggle('is-mobile-expanded');
            }
        });
    });

    // --- Hero Slider Logic ---
    const slides = document.querySelectorAll('.hero-slide');
    const navBars = document.querySelectorAll('.hero-nav-bar');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        navBars.forEach(b => b.classList.remove('active'));
        if (slides[index]) slides[index].classList.add('active');
        if (navBars[index]) navBars[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    };

    const startAutoSlide = () => {
        clearInterval(slideInterval);
        if (slides.length > 0) slideInterval = setInterval(nextSlide, 5000);
    };

    navBars.forEach((bar, index) => {
        bar.addEventListener('click', () => {
            showSlide(index);
            startAutoSlide();
        });
    });

    if (slides.length > 0) startAutoSlide();

    // --- Infinite Categories Slider ---
    const track = document.querySelector('.categories__track');
    const cards = document.querySelectorAll('.categories__card');

    if (track && cards.length > 0) {
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });

        let scrollAmount = 0;
        const speed = 1;

        function step() {
            scrollAmount -= speed;
            const firstCardWidth = cards[0].offsetWidth + 30;
            const totalWidth = firstCardWidth * cards.length;
            if (Math.abs(scrollAmount) >= totalWidth) scrollAmount = 0;
            track.style.transform = `translateX(${scrollAmount}px)`;
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // --- Best Sellers Slider Logic ---
    const bsTrack = document.querySelector('.best-sellers__track');
    const bsCards = document.querySelectorAll('.best-sellers__track .product-card');
    let bsCurrentIndex = 0;
    let bsInterval;

    if (bsTrack && bsCards.length > 0) {
        const updateBsSlider = () => {
            const cardStyle = window.getComputedStyle(bsCards[0]);
            const cardWidth = bsCards[0].offsetWidth + parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
            const visibleCards = Math.round(bsTrack.offsetWidth / cardWidth);
            const maxIndex = Math.max(0, bsCards.length - visibleCards);

            if (bsCurrentIndex > maxIndex) bsCurrentIndex = 0;
            bsTrack.style.transform = `translateX(-${bsCurrentIndex * cardWidth}px)`;
        };

        const nextBsSlide = () => {
            bsCurrentIndex++;
            updateBsSlider();
        };

        const startBsAutoSlide = () => {
            clearInterval(bsInterval);
            bsInterval = setInterval(nextBsSlide, 5000);
        };

        startBsAutoSlide();
        window.addEventListener('resize', updateBsSlider);

        const bsTabs = document.querySelectorAll('.best-sellers__tab');
        bsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                bsTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    // --- Fearless Section Slider ---
    const fearlessTrack = document.querySelector('.fearless__track');
    const fearlessCards = document.querySelectorAll('.fearless-card');
    const prevBtns = document.querySelectorAll('.fearless__btn--prev');
    const nextBtns = document.querySelectorAll('.fearless__btn--next');
    let fearlessIndex = 0;

    if (fearlessTrack && fearlessCards.length > 0) {
        const updateFearlessSlider = () => {
            const gap = parseInt(window.getComputedStyle(fearlessTrack).gap) || 0;
            const cardWidth = fearlessCards[0].offsetWidth + gap;
            const containerWidth = fearlessTrack.parentElement.offsetWidth;
            const visibleCards = Math.floor(containerWidth / cardWidth);
            const maxIndex = Math.max(0, fearlessCards.length - visibleCards);

            if (fearlessIndex > maxIndex) fearlessIndex = maxIndex;
            if (fearlessIndex < 0) fearlessIndex = 0;

            fearlessTrack.style.transform = `translateX(-${fearlessIndex * cardWidth}px)`;

            // Toggle button states
            prevBtns.forEach(btn => btn.style.opacity = fearlessIndex === 0 ? '0.3' : '1');
            nextBtns.forEach(btn => btn.style.opacity = fearlessIndex >= maxIndex ? '0.3' : '1');
        };

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const gap = parseInt(window.getComputedStyle(fearlessTrack).gap) || 0;
                const containerWidth = fearlessTrack.parentElement.offsetWidth;
                const cardWidth = fearlessCards[0].offsetWidth + gap;
                const visibleCards = Math.floor(containerWidth / cardWidth);
                const maxIndex = Math.max(0, fearlessCards.length - visibleCards);

                if (fearlessIndex < maxIndex) {
                    fearlessIndex++;
                    updateFearlessSlider();
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (fearlessIndex > 0) {
                    fearlessIndex--;
                    updateFearlessSlider();
                }
            });
        });

        window.addEventListener('resize', updateFearlessSlider);
        updateFearlessSlider(); // Initial call
    }

    // --- Products For You Slider ---
    const pfyTrack = document.querySelector('.pfy__track');
    const pfyCards = document.querySelectorAll('.pfy-card');
    const pfyPrevBtn = document.querySelector('.pfy__btn--prev');
    const pfyNextBtn = document.querySelector('.pfy__btn--next');
    let pfyIndex = 0;

    if (pfyTrack && pfyCards.length > 0) {
        const updatePfySlider = () => {
            const gap = parseInt(window.getComputedStyle(pfyTrack).gap) || 0;
            const cardWidth = pfyCards[0].offsetWidth + gap;
            const containerWidth = pfyTrack.parentElement.offsetWidth;
            const visibleCards = Math.floor((containerWidth + gap) / cardWidth);
            const maxIndex = Math.max(0, pfyCards.length - visibleCards);

            if (pfyIndex > maxIndex) pfyIndex = maxIndex;
            if (pfyIndex < 0) pfyIndex = 0;

            pfyTrack.style.transform = `translateX(-${pfyIndex * cardWidth}px)`;

            // Toggle button states
            if (pfyPrevBtn) pfyPrevBtn.style.opacity = pfyIndex === 0 ? '0.3' : '1';
            if (pfyNextBtn) pfyNextBtn.style.opacity = pfyIndex >= maxIndex ? '0.3' : '1';
        };

        if (pfyNextBtn) {
            pfyNextBtn.addEventListener('click', () => {
                const gap = parseInt(window.getComputedStyle(pfyTrack).gap) || 0;
                const containerWidth = pfyTrack.parentElement.offsetWidth;
                const cardWidth = pfyCards[0].offsetWidth + gap;
                const visibleCards = Math.floor((containerWidth + gap) / cardWidth);
                const maxIndex = Math.max(0, pfyCards.length - visibleCards);

                if (pfyIndex < maxIndex) {
                    pfyIndex++;
                    updatePfySlider();
                }
            });
        }

        if (pfyPrevBtn) {
            pfyPrevBtn.addEventListener('click', () => {
                if (pfyIndex > 0) {
                    pfyIndex--;
                    updatePfySlider();
                }
            });
        }

        window.addEventListener('resize', updatePfySlider);
        updatePfySlider();
    }
});
