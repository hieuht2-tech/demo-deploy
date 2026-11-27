"use strict";

// Giữ các key cũ để đánh giá đã lưu vẫn xuất hiện sau khi sắp xếp project.
const FoodReviews = {
  read(kind) {
    try {
      const value = JSON.parse(localStorage.getItem(FOOD_CONFIG.REVIEW_KEYS[kind]) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch { return {}; }
  },
  list(kind, id) {
    const list = this.read(kind)[id];
    if (!Array.isArray(list)) return [];
    return list.filter(item => item && Number.isInteger(Number(item.stars)) && Number(item.stars) >= 1 && Number(item.stars) <= 5 && typeof item.comment === "string")
      .map(item => ({ stars: Number(item.stars), comment: item.comment.slice(0, 500), name: String(item.name || "Khách hàng").slice(0, 80), date: String(item.date || "") }));
  },
  summary(kind, id) {
    const reviews = this.list(kind, id);
    return reviews.length ? `★ ${(reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length).toFixed(1)}/5 · ${reviews.length} đánh giá trên trình duyệt` : "Chưa có đánh giá trên trình duyệt";
  },
  add(kind, id, stars, comment) {
    const text = comment.trim();
    if (!text || text.length > 500) throw new Error("Nhận xét cần từ 1 đến 500 ký tự, không chỉ có khoảng trắng.");
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) throw new Error("Hãy chọn từ 1 đến 5 sao.");
    const data = this.read(kind);
    data[id] = this.list(kind, id);
    data[id].push({ stars, comment: text, name: DemoStore.currentUser()?.fullname || "Khách", date: new Date().toISOString() });
    localStorage.setItem(FOOD_CONFIG.REVIEW_KEYS[kind], JSON.stringify(data));
  },
  remove(kind, id, index) {
    const data = this.read(kind);
    const list = this.list(kind, id);
    list.splice(index, 1); data[id] = list;
    DemoStore.write(FOOD_CONFIG.REVIEW_KEYS[kind], data);
  },
};
