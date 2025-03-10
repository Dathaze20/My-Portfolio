document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Portfolio scripts initialized');
        
        // Core UI elements
        const body = document.body;
        const pageLoader = document.querySelector('.page-loader');
        const navToggler = document.querySelector('.nav-toggler');
        const navLinks = document.querySelector('.nav-links');
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        const heroSection = document.querySelector('.hero');
        const header = document.querySelector('header');
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const anchors = document.querySelectorAll('a[href^="#"]');
        
        // Debounce function
        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        }
        
        // Handle page loader with animation
        function hideLoader() {
            if (pageLoader) {
                body.classList.add('page-loaded');
                setTimeout(() => {
                    pageLoader.style.display = 'none';
                }, 500);
            }
        }
        
        // Show loader for at least 600ms to ensure animation is seen
        const loaderTimeout = setTimeout(hideLoader, 600);
        
        // Also hide loader when all content is loaded
        window.addEventListener('load', function() {
            clearTimeout(loaderTimeout);
            hideLoader();
        });
        
        // Apply dark mode if saved
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
            updateDarkModeIcon(true);
        }
        
        // Header scroll effect
        window.addEventListener('scroll', debounce(function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Show/hide scroll to top button
            if (scrollToTopBtn) {
                if (scrollTop > 300) {
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                }
            }
            
        }, 150), { passive: true });
        
        // Initialize scroll animations
        initializeScrollObserver();
        
        function initializeScrollObserver() {
            const sections = document.querySelectorAll('section:not(.hero)');
            const options = {
                root: null,
                threshold: 0.15,
                rootMargin: '0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scrolled');
                        
                        // Animate skill bars when in view
                        const skills = entry.target.querySelectorAll('.skill-item');
                        if (skills.length > 0) {
                            skills.forEach((skill, index) => {
                                setTimeout(() => {
                                    skill.classList.add('scrolled');
                                    const progressBar = skill.querySelector('.progress');
                                    if (progressBar) {
                                        // Get the width from the inline style
                                        const width = progressBar.style.width;
                                        // First set width to 0
                                        progressBar.style.width = '0';
                                        // Then animate to the target width
                                        setTimeout(() => {
                                            progressBar.style.transition = 'width 1s ease-in-out';
                                            progressBar.style.width = width;
                                        }, 50);
                                    }
                                }, index * 150);
                            });
                        }
                        
                        // Animate project cards
                        const projects = entry.target.querySelectorAll('.project-card');
                        if (projects.length > 0) {
                            projects.forEach((project, index) => {
                                project.style.opacity = '0';
                                project.style.transform = 'translateY(20px)';
                                setTimeout(() => {
                                    project.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                                    project.style.opacity = '1';
                                    project.style.transform = 'translateY(0)';
                                }, 100 + (index * 150));
                            });
                        }
                    }
                });
            }, options);
            
            sections.forEach(section => {
                observer.observe(section);
            });
        }
        
        // Mobile Navigation
        if (navToggler && navLinks) {
            navToggler.addEventListener('click', function() {
                const isExpanded = navToggler.getAttribute('aria-expanded') === 'true';
                
                navLinks.classList.toggle('open');
                navToggler.classList.toggle('open');
                navToggler.setAttribute('aria-expanded', !isExpanded);
                
                // Handle body scroll locking when menu is open
                if (!isExpanded) {
                    // Lock body scroll for mobile when menu is open
                    body.style.overflow = 'hidden';
                    animateMenuItems();
                } else {
                    // Re-enable scrolling when menu is closed
                    body.style.overflow = '';
                }
            });
            
            // Close menu when clicking on a link
            const mobileMenuLinks = navLinks.querySelectorAll('a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (navLinks.classList.contains('open')) {
                        navToggler.click();
                    }
                });
            });
        }
        
        function animateMenuItems() {
            const menuItems = navLinks.querySelectorAll('li');
            menuItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100 + (index * 100));
            });
        }
        
        // Dark Mode Toggle
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                body.classList.toggle('dark-mode');
                const isDarkMode = body.classList.contains('dark-mode');
                
                darkModeToggle.setAttribute('aria-checked', isDarkMode);
                localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
                
                updateDarkModeIcon(isDarkMode);
                applyDarkModeTransition();
            });
        }
        
        function updateDarkModeIcon(isDarkMode) {
            if (!darkModeToggle) return;
            
            const icon = darkModeToggle.querySelector('i');
            if (icon) {
                if (isDarkMode) {
                    icon.className = 'fas fa-sun';
                    darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
                } else {
                    icon.className = 'fas fa-moon';
                    darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
                }
            }
        }
        
        function applyDarkModeTransition() {
            // Add a transition class to smoothly transition elements
            document.body.classList.add('color-theme-in-transition');
            setTimeout(() => {
                document.body.classList.remove('color-theme-in-transition');
            }, 1000);
        }
        
        // Scroll to top button
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Smooth scroll for all anchor links
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return; // Ignore empty anchors
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 60; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Initialize animated elements in hero section
        if (heroSection) {
            // Ensure elements are initially hidden
            const heroElements = heroSection.querySelectorAll('h1, p, .btn');
            heroElements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
            });
            
            // Animate hero elements with staggered delay
            setTimeout(() => {
                heroElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }, 300); // Delay to ensure page is ready
        }
        
        // Contact form validation
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form elements
                const nameField = document.getElementById('name');
                const emailField = document.getElementById('email');
                const messageField = document.getElementById('message');
                const formStatus = document.getElementById('formStatus');
                
                // Basic validation
                let isValid = true;
                
                if (!nameField.value.trim()) {
                    highlightError(nameField);
                    isValid = false;
                } else {
                    removeError(nameField);
                }
                
                if (!emailField.value.trim() || !isValidEmail(emailField.value)) {
                    highlightError(emailField);
                    isValid = false;
                } else {
                    removeError(emailField);
                }
                
                if (!messageField.value.trim()) {
                    highlightError(messageField);
                    isValid = false;
                } else {
                    removeError(messageField);
                }
                
                // Submit form if valid
                if (isValid) {
                    formStatus.textContent = "Thanks for your message! I'll get back to you soon.";
                    formStatus.style.color = 'green';
                    contactForm.reset();
                    
                    // In a real application, you would send the form data to a server here
                } else {
                    formStatus.textContent = "Please fill out all required fields correctly.";
                    formStatus.style.color = 'red';
                }
                
                formStatus.style.display = 'block';
                setTimeout(() => {
                    formStatus.style.opacity = '1';
                }, 10);
            });
        }
        
        function highlightError(element) {
            element.style.borderColor = 'red';
            element.parentElement.classList.add('error');
        }
        
        function removeError(element) {
            element.style.borderColor = '';
            element.parentElement.classList.remove('error');
        }
        
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email.toLowerCase());
        }
        
        // Typewriter effect for skills section
        function initTypewriter() {
            const element = document.querySelector('.typewriter');
            if (!element) return;
            
            const words = ["Web Developer", "UI/UX Designer", "Problem Solver", "Creative Thinker"];
            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typeSpeed = 100;
            
            function type() {
                const currentWord = words[wordIndex];
                
                if (isDeleting) {
                    element.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                    typeSpeed = 50;
                } else {
                    element.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                    typeSpeed = 100;
                }
                
                if (!isDeleting && charIndex === currentWord.length) {
                    isDeleting = true;
                    typeSpeed = 1000; // Pause at end
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typeSpeed = 500; // Pause before new word
                }
                
                setTimeout(type, typeSpeed);
            }
            
            type();
        }
        
        // Initialize typewriter if element exists
        initTypewriter();
        
        // Optimize image loading
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    } catch (error) {
        console.error('Error in portfolio scripts:', error);
        // Ensure page loader is hidden even if scripts fail
        document.body.classList.add('page-loaded');
        const loader = document.querySelector('.page-loader');
        if (loader) loader.style.display = 'none';
    }
});

// Keep all your existing feature-specific functions below
// This ensures your custom cursor, skill bars, etc. still work

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
const navLinks = document.querySelector('.nav-links');
const navLinksList = document.querySelectorAll('.nav-links a');
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

// New Feature: Custom cursor animation
function initializeCustomCursor() {
    if (window.innerWidth > 768) { // Only on desktop
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        window.addEventListener('mousemove', e => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        
        document.addEventListener('mousedown', () => {
            cursor.classList.add('active');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('active');
        });
        
        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.borderColor = 'var(--accent-color)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.borderColor = 'var(--primary-color)';
            });
        });
    }
}

// New Feature: Animated skills progress bars
function initializeSkillBars() {
    // Set progress values based on data attributes
    document.querySelectorAll('.skill-item').forEach(item => {
        const progressBar = item.querySelector('.progress');
        if (progressBar) {
            const progressValue = item.getAttribute('data-progress') || '75';
            progressBar.style.width = '0';
            progressBar.parentElement.style.setProperty('--progress-value', `${progressValue}%`);
        }
    });
}

// New Feature: Add particles to hero section using tsParticles
function initializeParticles() {
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("hero-particles", {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// New Feature: Add tilt effect to project cards
function initializeTiltEffect() {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".project-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.3
        });
    }
}

// New Feature: Add typewriter effect to hero section
function initializeTypewriter() {
    const heroText = document.querySelector('.hero p');
    if (!heroText) return;
    
    const texts = [
        'Full Stack Web Developer',
        'UI/UX Enthusiast',
        'React Specialist',
        'Node.js Expert'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            heroText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            heroText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // Start deleting after typing all characters
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pause at the end
        } 
        // Switch to next text after deleting
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before typing new text
        }
        
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
}

// New Feature: Enhance transitions with GSAP
function initializeGSAPAnimations() {
    if (typeof gsap !== 'undefined') {
        // Header animation
        gsap.from('header', { 
            y: -100, 
            opacity: 0, 
            duration: 1, 
            ease: 'power3.out'
        });
        
        // Hero content animation
        gsap.from('.hero h1', { 
            y: 50, 
            opacity: 0, 
            duration: 1, 
            delay: 0.2, 
            ease: 'power3.out' 
        });
        
        gsap.from('.hero p', { 
            y: 50, 
            opacity: 0, 
            duration: 1, 
            delay: 0.4, 
            ease: 'power3.out' 
        });
        
        gsap.from('.hero .btn', { 
            y: 50, 
            opacity: 0, 
            duration: 1, 
            delay: 0.6, 
            ease: 'power3.out' 
        });
        
        // Staggered animations for grid items
        gsap.from('.skill-item', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.skill-item',
                start: 'top 80%'
            }
        });
        
        gsap.from('.project-card', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.project-card',
                start: 'top 80%'
            }
        });
    }
}

// New Feature: Add scroll animations
function initializeScrollAnimations() {
    // Animate elements when they come into view
    const elements = document.querySelectorAll('.scroll-reveal');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize new features
initializeSkillBars();
initializeCustomCursor();
initializeTypewriter();
initializeScrollAnimations();

// Load optional enhancements if libraries are available
window.addEventListener('load', () => {
    if (document.querySelector('#hero-particles')) {
        initializeParticles();
    }
    
    setTimeout(() => {
        initializeTiltEffect();
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            initializeGSAPAnimations();
        }
    }, 500);
});

// Project Showcase Enhancement Functions

// Initialize project showcase
function initializeProjectShowcase() {
    const projectsCarousel = document.querySelector('.projects-carousel');
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const carouselDots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    const projectDetailsButtons = document.querySelectorAll('.project-details-btn');
    const projectModal = document.getElementById('projectModal');
    const modalClose = projectModal ? projectModal.querySelector('.modal-close') : null;
    const modalBody = projectModal ? projectModal.querySelector('.modal-body') : null;
    
    let currentSlideIndex = 0;
    const cardsPerView = getCardsPerView();
    
    // Function to determine how many cards should be visible at once based on viewport
    function getCardsPerView() {
        if (window.innerWidth >= 1200) return 4;
        if (window.innerWidth >= 992) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    // Project filtering functionality
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state for filter buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter projects
                filterProjects(filterValue);
            });
        });
        
        // Filter projects based on category
        function filterProjects(category) {
            projectCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (category === 'all' || card.getAttribute('data-category').includes(category)) {
                        card.style.display = '';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                            card.classList.add('animate-in');
                            
                            // Remove animation class after animation completes
                            setTimeout(() => {
                                card.classList.remove('animate-in');
                            }, 400);
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
            
            // Reset carousel position after filtering
            resetCarousel();
        }
    }
    
    // Carousel navigation with dots
    if (carouselDots.length > 0) {
        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                navigateToSlide(index);
                updateActiveDot(index);
            });
        });
    }
    
    // Previous slide button
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            navigatePrevSlide();
        });
    }
    
    // Next slide button
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            navigateNextSlide();
        });
    }
    
    // Navigate to specific slide
    function navigateToSlide(slideIndex) {
        if (!projectsCarousel) return;
        
        currentSlideIndex = slideIndex;
        const cardWidth = projectCards[0].offsetWidth + parseInt(window.getComputedStyle(projectCards[0]).marginRight);
        projectsCarousel.scrollTo({
            left: slideIndex * cardWidth,
            behavior: 'smooth'
        });
        
        updateActiveDot(slideIndex);
    }
    
    // Navigate to previous slide
    function navigatePrevSlide() {
        if (currentSlideIndex > 0) {
            navigateToSlide(currentSlideIndex - 1);
        } else {
            // Loop to the last slide
            navigateToSlide(Math.ceil(projectCards.length / cardsPerView) - 1);
        }
    }
    
    // Navigate to next slide
    function navigateNextSlide() {
        if (currentSlideIndex < Math.ceil(projectCards.length / cardsPerView) - 1) {
            navigateToSlide(currentSlideIndex + 1);
        } else {
            // Loop back to first slide
            navigateToSlide(0);
        }
    }
    
    // Update active dot indicator
    function updateActiveDot(index) {
        if (carouselDots.length === 0) return;
        
        carouselDots.forEach((dot, i) => {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
            
            if (i === index) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            }
        });
    }
    
    // Reset carousel position
    function resetCarousel() {
        if (!projectsCarousel) return;
        
        currentSlideIndex = 0;
        projectsCarousel.scrollTo({
            left: 0,
            behavior: 'smooth'
        });
        updateActiveDot(0);
    }
    
    // Touch swipe support for carousel
    let startX, endX;
    const threshold = 50; // minimum distance for swipe
    
    if (projectsCarousel) {
        projectsCarousel.addEventListener('touchstart', e => {
            startX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        projectsCarousel.addEventListener('touchend', e => {
            endX = e.changedTouches[0].screenX;
            
            const diff = startX - endX;
            
            if (Math.abs(diff) >= threshold) {
                if (diff > 0) {
                    // Swipe left, go to next slide
                    navigateNextSlide();
                } else {
                    // Swipe right, go to previous slide
                    navigatePrevSlide();
                }
            }
        }, { passive: true });
    }
    
    // Project detail modal functionality
    if (projectDetailsButtons.length > 0 && projectModal && modalClose && modalBody) {
        projectDetailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project');
                
                // Load project details (in a real project, this could fetch from an API)
                const projectDetails = getProjectDetails(projectId);
                
                // Populate modal content
                populateProjectModal(projectDetails);
                
                // Show modal with animation
                projectModal.classList.add('active');
                projectModal.setAttribute('aria-hidden', 'false');
                
                // Trap focus in modal for accessibility
                trapFocus(projectModal);
                
                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal button
        modalClose.addEventListener('click', closeProjectModal);
        
        // Close on background click
        projectModal.addEventListener('click', e => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
        
        // Close on ESC key press
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                closeProjectModal();
            }
        });
        
        function closeProjectModal() {
            projectModal.classList.remove('active');
            projectModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
        
        function populateProjectModal(projectData) {
            // Create modal content with project details
            const content = `
                <div class="modal-project">
                    <div class="modal-project-header">
                        <h3 id="modalTitle">${projectData.title}</h3>
                        <div class="modal-project-meta">
                            <span class="modal-project-category">${projectData.category}</span>
                            <span class="modal-project-date">${projectData.date}</span>
                        </div>
                    </div>
                    <div class="modal-project-gallery">
                        ${projectData.images.map(img => `
                            <div class="modal-project-image">
                                <img src="${img.src}" alt="${img.alt}" loading="lazy">
                            </div>
                        `).join('')}
                    </div>
                    <div class="modal-project-description">
                        <h4>Project Overview</h4>
                        <p>${projectData.description}</p>
                        
                        <h4>Technologies Used</h4>
                        <div class="modal-tech-stack">
                            ${projectData.technologies.map(tech => `
                                <span class="tech-badge">
                                    <i class="${tech.icon}"></i> ${tech.name}
                                </span>
                            `).join('')}
                        </div>
                        
                        <h4>Key Features</h4>
                        <ul class="modal-features-list">
                            ${projectData.features.map(feature => `
                                <li>${feature}</li>
                            `).join('')}
                        </ul>
                        
                        <div class="modal-project-links">
                            <a href="${projectData.liveLink}" class="btn" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                            <a href="${projectData.repoLink}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-github"></i> View Code
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            modalBody.innerHTML = content;
        }
        
        function trapFocus(element) {
            const focusableElements = element.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="checkbox"], [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            // Set focus on first element
            setTimeout(() => {
                firstElement.focus();
            }, 100);
            
            // Trap focus in modal
            element.addEventListener('keydown', e => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        // If shift + tab and on first element, go to last element
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        // If just tab and on last element, circle back to first element
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        }
    }
    
    // Sample project data (in a real app, this would come from a database or API)
    function getProjectDetails(projectId) {
        const projectsData = {
            'ecommerce': {
                title: 'E-Commerce Platform',
                category: 'Web Application',
                date: 'January 2023',
                description: 'A comprehensive e-commerce solution with product management, shopping cart functionality, user authentication, and secure payment processing. The platform features a responsive design that adapts to various screen sizes and devices.',
                images: [
                    { src: 'https://source.unsplash.com/800x450/?ecommerce', alt: 'E-Commerce Platform Dashboard' },
                    { src: 'https://source.unsplash.com/800x450/?shopping', alt: 'Shopping Cart Interface' }
                ],
                technologies: [
                    { name: 'React', icon: 'fab fa-react' },
                    { name: 'Node.js', icon: 'fab fa-node' },
                    { name: 'MongoDB', icon: 'fas fa-database' },
                    { name: 'Stripe', icon: 'fab fa-stripe' }
                ],
                features: [
                    'User authentication and profile management',
                    'Product catalog with search, filter, and sorting',
                    'Shopping cart and wishlist functionality',
                    'Secure payment processing with Stripe',
                    'Order tracking and management',
                    'Admin dashboard for product and user management'
                ],
                liveLink: '#',
                repoLink: '#'
            },
            'taskapp': {
                title: 'Task Management App',
                category: 'Web & Mobile Application',
                date: 'March 2023',
                description: 'A productivity tool that helps users organize tasks, set priorities, and track progress. The application includes features like drag-and-drop task organization, reminders, and team collaboration tools.',
                images: [
                    { src: 'https://source.unsplash.com/800x450/?tasks', alt: 'Task Management Dashboard' },
                    { src: 'https://source.unsplash.com/800x450/?productivity', alt: 'Task Organization Interface' }
                ],
                technologies: [
                    { name: 'JavaScript', icon: 'fab fa-js' },
                    { name: 'Express', icon: 'fab fa-node' },
                    { name: 'PostgreSQL', icon: 'fas fa-database' }
                ],
                features: [
                    'Task creation, categorization, and organization',
                    'Drag-and-drop interface for task management',
                    'Calendar integration and deadline reminders',
                    'Team collaboration and task assignment',
                    'Progress tracking and reporting',
                    'Daily, weekly, and monthly goal setting'
                ],
                liveLink: '#',
                repoLink: '#'
            },
            'analytics': {
                title: 'Analytics Dashboard',
                category: 'Web Application & Data Visualization',
                date: 'May 2023',
                description: 'An interactive data visualization platform that helps businesses analyze performance metrics, customer behavior, and market trends. The dashboard features real-time updates and customizable widgets.',
                images: [
                    { src: 'https://source.unsplash.com/800x450/?dashboard', alt: 'Analytics Dashboard Main View' },
                    { src: 'https://source.unsplash.com/800x450/?charts', alt: 'Data Visualization Charts' }
                ],
                technologies: [
                    { name: 'React', icon: 'fab fa-react' },
                    { name: 'D3.js', icon: 'fab fa-js' },
                    { name: 'Firebase', icon: 'fas fa-fire' }
                ],
                features: [
                    'Real-time data processing and visualization',
                    'Customizable dashboard with drag-and-drop widgets',
                    'Comprehensive reporting with exportable formats',
                    'User behavior analytics and conversion tracking',
                    'Integration with multiple data sources',
                    'Automated insights and trend identification'
                ],
                liveLink: '#',
                repoLink: '#'
            },
            'healthapp': {
                title: 'Health Tracking Mobile App',
                category: 'Mobile Application',
                date: 'July 2023',
                description: 'A cross-platform mobile application designed to help users track their fitness activities, nutrition intake, and overall health metrics. The app provides personalized recommendations and insights based on user data.',
                images: [
                    { src: 'https://source.unsplash.com/800x450/?fitness', alt: 'Health App Dashboard' },
                    { src: 'https://source.unsplash.com/800x450/?health', alt: 'Fitness Tracking Interface' }
                ],
                technologies: [
                    { name: 'React Native', icon: 'fab fa-react' },
                    { name: 'Redux', icon: 'fas fa-code' },
                    { name: 'Firebase', icon: 'fas fa-fire' }
                ],
                features: [
                    'Activity tracking with GPS integration',
                    'Nutrition logging and meal planning',
                    'Health metrics monitoring (heart rate, sleep, etc.)',
                    'Workout planning and exercise library',
                    'Progress visualization and goal setting',
                    'Social sharing and community challenges'
                ],
                liveLink: '#',
                repoLink: '#'
            }
        };
        
        return projectsData[projectId] || {
            title: 'Project Details',
            category: 'Unknown Category',
            date: 'No Date',
            description: 'No description available for this project.',
            images: [{ src: 'https://source.unsplash.com/800x450/?coding', alt: 'Project Image' }],
            technologies: [{ name: 'Various Technologies', icon: 'fas fa-code' }],
            features: ['Features unavailable'],
            liveLink: '#',
            repoLink: '#'
        };
    }
    
    // Handle window resize events
    window.addEventListener('resize', debounce(() => {
        const newCardsPerView = getCardsPerView();
        if (cardsPerView !== newCardsPerView) {
            // Update cards per view and reset carousel if needed
            cardsPerView = newCardsPerView;
            if (currentSlideIndex > Math.ceil(projectCards.length / cardsPerView) - 1) {
                resetCarousel();
            }
        }
    }, 250));
    
    // Initialize with first filter (All)
    if (filterButtons.length > 0) {
        filterButtons[0].click();
    }
    
    // Initialize tooltips for tech badges
    initializeTechTooltips();
}

// Initialize tooltips for tech stack badges
function initializeTechTooltips() {
    const techBadges = document.querySelectorAll('.tech-badge[data-tooltip]');
    
    techBadges.forEach(badge => {
        const tooltip = badge.getAttribute('data-tooltip');
        if (!tooltip) return;
        
        // This is just for enhancing the tooltip behavior, 
        // the main tooltip functionality is handled by CSS
        badge.addEventListener('mouseenter', function() {
            this.setAttribute('aria-label', tooltip);
        });
        
        badge.addEventListener('mouseleave', function() {
            this.removeAttribute('aria-label');
        });
    });
}

// Initialize the project showcase when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectShowcase();
});