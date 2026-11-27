"use strict";
// Trang món ăn giữ TheMealDB; luồng fetch/render dùng chung ở api.js/catalog.js.
document.addEventListener("DOMContentLoaded", () => setupFoodCatalog({ kind: "meal", inputId: "meal-search", buttonId: "meal-search-btn", statusId: "api-status", listId: "api-meal-list" }));