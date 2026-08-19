// Smooth scroll
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

// Form handling - Turma Zero
const turmaZeroForm = document.getElementById('turmaZeroForm');
const formSuccess = document.getElementById('formSuccess');

if (turmaZeroForm) {
    turmaZeroForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value || 'Não informado',
            source: 'Turma Zero Landing Page'
        };

        // Create mailto link
        const subject = encodeURIComponent('Inscrição Turma Zero - ' + formData.name);
        const body = encodeURIComponent(
            `NOVA INSCRIÇÃO - TURMA ZERO\n\n` +
            `Nome: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `WhatsApp: ${formData.phone}\n` +
            `Cidade: ${formData.city}\n\n` +
            `---\n` +
            `Inscrito via: ${formData.source}\n` +
            `Data: ${new Date().toLocaleString('pt-BR')}`
        );

        const mailtoLink = `mailto:oipandaapp@gmail.com?subject=${subject}&body=${body}`;

        // Open mailto link
        window.location.href = mailtoLink;

        // Show success message
        formSuccess.style.display = 'block';
        turmaZeroForm.style.display = 'none';

        // Scroll to success message
        setTimeout(() => {
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

        // Optional: Send to analytics or tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'turma_zero_signup', {
                'event_category': 'engagement',
                'event_label': formData.city
            });
        }
    });
}

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.style.boxShadow = 'none';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(button => {
    if (button.tagName === 'BUTTON' && button.type === 'submit') {
        button.addEventListener('click', function() {
            const originalHTML = this.innerHTML;
            this.innerHTML = '<span>Enviando...</span>';
            this.disabled = true;

            // Re-enable after form submission
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.disabled = false;
            }, 3000);
        });
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.step, .problem-card, .benefit-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});
