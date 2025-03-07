document.addEventListener('DOMContentLoaded', function() {
    try {
        // Debug statement to ensure script loads
        console.log('Portfolio scripts loaded successfully');
        
        // Page Loader
        const pageLoader = document.querySelector('.page-loader');
        
        // Hide loader when page is loaded
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
        
        // Core UI elements
        const navToggler = document.querySelector('.nav-toggler');
        const navLinks = document.querySelector('.nav-links');
        const navLinksList = document.querySelectorAll('.nav-links a');
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        const body = document.body;
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        const formStatus = document.getElementById('formStatus');
        const contactForm = document.getElementById('contactForm');
        
        // Check for saved theme preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
            updateDarkModeIcon(true);
            darkModeToggle.setAttribute('aria-checked', 'true');
        }
        
        // Mobile Navigation Toggle with ARIA attributes
        if (navToggler) {
            navToggler.addEventListener('click', function() {
                const isExpanded = navLinks.classList.contains('open');
                navLinks.classList.toggle('open');
                navToggler.classList.toggle('open');
                
                // Update ARIA attributes for accessibility
                navToggler.setAttribute('aria-expanded', !isExpanded);
                
                // Add animation for mobile menu
                if (!isExpanded) {
                    animateMenuItems();
                }
            });
        }

        // Animate mobile menu items when menu opens
        function animateMenuItems() {
            const menuItems = document.querySelectorAll('.nav-links li');
            menuItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
            });
        }
        
        // Smooth Scrolling with offset for header
        navLinksList.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Add active class to current nav item
                    navLinksList.forEach(navLink => {
                        navLink.classList.remove('active');
                        navLink.setAttribute('aria-current', 'false');
                    });
                    this.classList.add('active');
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close the mobile menu after clicking
                    navLinks.classList.remove('open');
                    if (navToggler) {
                        navToggler.classList.remove('open');
                        navToggler.setAttribute('aria-expanded', 'false');
                    }
                
                }
            });
        });
        
        // Dark Mode Toggle with animation and accessibility
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                console.log('Dark mode toggle clicked');
                body.classList.toggle('dark-mode');
                const isDarkMode = body.classList.contains('dark-mode');
                
                // Update ARIA attributes
                darkModeToggle.setAttribute('aria-checked', isDarkMode);
                
                // Save preference to localStorage
                localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
                
                // Update icon
                updateDarkModeIcon(isDarkMode);
                
                // Apply transitions to elements
                applyDarkModeTransition();
            });
            
            // Keyboard support for dark mode toggle
            darkModeToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
        
        function updateDarkModeIcon(isDarkMode) {
            if (!darkModeToggle) return;
            
            const darkModeIcon = darkModeToggle.querySelector('i');
            if (!darkModeIcon) return;
            
            if (isDarkMode) {
                darkModeIcon.className = 'fas fa-sun';
                darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
            } else {
                darkModeIcon.className = 'fas fa-moon';
                darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
        
        function applyDarkModeTransition() {
            const elementsToTransition = document.querySelectorAll('.project-card, .testimonial-card, .blog-post, .skill-item');
            elementsToTransition.forEach(element => {
                element.style.transition = 'background-color 0.5s ease, color 0.5s ease, box-shadow 0.5s ease';
            });
        }
        
        // Image lazy loading optimization
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
        
        // Use Intersection Observer for scroll animations - better performance
        const scrollElements = document.querySelectorAll('.scroll-element');
        
        // Initialize Intersection Observer for better performance
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
        
        // Scroll-to-Top Button with accessibility
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
                
                // Highlight active section in navigation
                highlightActiveSection();
            });
            
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Highlight active section in navigation
        function highlightActiveSection() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            const scrollPosition = window.scrollY + 200; // Adding offset
            
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
        
        // Enhanced Form Validation with visual feedback and accessibility
        if (contactForm) {
            // Add novalidate attribute to disable browser's default validation
            contactForm.setAttribute('novalidate', true);
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = contactForm.querySelector('input[name="name"]');
                const email = contactForm.querySelector('input[name="email"]');
                const message = contactForm.querySelector('textarea[name="message"]');
                
                // Reset previous error states
                if (formStatus) {
                    formStatus.className = 'form-status';
                    formStatus.style.display = 'none';
                }
                
                // Remove any existing error messages
                const existingErrors = contactForm.querySelectorAll('.form-error');
                existingErrors.forEach(error => error.remove());
                
                let isValid = true;
                
                // Validate inputs
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
                
                // Simulate form submission (replace with actual submission logic)
                const submitButton = contactForm.querySelector('.btn-submit');
                if (submitButton) {
                    const originalBtnText = submitButton.innerHTML;
                    
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    submitButton.setAttribute('aria-busy', 'true');
                    
                    // Simulate API call
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalBtnText;
                        submitButton.setAttribute('aria-busy', 'false');
                        
                        // On success
                        showFormSuccess('Thank you! Your message has been sent successfully.');
                        contactForm.reset();
                        
                        // Clear success message after 5 seconds
                        setTimeout(() => {
                            if (formStatus) {
                                formStatus.style.display = 'none';
                            }
                        }, 5000);
                    }, 1500);
                }
            });
        }
        
        // Show form error message
        function showFormError(message) {
            if (!formStatus) return;
            
            formStatus.textContent = message;
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            formStatus.setAttribute('role', 'alert');
        }
        
        // Show form success message
        function showFormSuccess(message) {
            if (!formStatus) return;
            
            formStatus.textContent = message;
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';
            formStatus.setAttribute('role', 'status');
        }
        
        // Show input-specific error message
        function showInputError(input, message) {
            input.classList.add('invalid');
            
            // Create error message
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.textContent = message;
            errorElement.setAttribute('role', 'alert');
            
            // Insert error message after input
            const parent = input.parentNode.parentNode; // Get the form-group div
            
            // Check if error message already exists
            const existingError = parent.querySelector('.form-error');
            if (!existingError) {
                parent.appendChild(errorElement);
            }
            
            // Add aria-invalid attribute
            input.setAttribute('aria-invalid', 'true');
            
            // Add input event to remove error on typing
            input.addEventListener('input', function onInput() {
                removeInputError(input);
                input.removeEventListener('input', onInput);
            });
        }
        
        // Remove input-specific error
        function removeInputError(input) {
            input.classList.remove('invalid');
            input.setAttribute('aria-invalid', 'false');
            
            // Remove error message
            const parent = input.parentNode.parentNode;
            const error = parent.querySelector('.form-error');
            if (error) {
                parent.removeChild(error);
            }
        }
        
        // Validate email format
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Typographic animation for the hero section
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
        
        // Performance optimization - use requestAnimationFrame for animations
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
        
        function update() {
            // Parallax effect for hero section
            const hero = document.querySelector('.hero');
            if (hero) {
                const parallaxElements = hero.querySelectorAll('.particles .particle');
                parallaxElements.forEach((element, index) => {
                    element.style.transform = `translateY(${lastKnownScrollY * (0.1 + index * 0.05)}px)`;
                });
            }
            
            // Show/hide scroll to top button
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
            
            // Reset ticker
            ticking = false;
        }
        
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Projects carousel touch swipe support
        const projectsCarousel = document.querySelector('.projects-carousel');
        if (projectsCarousel) {
            let startX, endX;
            const threshold = 50; // minimum distance for swipe
            
            projectsCarousel.addEventListener('touchstart', function(e) {
                startX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            projectsCarousel.addEventListener('touchend', function(e) {
                endX = e.changedTouches[0].screenX;
                
                // Calculate swipe distance
                const swipeDistance = startX - endX;
                
                if (Math.abs(swipeDistance) >= threshold) {
                    // Scroll the carousel
                    projectsCarousel.scrollBy({
                        left: swipeDistance,
                        behavior: 'smooth'
                    });
                }
            }, { passive: true });
        }
        
        // Initialize the active section in navigation
        highlightActiveSection();
        
        // For demonstration - make sure all sections are visible
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('scroll-element');
            console.log(`Section ${section.id} initialized with height: ${section.offsetHeight}`);
        });

        // Check if any sections are very close to each other or overlapping
        const checkSectionPositions = () => {
            const sections = document.querySelectorAll('section');
            sections.forEach((section, index) => {
                if (index > 0) {
                    const prevSection = sections[index - 1];
                    const gap = section.offsetTop - (prevSection.offsetTop + prevSection.offsetHeight);
                    if (gap < 0) {
                        console.warn(`Overlap between ${prevSection.id} and ${section.id}: ${gap}px`);
                    }
                }
            });
        };
        
        // Run this after a short delay to ensure all styles are applied
        setTimeout(checkSectionPositions, 1000);

        // Mark main sections as ARIA landmarks
        const mainElement = document.querySelector('main');
        const footerElement = document.querySelector('footer');
        const headerElement = document.querySelector('header');
        
        if (mainElement) mainElement.setAttribute('role', 'main');
        if (footerElement) footerElement.setAttribute('role', 'contentinfo');
        if (headerElement) headerElement.setAttribute('role', 'banner');
    } catch (error) {
        console.error('Error loading portfolio scripts:', error);
    }
});