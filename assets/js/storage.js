"use strict";

// Dữ liệu demo thuộc trình duyệt và tên miền hiện tại, không phải cơ sở dữ liệu server.
const DemoStore = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { throw new Error("Trình duyệt không lưu được dữ liệu. Hãy kiểm tra quyền lưu trữ."); }
  },
  list(key) {
    const data = this.read(key, []);
    return Array.isArray(data) ? data : [];
  },
  currentUser() {
    const user = this.read("currentUser", null);
    return user && typeof user.username === "string" && typeof user.email === "string" ? user : null;
  },
  logout() {
    try { localStorage.removeItem("currentUser"); }
    catch { throw new Error("Không lưu được trạng thái đăng xuất."); }
  }
};

const DemoValidate = {
  email(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); },
  phone(value) { return /^(0\d{9}|\+84\d{9})$/.test(value.replace(/[\s.-]/g, "")); },
  text(value, min, max) { const size = value.trim().length; return size >= min && size <= max; }
};
