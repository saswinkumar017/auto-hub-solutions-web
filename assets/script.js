// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

// FAQ Toggle
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        item.classList.toggle('active');
    });
});

// Pricing Toggle - Monthly/Yearly
const billingToggle = document.getElementById('billingToggle');
if (billingToggle) {
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');

    billingToggle.addEventListener('change', () => {
        monthlyPrices.forEach(price => {
            price.style.display = billingToggle.checked ? 'none' : 'inline';
        });
        yearlyPrices.forEach(price => {
            price.style.display = billingToggle.checked ? 'inline' : 'none';
        });
    });
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });

        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            whatsapp: document.getElementById('whatsapp').value.trim(),
            company: document.getElementById('company').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim(),
            privacy: document.getElementById('privacy').checked,
            timestamp: new Date().toISOString()
        };

        // Validate form
        let isValid = true;
        const errors = {};

        if (!formData.fullName) {
            errors.fullName = 'Full name is required';
            isValid = false;
        }

        if (!formData.email || !isValidEmail(formData.email)) {
            errors.email = 'Valid email is required';
            isValid = false;
        }

        if (!formData.phone) {
            errors.phone = 'Phone number is required';
            isValid = false;
        }

        if (!formData.whatsapp) {
            errors.whatsapp = 'WhatsApp number is required';
            isValid = false;
        }

        if (!formData.service) {
            errors.service = 'Please select a service';
            isValid = false;
        }

        if (!formData.privacy) {
            errors.privacy = 'You must agree to the privacy policy';
            isValid = false;
        }

        // Display errors
        if (!isValid) {
            for (const field in errors) {
                const errorElement = document.getElementById(`${field}Error`);
                if (errorElement) {
                    errorElement.textContent = errors[field];
                }
            }
            return;
        }

        // Submit form
        try {
            const submitBtn = document.getElementById('submitBtn');
            const formMessage = document.getElementById('formMessage');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Log form data (in production, this would be sent to a server)
            console.log('Form submitted:', formData);

            // Store in localStorage for demo
            const leads = JSON.parse(localStorage.getItem('autohub_leads') || '[]');
            leads.push(formData);
            localStorage.setItem('autohub_leads', JSON.stringify(leads));

            // Show success message
            formMessage.className = 'form-message success';
            formMessage.textContent = '✓ Thank you! Your inquiry has been received. We\'ll contact you within 2 hours.';

            // Reset form
            contactForm.reset();

            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Reset button
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit & Contact Me';
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 3000);

        } catch (error) {
            const formMessage = document.getElementById('formMessage');
            formMessage.className = 'form-message error';
            formMessage.textContent = '✗ An error occurred. Please try again.';
            
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit & Contact Me';
        }
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Active navigation link
window.addEventListener('load', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.feature-card, .service-card, .industry-card, .value-card, .testimonial-card, .pricing-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// URL parameter handling for contact form
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const serviceSelect = document.getElementById('service');
    
    if (plan && serviceSelect) {
        if (plan === 'basic') {
            serviceSelect.value = 'WhatsApp Automation';
        } else if (plan === 'standard') {
            serviceSelect.value = 'Multiple Services';
        } else if (plan === 'premium') {
            serviceSelect.value = 'Multiple Services';
        }
    }
});

// Real-time form validation
const formInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], select, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateField(input);
    });
});

function validateField(field) {
    const value = field.value.trim();
    const errorId = field.id + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (!errorElement) return;

    if (field.id === 'fullName' && !value) {
        errorElement.textContent = 'Full name is required';
    } else if (field.id === 'email' && (!value || !isValidEmail(value))) {
        errorElement.textContent = 'Valid email is required';
    } else if (field.id === 'phone' && !value) {
        errorElement.textContent = 'Phone number is required';
    } else if (field.id === 'whatsapp' && !value) {
        errorElement.textContent = 'WhatsApp number is required';
    } else if (field.id === 'service' && !value) {
        errorElement.textContent = 'Please select a service';
    } else {
        errorElement.textContent = '';
    }
}

// Clear error message on focus
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        const errorId = input.id + 'Error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
});

// Function to get lead data from localStorage
window.getLeadsData = function() {
    return JSON.parse(localStorage.getItem('autohub_leads') || '[]');
};

// Log leads for testing (use in console: getLeadsData())
console.log('AutoHub Solutions - Contact form is ready. Use getLeadsData() to view submissions.');

// Initialize animations on page load
window.addEventListener('load', () => {
    // Add stagger animation to grid items
    const gridItems = document.querySelectorAll('.feature-card, .service-card, .industry-card, .value-card, .pricing-card');
    gridItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// Prevent WhatsApp button on mobile to avoid double tap delay
if (window.matchMedia('(pointer:coarse)').matches) {
    document.addEventListener('touchend', (e) => {
        if (!e.target.closest('.whatsapp-float')) {
            document.querySelectorAll('.whatsapp-float').forEach(btn => {
                btn.style.pointerEvents = 'auto';
            });
        }
    });
}

// Handle escape key for mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// Accessibility: Make FAQ keyboard navigable
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
        }
    });
});

// Track page views (analytics)
window.addEventListener('load', () => {
    const pageData = {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
    };
    
    // Store page view
    const pageViews = JSON.parse(localStorage.getItem('autohub_page_views') || '[]');
    pageViews.push(pageData);
    
    // Keep only last 100 views
    if (pageViews.length > 100) {
        pageViews.shift();
    }
    
    localStorage.setItem('autohub_page_views', JSON.stringify(pageViews));
});
