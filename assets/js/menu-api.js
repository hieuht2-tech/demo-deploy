"use strict";

// JSON local cũng được lấy qua HTTP khi chạy Live Server/GitHub Pages.
// Giá thuộc thực đơn demo của quán, không phải giá từ API công thức.
const MenuAPI = (() => {
  let cached;
  async function all() {
    if (!cached) cached = fetch("data/menu.json")
      .then(response => {
        if (!response.ok) throw new Error(`Không tải được thực đơn (HTTP ${response.status}).`);
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.some(item => !item || typeof item.id !== "string" || typeof item.name !== "string" || !Number.isInteger(item.price) || item.price < 0)) {
          throw new Error("Thực đơn không đúng cấu trúc.");
        }
        return data;
      }).catch(error => { cached = null; throw error; });
    return cached;
  }
  return { all };
})();
