"use strict";
// Mặc định giữ danh sách Non_Alcoholic của TheCocktailDB; tìm tên vẫn dùng search.php.
document.addEventListener("DOMContentLoaded", () => setupFoodCatalog({ kind: "drink", inputId: "drink-search", buttonId: "drink-search-btn", statusId: "drink-api-status", listId: "api-drink-list" }));