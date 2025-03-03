document.addEventListener('DOMContentLoaded', function() {
    const navToggler = document.querySelector('.nav-toggler');
    const navLinks = document.querySelector('.nav-links');
    const navLinksList = document.querySelectorAll('.nav-links a'); // Get all nav links
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    navToggler.addEventListener('click', function() {
        navLinks.classList.toggle('open');
        navToggler.classList.toggle('open');
    });

    // Smooth Scrolling
    navLinksList.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - document.querySelector('header').offsetHeight, // Adjusted for header height
                    behavior: 'smooth' // Enable smooth scrolling
                });

                // Close the mobile menu after clicking (optional)
                navLinks.classList.remove('open');
                navToggler.classList.remove('open');
            }
        });
    });

    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
    });

    // Scroll Animations
    const scrollElements = document.querySelectorAll('.scroll-element');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
        // Show or hide the scroll-to-top button
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Scroll-to-Top Button
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form Validation
    const contactForm = document.querySelector('.contact-form form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;

        if (name && email && message) {
            alert('Thank you for your message!');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Micro-interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.classList.add('hovered');
        });
        button.addEventListener('mouseout', () => {
            button.classList.remove('hovered');
        });
    });
});