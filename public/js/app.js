// Main JavaScript for Mindbridge Application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // FIX: Modal stacking context issue - Move modals to body when shown
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modalEl => {
        modalEl.addEventListener('show.bs.modal', function () {
            // Only move if modal is not already a direct child of body
            if (this.parentElement !== document.body) {
                document.body.appendChild(this);
            }
        });
    });

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.classList.add('fade');
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 150);
            }
        }, 5000);
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Password strength checker
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength mt-1';
        passwordInput.parentNode.appendChild(strengthIndicator);

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            updatePasswordStrengthIndicator(strengthIndicator, strength);
        });
    }

    // Real-time form validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this);
        });
    });

    // File upload preview
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            handleFilePreview(e.target);
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

    // Dark mode toggle (if implemented)
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
        });

        // Load saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    // Search functionality
    const searchInputs = document.querySelectorAll('[data-search]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const targetSelector = this.dataset.search;
            const items = document.querySelectorAll(targetSelector);
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Auto-save form data
    const autoSaveForms = document.querySelectorAll('[data-autosave]');
    autoSaveForms.forEach(form => {
        const formId = form.id;
        if (formId) {
            // Load saved data
            loadFormData(form, formId);
            
            // Save on input
            form.addEventListener('input', function() {
                saveFormData(form, formId);
            });
        }
    });

    // Loading states for buttons
    const loadingButtons = document.querySelectorAll('[data-loading]');
    loadingButtons.forEach(button => {
        button.addEventListener('click', function() {
            setButtonLoading(this, true);
            
            // Reset after 5 seconds (fallback)
            setTimeout(() => {
                setButtonLoading(this, false);
            }, 5000);
        });
    });

    // Copy to clipboard functionality
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.dataset.copy;
            const element = document.querySelector(target);
            if (element) {
                copyToClipboard(element.textContent);
                showToast('Kopyalandı!', 'success');
            }
        });
    });

    // Initialize animations on scroll
    observeIntersection();
});

// Password strength checker function
function checkPasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password)
    };

    Object.values(checks).forEach(check => {
        if (check) score++;
    });

    if (score < 2) return 'weak';
    if (score < 4) return 'medium';
    return 'strong';
}

// Update password strength indicator
function updatePasswordStrengthIndicator(indicator, strength) {
    const colors = {
        weak: '#dc3545',
        medium: '#ffc107',
        strong: '#198754'
    };

    const texts = {
        weak: 'Zayıf',
        medium: 'Orta',
        strong: 'Güçlü'
    };

    indicator.innerHTML = `
        <small style="color: ${colors[strength]}">
            Şifre gücü: ${texts[strength]}
        </small>
    `;
}

// Email validation
function validateEmail(input) {
    const email = input.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        input.setCustomValidity('Geçerli bir e-posta adresi girin');
        input.classList.add('is-invalid');
    } else {
        input.setCustomValidity('');
        input.classList.remove('is-invalid');
        if (email) input.classList.add('is-valid');
    }
}

// File preview handler
function handleFilePreview(input) {
    const file = input.files[0];
    if (!file) return;

    const preview = document.createElement('div');
    preview.className = 'file-preview mt-2';

    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'img-thumbnail';
        img.style.maxWidth = '200px';
        img.style.maxHeight = '200px';
        preview.appendChild(img);
    } else {
        preview.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-file me-2"></i>
                ${file.name} (${formatFileSize(file.size)})
            </div>
        `;
    }

    // Remove existing preview
    const existingPreview = input.parentNode.querySelector('.file-preview');
    if (existingPreview) {
        existingPreview.remove();
    }

    input.parentNode.appendChild(preview);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Save form data to localStorage
function saveFormData(form, formId) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (form.querySelector(`[name="${key}"]`).type !== 'password') {
            data[key] = value;
        }
    }
    
    localStorage.setItem(`form_${formId}`, JSON.stringify(data));
}

// Load form data from localStorage
function loadFormData(form, formId) {
    const savedData = localStorage.getItem(`form_${formId}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'password') {
                input.value = data[key];
            }
        });
    }
}

// Set button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Yükleniyor...';
        button.disabled = true;
    } else {
        button.innerHTML = button.dataset.originalText || button.innerHTML;
        button.disabled = false;
    }
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// Intersection Observer for animations
function observeIntersection() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

// Debounce function for performance
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

// Throttle function for performance
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

// Format date for display
function formatDate(date, format = 'DD/MM/YYYY') {
    if (typeof moment !== 'undefined') {
        return moment(date).format(format);
    }
    // Fallback without moment.js
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR');
}

// Export functions for use in other files
window.MindBridge = {
    showToast,
    copyToClipboard,
    setButtonLoading,
    formatFileSize,
    formatDate,
    debounce,
    throttle
}; 