"use strict";
// Giữ hai nhóm Vegetarian/Vegan của TheMealDB, gộp theo ID để không bị lặp.
document.addEventListener("DOMContentLoaded", () => setupFoodCatalog({ kind: "vegetarian", inputId: "vegetarian-search", buttonId: "vegetarian-search-btn", statusId: "vegetarian-status", listId: "vegetarian-list" }));