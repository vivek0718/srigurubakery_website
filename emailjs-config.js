// ===== EMAILJS CONFIGURATION =====
const EMAIL_CONFIG = {
     PUBLIC_KEY: "pWyXDiKDxebeXfpN5",
    SERVICE_ID: "service_zc78y5a", 
    TEMPLATE_ID: "template_gtpw8ir",     // Replace with your Template ID
};

// ===== CONTACT FORM FUNCTIONALITY =====
function initContactForm() {
    // Check if EmailJS is available
    if (typeof window.emailjs === 'undefined') {
        console.error('EmailJS SDK not loaded. Check the script inclusion in index.html.');
        return;
    }
    
    // Validate configuration
    if (!EMAIL_CONFIG.PUBLIC_KEY || !EMAIL_CONFIG.SERVICE_ID || !EMAIL_CONFIG.TEMPLATE_ID) {
        console.error('EmailJS configuration incomplete. Update EMAIL_CONFIG with your credentials.');
        return;
    }
    
    console.log('EmailJS initialized with publicKey:', EMAIL_CONFIG.PUBLIC_KEY.substring(0, 10) + '...');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    form.classList.add('loading');
    
    // Remove any existing messages
    removeStatusMessages();
    
    // Prepare email data
    const templateParams = {
        from_name: formData.get('name') || 'Anonymous',
        from_email: formData.get('email') || 'no-email@example.com',
        phone: formData.get('phone') || 'N/A',
        subject: formData.get('subject') || 'General Inquiry',
        message: formData.get('message') || 'No message provided',
        to_name: 'Sri Guru Bangalore Bakery'
    };
    
    // Send email using EmailJS v4
    window.emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, templateParams, {
        publicKey: EMAIL_CONFIG.PUBLIC_KEY
    })
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccessMessage('Thank you! Your message has been sent successfully. We will get back to you soon.');
            form.reset();
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            showErrorMessage('Sorry, there was an error sending your message. Please try again or contact us directly at srigurubakery7@gmail.com.');
        })
        .finally(function() {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.classList.remove('loading');
        });
}

// Ensure initContactForm is called on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    // Other initializations (navigation, animations, etc.)
    initNavigation();
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
    initLoadingAnimations();
});