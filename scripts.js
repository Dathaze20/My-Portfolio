document.addEventListener('DOMContentLoaded', function() {
    try {
        // Debug statement to ensure script loads (No Change)
        console.log('Portfolio scripts loaded successfully');

        // Handle intro photo loading (No Change)
        const introPhoto = document.querySelector('.intro-photo');
        if (introPhoto) {
            const img = new Image();
            img.onload = function() {
                introPhoto.src = this.src;
                introPhoto.style.opacity = '1';
            };
            img.src = introPhoto.getAttribute('src');
        }

        // Handle blog image loading
        const blogImg = document.querySelector('.blog-img img');
        if (blogImg) {
            const img = new Image();
            img.onload = function() {
                blogImg.src = this.src;
                blogImg.classList.add('loaded');
            };
            img.src = blogImg.getAttribute('src');
        }

        // Page Loader (No Change)
        const pageLoader = document.querySelector('.page-loader');
        window.addEventListener('load', function() {
            console.log('Page fully loaded');
            document.body.classList.add('page-loaded');
            setTimeout(() => {
                if (pageLoader) {
                    pageLoader.style.display = 'none';
                    console.log('Page loader hidden');
                }
            }, 500);
        });

        // Core UI elements (No Change)
        const navToggler = document.querySelector('.nav-toggler');
        const navLinks = document.querySelector('.nav-links');
        const navLinksList = document.querySelectorAll('.nav-links a');
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        const body = document.body;
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        const formStatus = document.getElementById('formStatus');
        const contactForm = document.getElementById('contactForm');

        // Check for saved theme preference (No Change)
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
            updateDarkModeIcon(true);
            darkModeToggle.setAttribute('aria-checked', 'true');
        }

        // Mobile Navigation Toggle with ARIA attributes (No Change)
        if (navToggler) {
            navToggler.addEventListener('click', function() {
                const isExpanded = navLinks.classList.contains('open');
                navLinks.classList.toggle('open');
                navToggler.classList.toggle('open');
                navToggler.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    animateMenuItems();
                }
            });
        }

        // Animate mobile menu items when menu opens (No Change)
        function animateMenuItems() {
            const menuItems = document.querySelectorAll('.nav-links li');
            menuItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
            });
        }

        // Smooth Scrolling with offset for header (Slight Improvement - Optional Chaining)
        navLinksList.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    navLinksList.forEach(navLink => {
                        navLink.classList.remove('active');
                        navLink.setAttribute('aria-current', 'false');
                    });
                    this.classList.add('active');
                    // Slight Improvement: Use optional chaining for header offset
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close the mobile menu after clicking (No Change)
                    navLinks.classList.remove('open');
                    if (navToggler) {
                        navToggler.classList.remove('open');
                        navToggler.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });

        // Dark Mode Toggle with animation and accessibility (No Change)
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                console.log('Dark mode toggle clicked');
                body.classList.toggle('dark-mode');
                const isDarkMode = body.classList.contains('dark-mode');
                darkModeToggle.setAttribute('aria-checked', isDarkMode);
                localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
                updateDarkModeIcon(isDarkMode);
                applyDarkModeTransition();
            });

            // Keyboard support for dark mode toggle (No Change)
            darkModeToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }

        // Update Dark Mode Icon Function (No Change)
        function updateDarkModeIcon(isDarkMode) {
            if (!darkModeToggle) return;
            const darkModeIcon = darkModeToggle.querySelector('i');
            if (!darkModeIcon) return;
            darkModeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            darkModeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
        }

        // Apply Dark Mode Transition Function (No Change)
        function applyDarkModeTransition() {
            const elementsToTransition = document.querySelectorAll('.project-card, .testimonial-card, .blog-post, .skill-item');
            elementsToTransition.forEach(element => {
                element.style.transition = 'background-color 0.5s ease, color 0.5s ease, box-shadow 0.5s ease';
            });
        }

        // Image lazy loading optimization (No Change)
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });

        // Use Intersection Observer for scroll animations - better performance (No Change)
        const scrollElements = document.querySelectorAll('.scroll-element');
        if (scrollElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scrolled');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            scrollElements.forEach(el => {
                observer.observe(el);
            });
        }

        // Scroll-to-Top Button with accessibility (No Change)
        if (scrollToTopBtn) {
            window.addEventListener('scroll', () => {
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
                highlightActiveSection();
            });

            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Highlight active section in navigation (No Change)
        function highlightActiveSection() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');
            let current = '';
            const scrollPosition = window.scrollY + 200;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.setAttribute('aria-current', 'false');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        }

        // Enhanced Form Validation with visual feedback and accessibility (No Change)
        if (contactForm) {
            contactForm.setAttribute('novalidate', true);
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = contactForm.querySelector('input[name="name"]');
                const email = contactForm.querySelector('input[name="email"]');
                const message = contactForm.querySelector('textarea[name="message"]');
                if (formStatus) {
                    formStatus.className = 'form-status';
                    formStatus.style.display = 'none';
                }
                contactForm.querySelectorAll('.form-error').forEach(error => error.remove());
                let isValid = true;
                if (!name.value.trim()) {
                    showInputError(name, 'Please enter your name');
                    isValid = false;
                } else {
                    removeInputError(name);
                }
                if (!email.value.trim()) {
                    showInputError(email, 'Please enter your email');
                    isValid = false;
                } else if (!isValidEmail(email.value)) {
                    showInputError(email, 'Please enter a valid email address');
                    isValid = false;
                } else {
                    removeInputError(email);
                }
                if (!message.value.trim()) {
                    showInputError(message, 'Please enter your message');
                    isValid = false;
                } else {
                    removeInputError(message);
                }
                if (!isValid) {
                    showFormError('Please correct the errors above');
                    return;
                }
                const submitButton = contactForm.querySelector('.btn-submit');
                if (submitButton) {
                    const originalBtnText = submitButton.innerHTML;
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    submitButton.setAttribute('aria-busy', 'true');
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalBtnText;
                        submitButton.setAttribute('aria-busy', 'false');
                        showFormSuccess('Thank you! Your message has been sent successfully.');
                        contactForm.reset();
                        setTimeout(() => {
                            if (formStatus) {
                                formStatus.style.display = 'none';
                            }
                        }, 5000);
                    }, 1500);
                }
            });
        }

        // Show form error message (No Change)
        function showFormError(message) {
            if (!formStatus) return;
            formStatus.textContent = message;
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            formStatus.setAttribute('role', 'alert');
        }

        // Show form success message (No Change)
        function showFormSuccess(message) {
            if (!formStatus) return;
            formStatus.textContent = message;
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';
            formStatus.setAttribute('role', 'status');
        }

        // Show input-specific error message (No Change)
        function showInputError(input, message) {
            input.classList.add('invalid');
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.textContent = message;
            errorElement.setAttribute('role', 'alert');
            const parent = input.parentNode.parentNode;
            if (!parent.querySelector('.form-error')) {
                parent.appendChild(errorElement);
            }
            input.setAttribute('aria-invalid', 'true');
            input.addEventListener('input', function onInput() {
                removeInputError(input);
                input.removeEventListener('input', onInput);
            });
        }

        // Remove input-specific error (No Change)
        function removeInputError(input) {
            input.classList.remove('invalid');
            input.setAttribute('aria-invalid', 'false');
            const parent = input.parentNode.parentNode;
            const error = parent.querySelector('.form-error');
            if (error) {
                parent.removeChild(error);
            }
        }

        // Validate email format (No Change)
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Typographic animation for the hero section (No Change)
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.innerHTML = '';
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i];
                span.style.animationDelay = `${i * 0.1}s`;
                span.className = 'char-animate';
                heroTitle.appendChild(span);
            }
        }

        // Performance optimization - use requestAnimationFrame for animations (No Change)
        let lastKnownScrollY = window.scrollY;
        let ticking = false;

        function onScroll() {
            lastKnownScrollY = window.scrollY;
            requestTick();
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(update);
            }
            ticking = true;
        }

        // Update function for scroll animations (No Change)
        function update() {
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.querySelectorAll('.particles .particle').forEach((element, index) => {
                    element.style.transform = `translateY(${lastKnownScrollY * (0.1 + index * 0.05)}px)`;
                });
            }
            if (scrollToTopBtn) {
                if (lastKnownScrollY > 300) {
                    scrollToTopBtn.style.display = 'block';
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                    if (!scrollToTopBtn.classList.contains('show')) {
                        scrollToTopBtn.style.display = 'none';
                    }
                }
            }
            ticking = false;
        }
        window.addEventListener('scroll', onScroll, { passive: true });

        // Projects carousel touch swipe support (No Change)
        const projectsCarousel = document.querySelector('.projects-carousel');
        if (projectsCarousel) {
            let startX, endX;
            const threshold = 50;
            projectsCarousel.addEventListener('touchstart', function(e) {
                startX = e.changedTouches[0].screenX;
            }, { passive: true });
            projectsCarousel.addEventListener('touchend', function(e) {
                endX = e.changedTouches[0].screenX;
                const swipeDistance = startX - endX;
                if (Math.abs(swipeDistance) >= threshold) {
                    projectsCarousel.scrollBy({
                        left: swipeDistance,
                        behavior: 'smooth'
                    });
                }
            }, { passive: true });
        }

        // Initialize the active section in navigation (No Change)
        highlightActiveSection();

        // For demonstration - make sure all sections are visible (No Change)
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('scroll-element');
            console.log(`Section ${section.id} initialized with height: ${section.offsetHeight}`);
        });

        // Check if any sections are very close to each other or overlapping (Correction - Selector)
        function checkSectionPositions() {
            document.querySelectorAll('section').forEach((section, index) => {
                if (index > 0) {
                    // Correction: Select previous section correctly using querySelectorAll
                    const prevSection = document.querySelectorAll('section')[index - 1];
                    if (prevSection) { // Add check if prevSection exists
                        const gap = section.offsetTop - (prevSection.offsetTop + prevSection.offsetHeight);
                        if (gap < 0) {
                            console.warn(`Overlap between ${prevSection.id} and ${section.id}: ${gap}px`);
                        }
                    }
                }
            });
        }
        setTimeout(checkSectionPositions, 1000);

        // Mark main sections as ARIA landmarks (No Change)
        const mainElement = document.querySelector('main');
        const footerElement = document.querySelector('footer');
        const headerElement = document.querySelector('header');
        if (mainElement) mainElement.setAttribute('role', 'main');
        if (footerElement) footerElement.setAttribute('role', 'contentinfo');
        if (headerElement) headerElement.setAttribute('role', 'banner');

        // Project filter functionality
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        // Add data-category attributes to project cards for demo
        projectCards.forEach((card, index) => {
            // For demo purposes, assign categories to existing projects
            if (index === 0) {
                card.setAttribute('data-category', 'fullstack');
            } else if (index === 1) {
                card.setAttribute('data-category', 'backend');
            } else if (index === 2) {
                card.setAttribute('data-category', 'frontend');
            }
        });
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter projects
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        // Dark mode functionality
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        const body = document.body;
        
        // Check for saved theme preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
            // Update icon to sun for dark mode
            const darkModeIcon = darkModeToggle.querySelector('i');
            if (darkModeIcon) {
                darkModeIcon.className = 'fas fa-sun';
            }
        }
        
        // Add event listener to dark mode toggle
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                body.classList.toggle('dark-mode');
                
                // Update icon based on mode
                const darkModeIcon = this.querySelector('i');
                if (darkModeIcon) {
                    if (body.classList.contains('dark-mode')) {
                        darkModeIcon.className = 'fas fa-sun';
                        localStorage.setItem('darkMode', 'enabled');
                    } else {
                        darkModeIcon.className = 'fas fa-moon';
                        localStorage.setItem('darkMode', 'disabled');
                    }
                }
            });
        }
        
    } catch (error) {
        console.error('Error loading portfolio scripts:', error);
    }
});