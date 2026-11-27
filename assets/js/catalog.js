"use strict";

// BƯỚC 3: Ba trang dùng cùng luồng render, chỉ khác loại và các ID HTML.
function setupFoodCatalog({ kind, inputId, buttonId, statusId, listId }) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const status = document.getElementById(statusId);
  const list = document.getElementById(listId);
  if (!input || !button || !status || !list) return;
  input.setAttribute("aria-label", "Tìm công thức theo tên tiếng Anh");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  let requestNumber = 0;
  let items = [];

  function render() {
    list.replaceChildren();
    items.forEach(item => list.append(createRecipeCard(item)));
    status.textContent = items.length ? `Tìm thấy ${items.length} công thức.` : "Không có kết quả. Hãy thử tên tiếng Anh khác.";
  }

  async function load() {
    // Kết quả từ request cũ không được ghi đè request mới nếu người dùng tìm liên tiếp.
    const current = ++requestNumber;
    status.textContent = "Đang tải công thức...";
    list.replaceChildren();
    list.setAttribute("aria-busy", "true");
    try {
      const result = await FoodAPI.search(kind, input.value);
      if (current !== requestNumber) return;
      items = result;
      render();
    } catch (error) {
      if (current !== requestNumber) return;
      status.textContent = "Chưa tải được công thức.";
      showRecipeError(list, error, load);
    } finally { if (current === requestNumber) list.setAttribute("aria-busy", "false"); }
  }

  button.addEventListener("click", load);
  input.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); load(); } });
  window.addEventListener("storage", event => {
    if (event.key === FOOD_CONFIG.REVIEW_KEYS[kind]) render();
  });
  window.addEventListener("pageshow", () => { if (items.length) render(); });
  load();
}
