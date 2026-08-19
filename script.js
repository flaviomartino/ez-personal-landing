// Configuration
const API_URL = 'https://app.ezpersonal.com.br/api/turma-zero/signup';

// Form handling - Turma Zero
const turmaZeroForm = document.getElementById('turmaZeroForm');
const formError = document.getElementById('formError');
const mainSection = document.getElementById('mainSection');
const thankYouSection = document.getElementById('thankYouSection');
const submitBtn = turmaZeroForm?.querySelector('button[type="submit"]');

if (turmaZeroForm && submitBtn) {
    turmaZeroForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Hide any previous errors
        if (formError) {
            formError.style.display = 'none';
        }

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            city: document.getElementById('city').value.trim() || undefined,
            source: 'Turma Zero Landing Page'
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.phone) {
            showError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Show loading state
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Enviando...</span>';
        submitBtn.disabled = true;

        try {
            // Send to API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro ao enviar: ${response.status}`);
            }

            const result = await response.json();

            // Track event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'turma_zero_signup', {
                    'event_category': 'engagement',
                    'event_label': formData.city || 'não informado'
                });
            }

            // Show thank you page
            showThankYouPage();

        } catch (error) {
            console.error('Error submitting form:', error);
            showError(
                'Ops! Algo deu errado. Por favor, tente novamente ou entre em contato pelo WhatsApp.'
            );

            // Re-enable button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });
}

function showError(message) {
    if (formError) {
        formError.textContent = message;
        formError.style.display = 'block';

        // Scroll to error
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showThankYouPage() {
    if (mainSection && thankYouSection) {
        mainSection.style.display = 'none';
        thankYouSection.style.display = 'block';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
