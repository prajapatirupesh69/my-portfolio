// ===================================
// 1. Dark Mode Toggle & Setup
// ===================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for stored theme preference or default to light mode
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark-mode') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; 
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark-mode');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light-mode');
    }
});


// ===================================
// 2. Scroll Interactions
// ===================================

// Scroll-to-Top Button
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href').length > 1) { 
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Sticky Header Animation
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > document.getElementById('hero').offsetHeight - 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// ===================================
// 3. Attractive Scroll-Reveal Animation
// ===================================

// Target elements that need animation
const animatedElements = document.querySelectorAll('.skill-category, .job-card, .education-item');

// Configuration for the Intersection Observer
const observerOptions = {
    root: null, // viewport
    threshold: 0.2, // Trigger when 20% of the item is visible
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add the 'visible' class when the element enters the viewport
            entry.target.classList.add('visible');
            // Stop observing the element once it has been revealed
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Attach the observer to all target elements
animatedElements.forEach(element => {
    observer.observe(element);
});
