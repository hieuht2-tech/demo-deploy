"use strict";

// BƯỚC 4: Trang chi tiết đọc loại + ID, lookup đầy đủ, không dùng card lọc làm chi tiết.
const detailParams = new URLSearchParams(location.search);
const detailKind = detailParams.get("type") || "meal";
const detailId = detailParams.get("id");
const detailRoot = document.querySelector("#recipe-detail");
const detailTypes = { meal: { label: "Món ăn", page: "monan.html" }, vegetarian: { label: "Món chay", page: "dochay.html" }, drink: { label: "Đồ uống", page: "douong.html" } };

function renderRecipeReviews() {
  const box = document.querySelector("#recipe-reviews");
  box.replaceChildren();
  const reviews = FoodReviews.list(detailKind, detailId);
  document.querySelector("#recipe-rating").textContent = FoodReviews.summary(detailKind, detailId);
  if (!reviews.length) { box.textContent = "Chưa có đánh giá. Bạn có thể viết nhận xét đầu tiên."; return; }
  reviews.slice().reverse().forEach(review => {
    const article = document.createElement("article");
    article.className = "review-item";
    const heading = document.createElement("strong");
    heading.textContent = `${review.name} · ${"★".repeat(review.stars)}${"☆".repeat(5 - review.stars)}`;
    const text = document.createElement("p");
    text.className = "mb-1";
    text.textContent = review.comment;
    const date = document.createElement("small");
    date.className = "text-muted";
    date.textContent = review.date;
    article.append(heading, text, date);
    box.append(article);
  });
}

function renderRecipeDetail(item) {
  const view = document.querySelector("#recipe-detail-template").content.cloneNode(true);
  view.querySelector(".recipe-title").textContent = item.name;
  view.querySelector(".recipe-meta").textContent = [item.category, item.area].filter(Boolean).join(" · ");
  setRecipeImage(view.querySelector(".recipe-image"), item.image, item.name);
  view.querySelector(".recipe-directions").textContent = item.instructions;
  const ingredients = view.querySelector(".recipe-ingredients");
  if (!item.ingredients.length) ingredients.textContent = "Nguồn chưa cung cấp nguyên liệu.";
  item.ingredients.forEach(ingredient => {
    const li = document.createElement("li");
    li.textContent = [ingredient.measure, ingredient.name].filter(Boolean).join(" ");
    ingredients.append(li);
  });
  const source = view.querySelector(".recipe-source");
  source.hidden = !item.sourceURL;
  if (item.sourceURL) source.href = item.sourceURL;
  const video = view.querySelector(".recipe-video");
  video.hidden = !item.videoURL;
  if (item.videoURL) video.href = item.videoURL;
  const form = view.querySelector("#recipe-review-form");
  const feedback = view.querySelector("#review-feedback");
  form.addEventListener("submit", event => {
    event.preventDefault();
    try {
      const stars = Number(form.querySelector('[name="stars"]').value);
      const comment = form.querySelector('[name="comment"]');
      FoodReviews.add(detailKind, detailId, stars, comment.value);
      comment.value = "";
      feedback.className = "text-success mt-3";
      feedback.textContent = "Đã lưu đánh giá trên trình duyệt này.";
      renderRecipeReviews();
    } catch (error) { feedback.className = "text-danger mt-3"; feedback.textContent = error.message; }
  });
  detailRoot.replaceChildren(view);
  document.title = `${item.name} | Food Menu`;
  document.querySelector("#recipe-breadcrumb").textContent = item.name;
  renderRecipeReviews();
}

async function loadRecipeDetail() {
  detailRoot.textContent = "Đang tải chi tiết công thức...";
  detailRoot.setAttribute("aria-busy", "true");
  try {
    if (!Object.hasOwn(detailTypes, detailKind) || !/^\d{1,8}$/.test(detailId || "")) throw new Error("Đường dẫn món ăn không hợp lệ. Hãy chọn lại từ danh sách.");
    const back = document.querySelector("#recipe-back");
    back.href = detailTypes[detailKind].page;
    back.textContent = detailTypes[detailKind].label;
    const item = await FoodAPI.lookup(detailKind, detailId);
    renderRecipeDetail(item);
  } catch (error) { showRecipeError(detailRoot, error, Object.hasOwn(detailTypes, detailKind) && /^\d{1,8}$/.test(detailId || "") ? loadRecipeDetail : null); }
  finally { detailRoot.setAttribute("aria-busy", "false"); }
}

window.addEventListener("storage", event => {
  if (event.key === FOOD_CONFIG.REVIEW_KEYS[detailKind] && document.querySelector("#recipe-reviews")) renderRecipeReviews();
});
loadRecipeDetail();
