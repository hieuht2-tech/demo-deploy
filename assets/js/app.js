"use strict";

// Giữ giỏ thực đơn mẫu của học sinh trong key cart; công thức API không tự có giá.
function readCart() {
  try {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!Array.isArray(data)) return [];
    return data.filter(item => item && typeof item.name === "string" && Number.isFinite(Number(item.price)) && Number(item.price) >= 0 && Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0)
      .map(item => ({ name: item.name, price: Number(item.price), quantity: Math.min(Number(item.quantity), 99) }));
  } catch { return []; }
}
let cart = readCart();
function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); updateCartBadge(); }
function money(value) { return Number(value).toLocaleString("vi-VN") + "đ"; }
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }
function showToast(message) {
  document.querySelector(".success-toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "success-toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 2600);
}
function addToCart(name, price) {
  if (!name || !Number.isFinite(Number(price)) || Number(price) < 0) return;
  const previous = cart.map(item => ({ ...item }));
  const item = cart.find(item => item.name === name);
  if (item && item.quantity >= 99) { showToast("Mỗi món tối đa 99 phần trong bài demo."); return; }
  if (item) item.quantity++;
  else cart.push({ name, price: Number(price), quantity: 1 });
  try { saveCart(); showToast(`Đã thêm ${name} vào giỏ hàng!`); }
  catch { cart = previous; showToast("Không lưu được giỏ. Hãy kiểm tra quyền Local Storage."); }
}
function changeQuantity(index, value) {
  const quantity = Number(value);
  if (!cart[index]) return;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) { showToast("Số lượng phải là số nguyên từ 1 đến 99."); displayCart(); return; }
  const previous = cart[index].quantity;
  cart[index].quantity = quantity;
  try { saveCart(); displayCart(); }
  catch { cart[index].quantity = previous; showToast("Không lưu được thay đổi."); displayCart(); }
}
function removeItem(index) {
  if (!confirm("Bạn có chắc muốn xóa món này khỏi giỏ hàng?")) return;
  const previous = [...cart];
  cart.splice(index, 1);
  try { saveCart(); displayCart(); }
  catch { cart = previous; showToast("Không lưu được thay đổi."); }
}
function displayCart() {
  const table = document.getElementById("cart-list");
  if (!table) return;
  table.replaceChildren();
  let total = 0;
  if (!cart.length) table.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">Giỏ hàng đang trống. Hãy chọn món bạn yêu thích nhé!</td></tr>';
  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    const row = document.createElement("tr");
    // Mọi chữ từ storage cần escape trước khi ghép vào HTML.
    row.innerHTML = `<td>${index + 1}</td><td class="fw-semibold">${escapeHTML(item.name)}</td><td><input type="number" min="1" max="99" step="1" value="${item.quantity}" class="form-control text-center mx-auto" style="max-width:85px" aria-label="Số lượng ${escapeHTML(item.name)}"></td><td>${money(item.price)}</td><td class="fw-bold">${money(subtotal)}</td><td><button class="btn btn-sm btn-outline-danger" type="button">Xóa</button></td>`;
    row.querySelector("input").addEventListener("change", event => changeQuantity(index, event.target.value));
    row.querySelector("button").addEventListener("click", () => removeItem(index));
    table.append(row);
  });
  const totalElement = document.getElementById("total-money");
  if (totalElement) totalElement.textContent = money(total);
  updateCartBadge();
}
function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach(element => { element.textContent = count; });
}
function setupAccountMenu() {
  const nav = document.querySelector(".navbar .container");
  if (!nav || document.querySelector(".account-area")) return;
  const area = document.createElement("div");
  area.className = "account-area";
  // Khung cố định; tên/email bên dưới dùng textContent.
  area.innerHTML = '<button class="account-trigger" type="button" aria-label="Tài khoản" aria-expanded="false" aria-controls="account-menu">👤</button><div class="account-menu" id="account-menu"><div class="account-avatar">👤</div><div class="user-name">Khách</div><div class="user-email">Chưa đăng nhập</div><hr><a href="quanlytaikhoan.html">Quản lý tài khoản</a><a class="login-link" href="dangnhap.html">Đăng nhập</a><button class="logout-link" type="button" hidden>Đăng xuất</button></div>';
  nav.append(area);
  let user = null;
  try { const value = JSON.parse(localStorage.getItem("currentUser") || "null"); if (value && typeof value === "object" && !Array.isArray(value)) user = value; } catch {}
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
  area.querySelector(".logout-link").addEventListener("click", () => { localStorage.removeItem("currentUser"); location.href = "index.html"; });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-add-cart]").forEach(button => button.addEventListener("click", () => addToCart(button.dataset.name, button.dataset.price)));
  displayCart(); updateCartBadge(); setupAccountMenu();
  let page = location.pathname.split("/").pop() || "index.html";
  if (page === "chitiet.html") page = ({meal:"monan.html",vegetarian:"dochay.html",drink:"douong.html"})[new URLSearchParams(location.search).get("type") || "meal"] || "monan.html";
  document.querySelectorAll(".navbar .nav-link").forEach(link => {
    const active = link.getAttribute("href") === page;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
  });
  try { if (sessionStorage.getItem("loginSuccess") === "true") { showToast("Đăng nhập thành công!"); sessionStorage.removeItem("loginSuccess"); } } catch {}
});
window.addEventListener("storage", event => { if (event.key === "cart") { cart = readCart(); displayCart(); updateCartBadge(); } });