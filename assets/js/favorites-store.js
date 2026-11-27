"use strict";
const Favorites = {
  read() {
    return DemoStore.list("foodMenuSavedRecipes").filter(item => item &&
      Object.hasOwn(FOOD_CONFIG.REVIEW_KEYS, item.kind) && /^[1-9]\d{0,7}$/.test(item.id));
  },
  has(kind, id) { return this.read().some(item => item.kind === kind && item.id === id); },
  toggle(kind, id) {
    const saved = this.has(kind, id);
    const next = this.read().filter(item => !(item.kind === kind && item.id === id));
    if (!saved) next.push({ kind, id });
    if (next.length > 30) throw new Error("Bộ sưu tập demo tối đa 30 công thức.");
    DemoStore.write("foodMenuSavedRecipes", next);
    return !saved;
  }
};
