// Tilt effect for selected cards
function attachTiltEffect(card) {
    const maxTilt = 6;
    const damp = 140;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const dx = (x - centerX) / damp;
        const dy = (y - centerY) / damp;

        const tiltX = (dy * maxTilt) * -1;
        const tiltY = dx * maxTilt;

        card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
}

// Section focus mode
function setupSectionFocus() {
    const sections = Array.from(document.querySelectorAll('.hover-section'));

    function setFocusSection(activeSection) {
        sections.forEach(sec => {
            if (!activeSection || sec === activeSection) {
                sec.classList.remove('dimmed');
            } else {
                sec.classList.add('dimmed');
            }
        });
    }

    sections.forEach(sec => {
        sec.addEventListener('mouseenter', () => setFocusSection(sec));
        sec.addEventListener('mouseleave', () => setFocusSection(null));
    });
}

// Flow timeline indicator
function setupFlowTimeline() {
    const indicator = document.getElementById('flowIndicator');
    if (!indicator) return;

    const steps = Array.from(document.querySelectorAll('.flow-step'));

    function moveIndicator(index) {
        const count = steps.length || 4;
        const segment = 1 / count;
        const translateX = index * segment;
        indicator.style.transform = `translateX(${translateX * 100}%)`;
    }

    steps.forEach((step, index) => {
        ['mouseenter', 'focus'].forEach(evt => {
            step.addEventListener(evt, () => moveIndicator(index));
        });
    });
}

// Hover state per group
function setupHoverCards() {
    const groups = Array.from(document.querySelectorAll('.interactive-group'));

    groups.forEach(group => {
        const cards = Array.from(group.querySelectorAll('.hover-card'));

        cards.forEach(card => {
            const isStep = card.classList.contains('step-card');
            const isFact = card.classList.contains('fact-card');
            const isPrinciple = card.classList.contains('principle-card');
            const isCommit = card.classList.contains('commit-card');

            card.addEventListener('mouseenter', () => {
                card.classList.add('is-hovered');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('is-hovered');
            });

            card.addEventListener('focus', () => {
                card.classList.add('is-hovered');
            });
            card.addEventListener('blur', () => {
                card.classList.remove('is-hovered');
            });

            // Tilt only on some groups
            if (isFact || isPrinciple || isCommit) {
                attachTiltEffect(card);
            }
            // Steps and gov cards rely on their own line/underline effects
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupHoverCards();
    setupSectionFocus();
    setupFlowTimeline();
});
