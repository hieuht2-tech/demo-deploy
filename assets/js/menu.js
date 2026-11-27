"use strict";

function createMenuCard(item) {
  const column = document.createElement("div");
  column.className = "col-sm-6 col-lg-4";
  const card = document.createElement("article");
  card.className = "card food-card h-100";
  const image = document.createElement("img");
  image.className = "card-img-top";
  image.loading = "lazy";
  setRecipeImage(image, item.image, item.name);
  const body = document.createElement("div");
  body.className = "card-body d-flex flex-column";
  const title = document.createElement("h3");
  title.className = "h5 card-title";
  title.textContent = item.name;
  const text = document.createElement("p");
  text.className = "text-secondary small"; text.textContent = item.description;
  const price = document.createElement("p");
  price.className = "price mt-auto"; price.textContent = money(item.price);
  const button = document.createElement("button");
  button.className = "btn btn-orange"; button.type = "button"; button.textContent = "Thêm vào giỏ demo";
  button.addEventListener("click", () => {
    try { CartStore.add(item.id); showToast(`Đã thêm ${item.name}.`); }
    catch (error) { showToast(error.message); }
  });
  body.append(title, text, price, button); card.append(image, body); column.append(card);
  return column;
}

async function loadDemoMenu() {
  const list = document.querySelector("#menu-list");
  if (!list) return;
  list.setAttribute("aria-busy", "true");
  list.textContent = "Đang tải thực đơn...";
  try {
    const menu = await MenuAPI.all();
    const items = menu.filter(item => item.kind === list.dataset.kind);
    list.replaceChildren(...items.map(createMenuCard));
  } catch (error) { showRecipeError(list, error, loadDemoMenu); }
  finally { list.setAttribute("aria-busy", "false"); }
}
loadDemoMenu();
