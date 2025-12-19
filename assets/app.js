(() => {
  const body = document.body;
  const gate = document.querySelector('.gate');
  const gateButton = document.getElementById('gate-open');
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const gatedBlocks = document.querySelectorAll('.gated-items');

  const unlock = () => {
    body.classList.remove('locked');
    gatedBlocks.forEach((section) => section.setAttribute('aria-hidden', 'false'));
    if (gate) {
      gate.setAttribute('aria-hidden', 'true');
      gate.classList.add('hidden');
    }
    sessionStorage.setItem('access_unlocked', '1');
  };

  if (sessionStorage.getItem('access_unlocked') === '1') {
    unlock();
  }

  if (gateButton) {
    gateButton.addEventListener('click', () => {
      const contact = document.getElementById('contact');
      if (contact) {
        contact.scrollIntoView({ behavior: 'smooth' });
      }
      const nameField = document.getElementById('name');
      if (nameField) {
        nameField.focus();
      }
    });
  }

  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Submitting...';
    const formData = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        status.textContent = 'Access granted. Full profile unlocked.';
        form.reset();
        unlock();
        return;
      }

      const data = await response.json();
      if (data && data.errors) {
        status.textContent = data.errors.map((error) => error.message).join(' ');
      } else {
        status.textContent = 'Submission failed. Try again later.';
      }
    } catch (err) {
      status.textContent = 'Submission failed. Check your connection and try again.';
    }
  });
})();
