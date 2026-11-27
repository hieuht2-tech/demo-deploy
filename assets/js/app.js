"use strict";

// Hàm dùng chung: định dạng tiền, thông báo, menu và badge; mỗi trang có file riêng.
function money(value) { return new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(value); }
function showToast(message) {
  document.querySelector(".success-toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "success-toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 2600);
}
function setupAccountMenu() {
  const nav = document.querySelector(".navbar .container");
  if (!nav || document.querySelector(".account-area")) return;
  const area = document.createElement("div");
  area.className = "account-area";
  // Khung cố định; tên/email bên dưới dùng textContent.
  area.innerHTML = '<button class="account-trigger" type="button" aria-label="Tài khoản" aria-expanded="false" aria-controls="account-menu">👤</button><div class="account-menu" id="account-menu"><div class="account-avatar">👤</div><div class="user-name">Khách</div><div class="user-email">Chưa đăng nhập</div><hr><a href="quanlytaikhoan.html">Quản lý tài khoản</a><a class="login-link" href="dangnhap.html">Đăng nhập</a><button class="logout-link" type="button" hidden>Đăng xuất</button></div>';
  nav.append(area);
  const user = DemoStore.currentUser();
  const trigger = area.querySelector(".account-trigger");
  const menu = area.querySelector(".account-menu");
  if (user) {
    const name = String(user.fullname || user.username || "Người dùng");
    const initial = name.trim().charAt(0).toUpperCase() || "U";
    trigger.textContent = initial;
    area.querySelector(".account-avatar").textContent = initial;
    area.querySelector(".user-name").textContent = name;
    area.querySelector(".user-email").textContent = String(user.email || user.username || "");
    area.querySelector(".login-link").hidden = true;
    area.querySelector(".logout-link").hidden = false;
  }
  function closeMenu() { menu.classList.remove("show"); trigger.setAttribute("aria-expanded", "false"); }
  trigger.addEventListener("click", () => { const open = menu.classList.toggle("show"); trigger.setAttribute("aria-expanded", String(open)); });
  document.addEventListener("click", event => { if (!area.contains(event.target)) closeMenu(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
  area.querySelector(".logout-link").addEventListener("click", () => { try { DemoStore.logout(); location.href = "index.html"; } catch (error) { showToast(error.message); } });
}
function updateCartBadge() {
  const count = CartStore.read().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('[data-cart-count]').forEach(badge => { badge.textContent = count; });
}
document.addEventListener('cart-updated', updateCartBadge);
window.addEventListener('storage', event => { if (event.key === 'cart') updateCartBadge(); });
document.addEventListener('DOMContentLoaded', () => {
  setupAccountMenu(); updateCartBadge();
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  menuToggle?.addEventListener('click', () => {
    const open = primaryNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && primaryNav?.classList.contains('is-open')) {
      primaryNav.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.focus();
    }
  });
  CartStore.migrate().then(updateCartBadge).catch(error => showToast(error.message));
  let page = location.pathname.split('/').pop() || 'index.html';
  if (page === 'chitiet.html') page = ({meal:'monan.html',drink:'douong.html',vegetarian:'dochay.html'})[new URLSearchParams(location.search).get('type') || 'meal'];
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    const active = link.getAttribute('href') === page;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
  });
});
