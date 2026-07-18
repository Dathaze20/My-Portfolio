document.addEventListener('DOMContentLoaded', function () {
    try {
        // Page loader
        const pageLoader = document.querySelector('.page-loader');
        const hideLoader = () => {
            if (!pageLoader) return;
            pageLoader.classList.add('fade-out');
            setTimeout(() => { pageLoader.style.display = 'none'; }, 500);
        };
        setTimeout(hideLoader, 300);
        window.addEventListener('load', hideLoader);

        // Footer year
        const footerYear = document.getElementById('footerYear');
        if (footerYear) footerYear.textContent = new Date().getFullYear();

        // Core UI elements
        const navToggler = document.querySelector('.nav-toggler');
        const navLinks = document.querySelector('.nav-links');
        const navLinksList = document.querySelectorAll('.nav-links a');
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        const body = document.body;
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');

        // Theme: dark by default, 'light-mode' class opts into light theme
        function updateThemeIcon(isLight) {
            if (!darkModeToggle) return;
            const icon = darkModeToggle.querySelector('i');
            if (icon) icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
            darkModeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
        }
        updateThemeIcon(body.classList.contains('light-mode'));

        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function () {
                body.classList.toggle('light-mode');
                const isLight = body.classList.contains('light-mode');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
                updateThemeIcon(isLight);
            });
            darkModeToggle.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }

        // Mobile navigation toggle
        if (navToggler && navLinks) {
            navToggler.addEventListener('click', function () {
                const isExpanded = navLinks.classList.contains('open');
                navLinks.classList.toggle('open');
                navToggler.classList.toggle('open');
                navToggler.setAttribute('aria-expanded', String(!isExpanded));
            });
        }

        // Smooth scrolling with header offset
        navLinksList.forEach(link => {
            link.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                e.preventDefault();

                navLinksList.forEach(navLink => {
                    navLink.classList.remove('active');
                    navLink.setAttribute('aria-current', 'false');
                });
                this.classList.add('active');

                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                if (navLinks) navLinks.classList.remove('open');
                if (navToggler) {
                    navToggler.classList.remove('open');
                    navToggler.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Highlight active section in navigation
        function highlightActiveSection() {
            const sections = document.querySelectorAll('main section[id]');
            let current = '';
            const scrollPosition = window.scrollY + 200;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            navLinksList.forEach(link => {
                link.classList.remove('active');
                link.setAttribute('aria-current', 'false');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        }

        // Scroll-to-top button + active nav highlight
        window.addEventListener('scroll', () => {
            if (scrollToTopBtn) {
                if (window.scrollY > 300) {
                    scrollToTopBtn.style.display = 'block';
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                    setTimeout(() => {
                        if (!scrollToTopBtn.classList.contains('show')) {
                            scrollToTopBtn.style.display = 'none';
                        }
                    }, 300);
                }
            }
            highlightActiveSection();
        }, { passive: true });

        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Reveal-on-scroll for sections
        const scrollElements = document.querySelectorAll('section');
        scrollElements.forEach(el => el.classList.add('scroll-element'));
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scrolled');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            scrollElements.forEach(el => observer.observe(el));
        } else {
            scrollElements.forEach(el => el.classList.add('scrolled'));
        }

        // Project filter
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = (card.getAttribute('data-category') || '').split(' ');
                    const match = filterValue === 'all' || categories.includes(filterValue);
                    if (match) {
                        card.style.display = '';
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.92)';
                        setTimeout(() => { card.style.display = 'none'; }, 250);
                    }
                });
            });
        });

        // Initialize active nav state
        highlightActiveSection();

        // ARIA landmarks
        document.querySelector('main')?.setAttribute('role', 'main');
        document.querySelector('footer')?.setAttribute('role', 'contentinfo');
        document.querySelector('header')?.setAttribute('role', 'banner');

    } catch (error) {
        console.error('Error loading portfolio scripts:', error);
    }
});
