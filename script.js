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

// Form handling
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Hide previous messages
    formSuccess.style.display = 'none';
    formError.style.display = 'none';

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // Create mailto link
    const subject = encodeURIComponent('Contato via Site - ' + formData.name);
    const body = encodeURIComponent(
        `Nome: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Telefone: ${formData.phone}\n\n` +
        `Mensagem:\n${formData.message}`
    );

    const mailtoLink = `mailto:oipandaapp@gmail.com?subject=${subject}&body=${body}`;

    // Open mailto link
    window.location.href = mailtoLink;

    // Show success message
    formSuccess.style.display = 'block';

    // Reset form
    contactForm.reset();

    // Scroll to success message
    setTimeout(() => {
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
});

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
    button.addEventListener('click', function() {
        if (this.tagName === 'BUTTON' && this.type === 'submit') {
            const originalText = this.innerHTML;
            this.innerHTML = '<span>Enviando...</span>';
            this.disabled = true;

            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 2000);
        }
    });
});
