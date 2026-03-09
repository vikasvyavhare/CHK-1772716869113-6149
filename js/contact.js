const form = document.getElementById('contactForm');
const statusBox = document.getElementById('formStatus');
const submitBtn = form.querySelector('.submit-btn');

function setError(input, message) {
  const group = input.closest('.form-group');
  const errorSpan = group ? group.querySelector('.error') : null;
  if (errorSpan) errorSpan.textContent = message || '';
  input.style.borderColor = message ? '#ef4444' : 'rgba(55,65,81,0.95)';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 1) Frontend validation
  const requiredFields = [
    'fullName',
    'email',
    'relation',
    'topic',
    'urgency',
    'subject',
    'details'
  ];

  let valid = true;

  requiredFields.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    if (!input.value.trim()) {
      setError(input, 'This field is required');
      valid = false;
    } else {
      setError(input, '');
    }
  });

  const emailInput = document.getElementById('email');
  const emailVal = emailInput.value.trim();
  if (emailVal && !/^\S+@\S+\.\S+$/.test(emailVal)) {
    setError(emailInput, 'Please enter a valid email address');
    valid = false;
  }

  const consent = document.getElementById('consent');
  const consentGroup = consent.closest('.form-group');
  const consentError = consentGroup.querySelector('.error');
  if (!consent.checked) {
    consentError.textContent = 'Please confirm before submitting';
    valid = false;
  } else {
    consentError.textContent = '';
  }

  if (!valid) {
    statusBox.textContent = 'Please correct the highlighted fields and try again.';
    statusBox.className = 'form-status error';
    return;
  }

  // 2) Build payload to send to backend
  const payload = {
    fullName: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    relation: document.getElementById('relation').value,
    topic: document.getElementById('topic').value,
    ticketId: document.getElementById('ticketId').value.trim(),
    urgency: document.getElementById('urgency').value,
    subject: document.getElementById('subject').value.trim(),
    details: document.getElementById('details').value.trim(),
    preferredChannel: document.getElementById('preferredChannel').value,
    timeWindow: document.getElementById('timeWindow').value
  };

  // 3) Call backend API (Node + MongoDB)
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  statusBox.className = 'form-status';
  statusBox.style.display = 'none';

  try {
    const res = await fetch('http://localhost:4000/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit ticket');
    }

    statusBox.textContent =
      `Your request has been recorded in SDGRS. Reference ID: ${data.reference}`;
    statusBox.className = 'form-status success';
    form.reset();
  } catch (err) {
    console.error(err);
    statusBox.textContent =
      'Could not submit your request. Please check your connection or try again later.';
    statusBox.className = 'form-status error';
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});
