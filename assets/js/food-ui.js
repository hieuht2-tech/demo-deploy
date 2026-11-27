"use strict";

// BƯỚC 2: Một object công thức -> một card, link luôn có cả type và id.
function createRecipeCard(item) {
  const column = document.createElement("div");
  column.className = "col-sm-6 col-lg-4 col-xl-3";
  const card = document.createElement("article");
  card.className = "card food-card h-100";
  const imageLink = document.createElement("a");
  imageLink.href = `chitiet.html?type=${encodeURIComponent(item.kind)}&id=${encodeURIComponent(item.id)}`;
  const image = document.createElement("img");
  image.className = "card-img-top";
  image.loading = "lazy";
  setRecipeImage(image, item.image, item.name);
  imageLink.append(image);
  const body = document.createElement("div");
  body.className = "card-body d-flex flex-column";
  const title = document.createElement("h3");
  title.className = "card-title h6";
  title.textContent = item.name;
  const meta = document.createElement("p");
  meta.className = "text-muted small";
  meta.textContent = [item.category, item.area].filter(Boolean).join(" · ");
  const rating = document.createElement("p");
  rating.className = "small text-muted";
  rating.textContent = FoodReviews.summary(item.kind, item.id);
  const link = document.createElement("a");
  link.className = "btn btn-orange mt-auto";
  link.href = imageLink.href;
  link.textContent = "Xem công thức & đánh giá";
  body.append(title, meta, rating, link);
  card.append(imageLink, body);
  column.append(card);
  return column;
}

function setRecipeImage(image, url, name) {
  image.onerror = () => { image.onerror = null; image.src = FOOD_CONFIG.PLACEHOLDER; };
  image.src = url || FOOD_CONFIG.PLACEHOLDER;
  image.alt = name;
}

function showRecipeError(container, error, retry) {
  container.replaceChildren();
  const message = document.createElement("p");
  message.className = "alert alert-danger";
  message.setAttribute("role", "alert");
  message.textContent = error.message || "Không tải được dữ liệu. Kiểm tra Internet và thử lại.";
  container.append(message);
  if (retry) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-orange";
    button.textContent = "Thử lại";
    button.addEventListener("click", retry);
    container.append(button);
  }
}
