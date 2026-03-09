const profileToggle = document.getElementById('profileToggle');
const profilePanel = document.getElementById('profilePanel');

// Toggle panel on click
profileToggle.addEventListener('click', () => {
    profilePanel.classList.toggle('open');
});

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (!profileToggle.contains(e.target) && !profilePanel.contains(e.target)) {
        profilePanel.classList.remove('open');
    }
});
