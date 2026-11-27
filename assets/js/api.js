"use strict";

// BƯỚC 1: Chỉ fetch và chuẩn hóa dữ liệu ở đây, không viết code render vào API.
const FoodAPI = (() => {
  let vegetarianPromise;

  async function request(base, endpoint, params) {
    const url = new URL(endpoint, base);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`Không tải được công thức (HTTP ${response.status}).`);
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") throw new Error("Kết nối quá lâu, hãy thử lại.");
      throw error;
    } finally { clearTimeout(timer); }
  }

  function readArray(data, property) {
    // Hai API dùng meals/drinks: null khi không có kết quả, cần đổi thành [].
    if (!data || typeof data !== "object") throw new Error("API trả dữ liệu không hợp lệ.");
    if (data[property] === null) return [];
    if (!Array.isArray(data[property])) throw new Error(`API không trả về mảng ${property}.`);
    return data[property];
  }

  function safeURL(value) {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }

  function normalize(item, kind) {
    const drink = kind === "drink";
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const name = String(item[`strIngredient${i}`] || "").trim();
      const measure = String(item[`strMeasure${i}`] || "").trim();
      if (name) ingredients.push({ name, measure });
    }
    return {
      id: String(drink ? item.idDrink : item.idMeal), kind,
      name: drink ? item.strDrink : item.strMeal,
      image: safeURL(drink ? item.strDrinkThumb : item.strMealThumb) || FOOD_CONFIG.PLACEHOLDER,
      category: item.strCategory || (kind === "vegetarian" ? "Món chay" : drink ? "Đồ uống" : "Món ăn"),
      area: item.strArea || item.strAlcoholic || "",
      instructions: item.strInstructions || "Chưa có hướng dẫn từ nguồn.", ingredients,
      sourceURL: safeURL(item.strSource), videoURL: safeURL(item.strYoutube),
    };
  }

  async function vegetarianCatalog() {
    if (!vegetarianPromise) vegetarianPromise = Promise.all(["Vegetarian", "Vegan"].map(category =>
      request(FOOD_CONFIG.MEAL_URL, "filter.php", { c: category }).then(data => readArray(data, "meals"))
    )).then(lists => [...new Map(lists.flat().map(item => [item.idMeal, item])).values()])
      .catch(error => { vegetarianPromise = null; throw error; });
    return vegetarianPromise;
  }

  async function search(kind, keyword = "") {
    const term = keyword.trim();
    if (kind === "vegetarian") {
      // Tìm ngay trên danh sách đã lọc Vegetarian/Vegan, tránh lẫn món không chay.
      const items = await vegetarianCatalog();
      return items.filter(item => item.strMeal.toLowerCase().includes(term.toLowerCase())).map(item => normalize(item, kind));
    }
    if (kind === "drink") {
      const data = await request(FOOD_CONFIG.DRINK_URL, term ? "search.php" : "filter.php", term ? { s: term } : { a: "Non_Alcoholic" });
      return readArray(data, "drinks").map(item => normalize(item, kind));
    }
    if (kind !== "meal") throw new Error("Loại danh mục không hợp lệ.");
    const data = await request(FOOD_CONFIG.MEAL_URL, "search.php", { s: term || FOOD_CONFIG.DEFAULT_MEAL_SEARCH });
    return readArray(data, "meals").map(item => normalize(item, kind));
  }

  async function lookup(kind, id) {
    if (!Object.hasOwn(FOOD_CONFIG.REVIEW_KEYS, kind) || !/^\d{1,8}$/.test(String(id))) {
      throw new Error("Đường dẫn món ăn không hợp lệ. Hãy chọn lại từ danh sách.");
    }
    // filter.php chỉ có tên/ảnh/ID: bắt buộc lookup để lấy đủ hướng dẫn/nguyên liệu.
    const drink = kind === "drink";
    const data = await request(drink ? FOOD_CONFIG.DRINK_URL : FOOD_CONFIG.MEAL_URL, "lookup.php", { i: id });
    const item = readArray(data, drink ? "drinks" : "meals")[0];
    if (!item) throw new Error("Không tìm thấy công thức này.");
    if (kind === "vegetarian" && !["vegetarian", "vegan"].includes(String(item.strCategory).toLowerCase())) {
      throw new Error("Món này không nằm trong danh mục chay của nguồn.");
    }
    return normalize(item, kind);
  }

  return { search, lookup };
})();
