// Enhanced Mobile navigation toggle
const navToggleButton = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggleButton && navMenu) {
    // Toggle menu on button click
    navToggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = navMenu.classList.toggle('open');
        navToggleButton.setAttribute('aria-expanded', String(isOpen));
        
        // Prevent body scroll when menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggleButton.contains(e.target)) {
            navMenu.classList.remove('open');
            navToggleButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            navToggleButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on window resize (if screen becomes larger)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 820 && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            navToggleButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scroll offset fix for sticky header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;
        const targetEl = document.querySelector(href);
        if (!targetEl) return;
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - (headerHeight + 8);
        window.scrollTo({ top, behavior: 'smooth' });
        if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            navToggleButton.setAttribute('aria-expanded', 'false');
        }
    });
});

// Contact form validation and WhatsApp integration
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const validators = {
    name: value => value.trim().length >= 2 || 'Please enter your full name.',
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email.',
    message: value => value.trim().length >= 10 || 'Message should be at least 10 characters.'
};

function setError(id, message) {
    const el = document.querySelector(`[data-error-for="${id}"]`);
    if (el) el.textContent = message || '';
}

function validateField(input) {
    const rule = validators[input.name];
    if (!rule) return true;
    const result = rule(input.value);
    const isValid = result === true;
    setError(input.id, isValid ? '' : String(result));
    return isValid;
}

function sendWhatsAppMessage(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Create WhatsApp message
    const whatsappMessage = `Hi Narayan Bhai,

I'm interested in your construction services.

Name: ${name}
Email: ${email}
Message: ${message}

Please contact me back. Thank you!`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/919636112427?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        statusEl.textContent = '';
        const inputs = Array.from(form.querySelectorAll('input[required], textarea[required]'));
        const allValid = inputs.every(input => validateField(input));
        if (!allValid) {
            statusEl.textContent = 'Please fix the errors above and try again.';
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        
        // Show success message
        statusEl.textContent = 'Opening WhatsApp...';
        
        // Send to WhatsApp
        sendWhatsAppMessage(formData);
        
        // Reset form after a short delay
        setTimeout(() => {
            form.reset();
            statusEl.textContent = 'Message sent! Check WhatsApp for confirmation.';
        }, 1000);
    });

    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });
}

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

function updateThemeIcon(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Language toggle functionality
const langToggle = document.getElementById('lang-toggle');
let currentLang = localStorage.getItem('language') || 'en';

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-en][data-hi]');
    elements.forEach(element => {
        if (lang === 'hi') {
            element.textContent = element.getAttribute('data-hi');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });

    // Update placeholders
    const inputs = document.querySelectorAll('input[data-en-placeholder], textarea[data-en-placeholder]');
    inputs.forEach(input => {
        if (lang === 'hi') {
            input.placeholder = input.getAttribute('data-hi-placeholder');
        } else {
            input.placeholder = input.getAttribute('data-en-placeholder');
        }
    });

    // Update WhatsApp message
    const whatsappLink = document.querySelector('.whatsapp-float');
    if (whatsappLink) {
        const baseUrl = 'https://wa.me/919636112427?text=';
        const message = lang === 'hi' 
            ? 'नमस्ते%20नारायण%20भाई,%20मैं%20आपकी%20निर्माण%20सेवाओं%20में%20रुचि%20रखता%20हूं'
            : 'Hi%20Narayan%20Bhai,%20I\'m%20interested%20in%20your%20construction%20services';
        whatsappLink.href = baseUrl + message;
    }

    // Update language toggle button
    if (langToggle) {
        langToggle.textContent = lang === 'hi' ? 'HI' : 'EN';
    }

    localStorage.setItem('language', lang);
}

// Initialize language
updateLanguage(currentLang);

if (langToggle) {
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'hi' : 'en';
        currentLang = newLang;
        updateLanguage(newLang);
    });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// IntersectionObserver for reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
} else {
    // Fallback if IO not supported
    revealEls.forEach(el => el.classList.add('show'));
}


