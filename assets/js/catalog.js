"use strict";

// Một luồng cho ba trang: fetch -> mảng -> sắp xếp -> slice -> card DOM.
function setupFoodCatalog({ kind, inputId, buttonId, statusId, listId }) {
  const input = document.getElementById(inputId), button = document.getElementById(buttonId);
  const status = document.getElementById(statusId), list = document.getElementById(listId);
  const sort = document.getElementById('recipe-sort'), more = document.getElementById('more-recipes');
  let requestNumber = 0, items = [], visible = 12, ready = false;
  function render() {
    const sorted = [...items];
    if (sort.value === 'name') sorted.sort((a,b) => a.name.localeCompare(b.name));
    if (sort.value === 'rating') sorted.sort((a,b) => {
      const average = item => { const rows = FoodReviews.list(item.kind,item.id); return rows.length ? rows.reduce((sum,row)=>sum+row.stars,0)/rows.length : 0; };
      return average(b)-average(a);
    });
    list.replaceChildren(...sorted.slice(0,visible).map(createRecipeCard));
    status.textContent = items.length ? 'Đang hiện ' + Math.min(visible,items.length) + '/' + items.length + ' công thức.' : 'Không có kết quả. Hãy thử tên tiếng Anh khác.';
    more.hidden = visible >= items.length;
  }
  async function load() {
    const current = ++requestNumber; ready = false;
    status.textContent = 'Đang tải công thức...'; list.replaceChildren(); more.hidden = true;
    list.setAttribute('aria-busy','true'); sort.disabled = true;
    try {
      const result = await FoodAPI.search(kind,input.value);
      if (current !== requestNumber) return;
      items = result; visible = 12; ready = true; render();
    } catch (error) {
      if (current !== requestNumber) return;
      status.textContent = 'Chưa tải được công thức.'; showRecipeError(list,error,load);
    } finally { if(current===requestNumber) { list.setAttribute('aria-busy','false'); sort.disabled = false; } }
  }
  button.addEventListener('click',load);
  input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();load();}});
  sort.addEventListener('change',()=>{if(ready)render();});
  more.addEventListener('click',()=>{visible+=12;render();});
  window.addEventListener('storage',event=>{if(ready&&event.key===FOOD_CONFIG.REVIEW_KEYS[kind])render();});
  window.addEventListener('pageshow',()=>{if(ready)render();});
  load();
}
