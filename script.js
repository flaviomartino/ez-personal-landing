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

        // Optional: Send to analytics or tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'turma_zero_signup', {
                'event_category': 'engagement',
                'event_label': formData.city
            });
        }
    });
}

// Add loading state to submit button
const submitBtn = turmaZeroForm?.querySelector('button[type="submit"]');
if (submitBtn) {
    turmaZeroForm.addEventListener('submit', function() {
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Enviando...</span>';
        submitBtn.disabled = true;

        // Re-enable after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }, 3000);
    });
}
