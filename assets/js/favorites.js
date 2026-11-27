"use strict";
const savedRoot = document.getElementById("saved-recipes");
const savedStatus = document.getElementById("saved-status");
let savedRequest = 0;
async function loadSavedRecipes() {
  const current = ++savedRequest;
  const saved = Favorites.read();
  savedRoot.replaceChildren(); savedRoot.setAttribute("aria-busy", "true");
  savedStatus.textContent = saved.length ? "Đang tải công thức đã lưu..." : "Chưa có công thức đã lưu. Mở chi tiết để thêm vào bộ sưu tập.";
  let failed = 0;
  for (let start = 0; start < saved.length; start += 3) {
    const group = saved.slice(start, start + 3);
    const results = await Promise.allSettled(group.map(item => FoodAPI.lookup(item.kind, item.id)));
    if (current !== savedRequest) return;
    results.forEach((result, index) => {
      const source = group[index];
      const column = result.status === "fulfilled" ? createRecipeCard(result.value) : document.createElement("div");
      if (result.status === "rejected") { column.className = "col-12 surface"; column.textContent = `Chưa tải được công thức ${source.id}.`; failed++; }
      const remove = document.createElement("button"); remove.className = "btn btn-outline-secondary btn-sm mt-2"; remove.textContent = "Bỏ lưu";
      remove.addEventListener("click", () => {
        try { if (Favorites.has(source.kind, source.id)) Favorites.toggle(source.kind, source.id); loadSavedRecipes(); }
        catch (error) { showToast(error.message); }
      });
      column.append(remove); savedRoot.append(column);
    });
  }
  savedRoot.setAttribute("aria-busy", "false");
  if (saved.length) savedStatus.textContent = failed ? `${failed} công thức chưa tải được. Bấm Tải lại để thử.` : `${saved.length} công thức đã lưu.`;
}
document.getElementById("reload-saved").addEventListener("click", loadSavedRecipes);
window.addEventListener("storage", event => { if (event.key === "foodMenuSavedRecipes") loadSavedRecipes(); });
loadSavedRecipes();
