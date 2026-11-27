"use strict";
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const feedback = document.getElementById("contact-feedback");
  try {
    if (!contactForm.reportValidity()) return;
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim().toLowerCase();
    const phone = document.getElementById("contact-phone").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    if (!DemoValidate.text(name, 2, 60)) throw new Error("Họ tên cần từ 2 đến 60 ký tự.");
    if (!DemoValidate.email(email)) throw new Error("Email chưa hợp lệ.");
    if (phone && !DemoValidate.phone(phone)) throw new Error("Số điện thoại chưa hợp lệ.");
    if (!DemoValidate.text(message, 10, 1000)) throw new Error("Nội dung cần từ 10 đến 1.000 ký tự.");
    const messages = DemoStore.list("foodMenuMessages");
    messages.push({ name, email, phone, message, date: new Date().toISOString() });
    DemoStore.write("foodMenuMessages", messages);
    feedback.textContent = "Đã lưu lời nhắn demo trên trình duyệt này. Chưa gửi email hoặc gửi đến server.";
    feedback.className = "alert alert-success mt-3"; contactForm.reset();
  } catch (error) { feedback.className = "alert alert-danger mt-3"; feedback.textContent = error.message; }
});
