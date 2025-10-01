// ===== DOM CONTENT LOADED EVENT =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initCounters();
    initContactForm();
    initSmoothScroll();
    initLoadingAnimations();
    initProductInteractions(); // Renamed to a specific function
});

// ===== EMAILJS CONFIGURATION =====
// Replace these with your actual EmailJS IDs from your account
const EMAIL_CONFIG = {
    PUBLIC_KEY: 'pWyXDiKDxebeXfpN5',
    SERVICE_ID: 'service_zc78y5a',
    TEMPLATE_ID: 'template_gtpw8ir'
};

// Check if EmailJS script is loaded
if (typeof emailjs === 'undefined') {
    console.error('EmailJS script is not loaded. Please add the EmailJS CDN script to your HTML file.');
}

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Handle scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// ===== SMOOTH SCROLL FUNCTIONALITY =====
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Trigger counter animation if it's a stat item
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.about-card, .product-card, .contact-card, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== COUNTER ANIMATIONS =====
function initCounters() {
    // This function remains a placeholder as the animation is triggered by the Intersection Observer
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const increment = target / 100;
    let current = 0;
    
    const updateCounter = () => {
        if (current < target) {
            current += increment;
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

 // ===== CONTACT FORM FUNCTIONALITY =====
// function initContactForm() {
//    // Validate EmailJS configuration
//     if (typeof emailjs === 'undefined' || !emailjs || !pWyXDiKDxebeXfpN5 || !service_zc78y5a || !template_gtpw8ir) {
//         console.error('EmailJS configuration incomplete or script not loaded. Contact form will not work until properly configured.');
//         return;
// }
    
    // Initialize EmailJS with configuration
    emailjs.init(pWyXDiKDxebeXfpN5);
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
// }

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Validate all fields before sending
    const fields = form.querySelectorAll('input, textarea');
    let isValid = true;
    fields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });

    if (!isValid) {
        showErrorMessage('Please fix the errors in the form before submitting.');
        return;
    }

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    form.classList.add('loading');
    
    // Remove any existing messages
    removeStatusMessages();
    
    // Prepare email data
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        to_name: 'Sri Guru Bangalore Bakery'
    };
    
    // Send email using EmailJS
    emailjs.send(service_zc78y5a, template_gtpw8ir, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccessMessage('Thank you! Your message has been sent successfully. We will get back to you soon.');
            form.reset();
        })
        .catch(function(error) {
            console.log('FAILED...', error);
            showErrorMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
        })
        .finally(function() {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.classList.remove('loading');
        });
}

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    const form = document.getElementById('contact-form');
    form.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    const form = document.getElementById('contact-form');
    form.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function removeStatusMessages() {
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
}

// ===== LOADING ANIMATIONS =====
function initLoadingAnimations() {
    // Add entrance animations to elements
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && heroImage) {
        // Delay to create staggered effect
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateX(0)';
        }, 200);
        
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 400);
    }
}

// ===== PRODUCT INTERACTIONS =====
function initProductInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const viewMoreBtn = card.querySelector('.btn-small');
        
        if (viewMoreBtn) {
            viewMoreBtn.addEventListener('click', function() {
                const productTitle = card.querySelector('.product-title').textContent;
                showProductModal(productTitle);
            });
        }
    });
}

function showProductModal(productName) {
    // Create and display a proper modal instead of an alert
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>More Info: ${productName}</h2>
            <p>More information about **${productName}** coming soon! For custom orders and detailed information, please feel free to <a href="#contact">contact us directly</a>.</p>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== PERFORMANCE OPTIMIZATIONS =====
const debouncedScrollHandler = debounce(() => {
    // Additional scroll-based functionality can go here
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', function(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ===== FORM VALIDATION =====
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.style.borderColor = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        field.style.borderColor = '#dc3545';
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.style.borderColor = '#dc3545';
            return false;
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[\d\s\-()]+$/;
        if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
            field.style.borderColor = '#dc3545';
            return false;
        }
    }
    
    // Success styling
    if (value) {
        field.style.borderColor = '#28a745';
    }
    
    return true;
}

function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = '';
}

// ===== PAGE LOAD OPTIMIZATIONS =====
window.addEventListener('load', function() {
    // Hide any loading spinners or show content
    document.body.classList.add('loaded');
    
    // Initialize any lazy-loaded content
    initLazyLoading();
});

function initLazyLoading() {
    // This would handle lazy loading of images or other content
    // For now, just a placeholder for future implementation
    console.log('Page fully loaded - ready for lazy loading initialization');
}

// // ===== ERROR HANDLING =====
// window.addEventListener('error', function(e) {
//     console.error('JavaScript error occurred:', e.error);
//     // Could implement error reporting here
// });