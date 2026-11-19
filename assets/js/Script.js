'use strict';

document.addEventListener('DOMContentLoaded', function () {
  // Logout button (optional, exists on some pages)
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', async function (event) {
      event.preventDefault();
      if (window.mockApi) await window.mockApi.auth.logout();
      window.location.href = 'Login.html';
    });
  }
});

// ── Navbar toggle ──────────────────────────────────────────────────────────────
const navbar    = document.querySelector('[data-navbar]');
const navToggler= document.querySelectorAll('[data-nav-toggler]');
const navLinks  = document.querySelectorAll('[data-nav-link]');
const overlay   = document.querySelector('[data-overlay]');

for (let i = 0; i < navToggler.length; i++) {
  navToggler[i].addEventListener('click', function () {
    if (navbar)  navbar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
  });
}
for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener('click', function () {
    if (navbar)  navbar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  });
}

// ── Scroll effects ─────────────────────────────────────────────────────────────
const header    = document.querySelector('[data-header]');
const backTopBtn= document.querySelector('[data-back-top-btn]');

window.addEventListener('scroll', function () {
  if (!header) return;
  if (window.scrollY >= 100) {
    header.classList.add('active');
    if (backTopBtn) backTopBtn.classList.add('active');
  } else {
    header.classList.remove('active');
    if (backTopBtn) backTopBtn.classList.remove('active');
  }
});
