"use strict";
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', event => {
  event.preventDefault(); const feedback = document.getElementById('message');
  try {
    if (!registerForm.reportValidity()) return;
    const data = {};
    for (const id of ['fullname','username','email','password','confirmPassword']) data[id] = document.getElementById(id).value;
    DemoAuth.register(data);
    feedback.className = 'alert alert-success mt-3';
    feedback.textContent = 'Đã tạo tài khoản demo. Bấm Đăng nhập để tiếp tục.';
    registerForm.reset();
  } catch (error) { feedback.className = 'alert alert-danger mt-3'; feedback.textContent = error.message; }
});
