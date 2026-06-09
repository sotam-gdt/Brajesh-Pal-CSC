// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Sticky header shadow on scroll
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  header.style.boxShadow = window.scrollY > 10
    ? '0 4px 20px rgba(0,0,0,.15)'
    : '0 2px 12px rgba(0,0,0,.08)';
});

// Contact form – simple local feedback (no backend needed for static site)
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = '✅ Thank you! We will contact you shortly.';
  this.reset();
  setTimeout(() => { note.textContent = ''; }, 5000);
});

// Smooth active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('nav ul a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.background = a.getAttribute('href') === '#' + current ? 'var(--blue)' : '';
    a.style.color = a.getAttribute('href') === '#' + current ? 'white' : '';
  });
});
