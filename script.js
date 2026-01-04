document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== 1. ENFORCE HIGH CONTRAST (THE FIX) ====================
    function enhanceAccessibility() {
        console.log('Running High Contrast Enforcer...');
        
        // Fix headings colors
        document.querySelectorAll('h1, h2, h3, h4, h5').forEach(el => {
            el.style.color = '#002171'; // Dark Blue
            el.style.fontWeight = '700';
        });

        // Fix paragraph readability
        document.querySelectorAll('p, li').forEach(el => {
            if (!el.classList.contains('text-white')) {
                el.style.color = '#2c3e50'; // Dark Slate
            }
        });

        // Ensure badges are readable
        document.querySelectorAll('.badge').forEach(badge => {
            if (badge.classList.contains('bg-light')) {
                badge.style.color = '#000000';
                badge.style.border = '1px solid #ccc';
            }
        });

        // Make input placeholders visible
        document.querySelectorAll('input, textarea').forEach(input => {
            input.style.color = '#000000';
            input.style.borderColor = '#aaa';
        });
        
        console.log('Contrast enhanced.');
    }

    // Run immediately and after a short delay to catch dynamic elements
    enhanceAccessibility();
    setTimeout(enhanceAccessibility, 1000);

    // ==================== 2. LOADING OVERLAY ====================
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        window.onload = () => {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => loadingOverlay.remove(), 500);
            }, 500);
        };
    }

    // ==================== 3. NAVBAR SCROLL EFFECT ====================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('shadow-md');
        }
    });

    // ==================== 4. BACK TO TOP BUTTON ====================
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== 5. FORM VALIDATION & SUBMISSION ====================
    const form = document.getElementById('appointmentForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic Validation
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                    // Add error message text
                    const errorDiv = input.nextElementSibling;
                    if(errorDiv && errorDiv.classList.contains('invalid-feedback')) {
                        errorDiv.textContent = 'Harap isi bidang ini dengan benar.';
                    }
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });

            if (!isValid) return;

            // Simulate Submission
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            btn.disabled = true;

            setTimeout(() => {
                // Success Logic
                document.getElementById('successMessage').classList.remove('d-none');
                document.getElementById('successMessage').textContent = 'Janji temu berhasil dikirim! Kami akan menghubungi Anda segera.';
                document.getElementById('errorMessage').classList.add('d-none');
                
                form.reset();
                inputs.forEach(i => i.classList.remove('is-valid'));
                
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                // Re-run accessibility check on new messages
                enhanceAccessibility();
            }, 1500);
        });

        // Real-time validation removal
        form.querySelectorAll('.form-control, .form-select').forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }

    // ==================== 6. DYNAMIC YEAR ====================
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ==================== 7. SMOOTH SCROLLING FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    document.querySelector('.navbar-toggler').click();
                }

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});