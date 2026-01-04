// ============================================
// KLINIK SEHAT UTAMA - MAIN JAVASCRIPT FILE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== 1. PERFORMANCE OPTIMIZATIONS ====================
    
    // Debounce function for scroll/resize events
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
    
    // Throttle function for continuous events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ==================== 2. LOADING OVERLAY ====================
    
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        // Hide loading overlay after page loads
        const hideLoading = () => {
            loadingOverlay.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 500);
        };
        
        // Hide after content loads
        if (document.readyState === 'complete') {
            setTimeout(hideLoading, 500);
        } else {
            window.addEventListener('load', () => {
                setTimeout(hideLoading, 500);
            });
        }
        
        // Fallback: Hide after 3 seconds
        setTimeout(hideLoading, 3000);
    }
    
    // ==================== 3. NAVBAR ENHANCEMENTS ====================
    
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Add scrolled class on scroll
    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', debounce(handleNavbarScroll, 10));
    
    // Update active nav link on scroll
    const updateActiveNavLink = () => {
        let current = '';
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', debounce(updateActiveNavLink, 10));
    
    // Close mobile navbar when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || 
                                   new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
    
    // ==================== 4. BACK TO TOP BUTTON ====================
    
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        };
        
        window.addEventListener('scroll', debounce(toggleBackToTop, 10));
        
        // Scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ==================== 5. FORM VALIDATION & SUBMISSION ====================
    
    const form = document.getElementById('appointmentForm');
    
    if (form) {
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        // Validation patterns
        const patterns = {
            name: /^[a-zA-Z\s]{3,50}$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\d\s\-+()]{10,15}$/,
            date: /^\d{4}-\d{2}-\d{2}$/
        };
        
        // Validation messages
        const messages = {
            name: 'Nama harus 3-50 karakter (huruf dan spasi saja)',
            email: 'Masukkan email yang valid',
            phone: 'Masukkan nomor telepon yang valid (10-15 digit)',
            date: 'Pilih tanggal yang valid',
            service: 'Pilih layanan yang diinginkan',
            terms: 'Anda harus menyetujui syarat dan ketentuan'
        };
        
        // Format phone number as user types
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                // Format: 0812-3456-7890
                if (value.length > 0) {
                    if (value.length <= 4) {
                        value = value;
                    } else if (value.length <= 8) {
                        value = value.substring(0,4) + '-' + value.substring(4);
                    } else {
                        value = value.substring(0,4) + '-' + value.substring(4,8) + '-' + value.substring(8,12);
                    }
                }
                
                e.target.value = value;
            });
        }
        
        // Validate a single field
        function validateField(field) {
            const fieldId = field.id;
            const value = field.value.trim();
            const errorElement = document.getElementById(`${fieldId}Error`);
            
            // Clear previous states
            field.classList.remove('is-valid', 'is-invalid');
            if (errorElement) errorElement.textContent = '';
            
            // Skip validation if field is not required and empty
            if (!field.required && value === '') {
                return true;
            }
            
            let isValid = true;
            let message = '';
            
            switch (fieldId) {
                case 'name':
                    isValid = patterns.name.test(value);
                    message = messages.name;
                    break;
                case 'email':
                    isValid = patterns.email.test(value);
                    message = messages.email;
                    break;
                case 'phone':
                    const phoneDigits = value.replace(/\D/g, '');
                    isValid = phoneDigits.length >= 10 && phoneDigits.length <= 15;
                    message = messages.phone;
                    break;
                case 'date':
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    isValid = patterns.date.test(value) && selectedDate >= today;
                    message = messages.date;
                    break;
                case 'service':
                    isValid = value !== '';
                    message = messages.service;
                    break;
            }
            
            if (!isValid && value !== '') {
                field.classList.add('is-invalid');
                if (errorElement) {
                    errorElement.textContent = message;
                }
                return false;
            } else if (value !== '') {
                field.classList.add('is-valid');
            }
            
            return true;
        }
        
        // Real-time validation on blur
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
        
        // Form submission handler
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide previous messages
            if (successMessage) successMessage.classList.add('d-none');
            if (errorMessage) errorMessage.classList.add('d-none');
            
            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            // Validate terms checkbox
            const termsCheckbox = document.getElementById('terms');
            if (termsCheckbox && !termsCheckbox.checked) {
                if (errorMessage) {
                    errorMessage.textContent = messages.terms;
                    errorMessage.classList.remove('d-none');
                }
                termsCheckbox.focus();
                isValid = false;
            }
            
            if (!isValid) {
                if (errorMessage) {
                    errorMessage.textContent = 'Mohon perbaiki data yang masih salah';
                    errorMessage.classList.remove('d-none');
                    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                return;
            }
            
            // Prepare form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: document.getElementById('service').value,
                date: document.getElementById('date').value,
                message: document.getElementById('message').value.trim(),
                timestamp: new Date().toISOString(),
                source: 'Website Appointment Form'
            };
            
            // Get submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call (2 seconds delay)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Save to localStorage (simulating database)
                const appointments = JSON.parse(localStorage.getItem('klinik_appointments') || '[]');
                appointments.push(formData);
                localStorage.setItem('klinik_appointments', JSON.stringify(appointments));
                
                // Show success message
                if (successMessage) {
                    successMessage.innerHTML = `
                        <div class="d-flex align-items-start">
                            <i class="fas fa-check-circle text-success fs-4 me-3 mt-1"></i>
                            <div>
                                <h5 class="mb-2">Janji Temu Berhasil Dikirim!</h5>
                                <p class="mb-0">Terima kasih <strong>${formData.name}</strong>. Permintaan janji temu Anda telah kami terima. 
                                Tim kami akan menghubungi Anda melalui WhatsApp dalam waktu 1x24 jam untuk konfirmasi.</p>
                            </div>
                        </div>
                    `;
                    successMessage.classList.remove('d-none');
                    
                    // Scroll to success message
                    setTimeout(() => {
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
                
                // Reset form
                form.reset();
                inputs.forEach(input => input.classList.remove('is-valid'));
                
                // Update date input to tomorrow
                const dateInput = document.getElementById('date');
                if (dateInput) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    dateInput.value = tomorrow.toISOString().split('T')[0];
                }
                
                // Log for debugging
                console.log('Appointment submitted:', formData);
                console.log('Total appointments in storage:', appointments.length);
                
                // Create WhatsApp message (for simulation)
                const whatsappMessage = encodeURIComponent(
                    `Halo, saya ${formData.name} ingin membuat janji temu untuk ${formData.service} pada ${formData.date}. ${formData.message ? `Keluhan: ${formData.message}` : ''}`
                );
                
                // You can enable this for real WhatsApp integration
                // window.open(`https://wa.me/6281234567890?text=${whatsappMessage}`, '_blank');
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                if (errorMessage) {
                    errorMessage.textContent = 'Terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung di (021) 555-0123.';
                    errorMessage.classList.remove('d-none');
                }
            } finally {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // Set minimum date for appointment (today)
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            
            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.value = tomorrow.toISOString().split('T')[0];
        }
    }
    
    // ==================== 6. SCROLL ANIMATIONS ====================
    
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .doctor-card, .testimonial-card');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize animation states
    document.querySelectorAll('.service-card, .doctor-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', debounce(animateOnScroll, 10));
    
    // Initial check
    setTimeout(animateOnScroll, 500);
    
    // ==================== 7. TESTIMONIALS AUTO-ROTATE ====================
    
    const testimonialCards = document.querySelectorAll('#testimonials .card');
    if (testimonialCards.length > 1) {
        let currentTestimonial = 0;
        
        function rotateTestimonials() {
            testimonialCards.forEach((card, index) => {
                card.style.transform = index === currentTestimonial ? 'scale(1.05)' : 'scale(0.95)';
                card.style.opacity = index === currentTestimonial ? '1' : '0.7';
                card.style.zIndex = index === currentTestimonial ? '2' : '1';
                card.style.transition = 'all 0.5s ease';
            });
            
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        }
        
        // Start rotation
        setInterval(rotateTestimonials, 5000);
        
        // Pause rotation on hover
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                clearInterval(rotateTestimonials);
            });
            
            card.addEventListener('mouseleave', () => {
                setInterval(rotateTestimonials, 5000);
            });
        });
    }
    
    // ==================== 8. FAQ ACCORDION ENHANCEMENTS ====================
    
    const faqAccordion = document.getElementById('accordionFAQ');
    if (faqAccordion) {
        const accordionButtons = faqAccordion.querySelectorAll('.accordion-button');
        
        accordionButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Add animation class
                const collapseElement = this.getAttribute('data-bs-target');
                const target = document.querySelector(collapseElement);
                
                if (target) {
                    target.classList.toggle('collapsing');
                }
            });
        });
    }
    
    // ==================== 9. SOCIAL MEDIA INTERACTIONS ====================
    
    const socialLinks = document.querySelectorAll('.social-icon, .doctor-social a, .footer .btn');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Add click animation
        link.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode === this) {
                    this.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // ==================== 10. DYNAMIC CONTENT UPDATES ====================
    
    // Update copyright year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Add doctor count badge
    const doctorCards = document.querySelectorAll('.doctor-card');
    const doctorSection = document.getElementById('doctors');
    if (doctorSection && doctorCards.length > 0) {
        const title = doctorSection.querySelector('h2');
        if (title && !document.getElementById('doctorCount')) {
            const countBadge = document.createElement('span');
            countBadge.id = 'doctorCount';
            countBadge.className = 'badge bg-primary ms-2 fs-6';
            countBadge.textContent = doctorCards.length;
            title.appendChild(countBadge);
        }
    }
    
    // Add appointment counter
    const appointmentCount = localStorage.getItem('klinik_appointments') 
        ? JSON.parse(localStorage.getItem('klinik_appointments')).length 
        : 0;
    
    if (appointmentCount > 0) {
        console.log(`Total janji temu: ${appointmentCount}`);
    }
    
    // ==================== 11. PERFORMANCE MONITORING ====================
    
    // Log page load performance
    window.addEventListener('load', () => {
        if (window.performance) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`Page loaded in ${pageLoadTime}ms`);
            
            // Performance warning
            if (pageLoadTime > 3000) {
                console.warn('Page load time exceeds 3 seconds - Consider optimization');
            }
        }
        
        // Log Core Web Vitals (simulated)
        setTimeout(() => {
            console.log('Largest Contentful Paint: Simulated - 1.2s');
            console.log('First Input Delay: Simulated - 50ms');
            console.log('Cumulative Layout Shift: Simulated - 0.1');
        }, 1000);
    });
    
    // ==================== 12. ERROR HANDLING ====================
    
    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            error: e.error
        });
        
        // You could send this to an error tracking service here
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
    });
    
    // ==================== 13. SERVICE WORKER FOR PWA ====================
    
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            // Register service worker for PWA features
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }
    
    // ==================== 14. TOOLTIPS INITIALIZATION ====================
    
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // ==================== 15. LAZY LOADING IMAGES ====================
    
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length > 0) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // ==================== 16. ACCESSIBILITY IMPROVEMENTS ====================
    
    // Add skip to content link
    if (!document.querySelector('.skip-to-content')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content sr-only sr-only-focusable position-absolute top-0 start-0 p-3 bg-primary text-white';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Add main content id
    if (!document.getElementById('main-content')) {
        const mainContent = document.querySelector('main') || document.querySelector('.container');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
    }
    
    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // Focus trap for modals (if any)
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const modalInstance = bootstrap.Modal.getInstance(openModal);
                if (modalInstance) modalInstance.hide();
            }
        }
    });
    
    // ==================== 17. OFFLINE DETECTION ====================
    
    const updateOnlineStatus = () => {
        if (navigator.onLine) {
            document.body.classList.remove('offline');
            console.log('You are online');
            
            // Show online notification
            if (document.querySelector('.offline-notification')) {
                document.querySelector('.offline-notification').remove();
            }
        } else {
            document.body.classList.add('offline');
            console.warn('You are offline. Some features may not work.');
            
            // Show offline notification
            if (!document.querySelector('.offline-notification')) {
                const notification = document.createElement('div');
                notification.className = 'offline-notification alert alert-warning alert-dismissible fade show fixed-top mt-5 mx-3';
                notification.innerHTML = `
                    <i class="fas fa-wifi-slash me-2"></i>
                    <strong>Anda sedang offline.</strong> Beberapa fitur mungkin tidak tersedia.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                document.body.appendChild(notification);
            }
        }
    };
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
    
    // ==================== 18. SESSION MANAGEMENT ====================
    
    // Track user session
    if (!sessionStorage.getItem('session_start')) {
        sessionStorage.setItem('session_start', new Date().toISOString());
    }
    
    // Log session duration on page hide
    window.addEventListener('pagehide', () => {
        const startTime = new Date(sessionStorage.getItem('session_start'));
        const endTime = new Date();
        const duration = Math.round((endTime - startTime) / 1000);
        
        console.log(`Session duration: ${duration} seconds`);
        
        // You could send this to analytics
    });
    
    // ==================== 19. CUSTOM EVENTS ====================
    
    // Fire custom event when page is fully interactive
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('pageReady', {
            detail: { readyTime: new Date().toISOString() }
        }));
    }, 1000);
    
    // ==================== 20. INITIALIZE ALL COMPONENTS ====================
    
    console.log('Klinik Sehat Utama - Website initialized successfully');
    
});

// Add global styles for dynamic elements
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    /* Offline notification styles */
    .offline-notification {
        z-index: 9998;
        animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
    }
    
    /* Loading animation for images */
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img[data-src].loaded {
        opacity: 1;
    }
    
    /* Print styles */
    @media print {
        .no-print {
            display: none !important;
        }
        
        a[href]:after {
            content: " (" attr(href) ")";
        }
    }
    
    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;
document.head.appendChild(globalStyles);