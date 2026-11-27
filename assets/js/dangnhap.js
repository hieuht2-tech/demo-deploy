"use strict";
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', event => {
  event.preventDefault();
  try {
    if (!loginForm.reportValidity()) return;
    DemoAuth.login(document.getElementById('username').value, document.getElementById('password').value);
    const next = new URLSearchParams(location.search).get('next');
    location.href = next === 'thanhtoan.html' ? next : 'quanlytaikhoan.html';
  } catch (error) { const feedback = document.getElementById('message'); feedback.className = 'alert alert-danger mt-3'; feedback.textContent = error.message; }
});
