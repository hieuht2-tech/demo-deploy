"use strict";
async function loadHomeRecipes() {
  const list = document.getElementById("home-recipes");
  const status = document.getElementById("home-status");
  status.textContent = "Đang tìm cảm hứng cho bữa ăn...";
  list.setAttribute("aria-busy", "true");
  try {
    const recipes = await FoodAPI.search("meal");
    list.replaceChildren(...recipes.slice(0, 4).map(createRecipeCard));
    status.textContent = recipes.length ? "Công thức tham khảo từ TheMealDB." : "Nguồn chưa có công thức.";
  } catch (error) { status.textContent = ""; showRecipeError(list, error, loadHomeRecipes); }
  finally { list.setAttribute("aria-busy", "false"); }
}
loadHomeRecipes();
