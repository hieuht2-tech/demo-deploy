"use strict";

// Chỉ lưu ID và quantity. Mỗi lần mở giỏ sẽ lấy lại tên/giá từ menu.json.
const CartStore = {
  read() {
    const rows = DemoStore.list("cart");
    return rows.filter(item => item && typeof item.id === "string" && /^menu-\d+$/.test(item.id) && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 99);
  },
  save(rows) { DemoStore.write("cart", rows); document.dispatchEvent(new Event("cart-updated")); },
  async migrate() {
    // Chuyển giỏ phiên bản trước {name,price,quantity} sang ID, không giữ giá cũ.
    const old = DemoStore.list("cart");
    if (!old.some(item => item && !item.id && typeof item.name === "string")) return;
    const menu = await MenuAPI.all();
    const merged = new Map();
    old.forEach(item => {
      const product = menu.find(product => item.id ? product.id === item.id : product.name === item.name);
      if (!product || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) return;
      merged.set(product.id, Math.min(99, (merged.get(product.id) || 0) + Number(item.quantity)));
    });
    this.save([...merged].map(([id, quantity]) => ({ id, quantity })));
  },
  add(id, quantity = 1) {
    if (!/^menu-\d+$/.test(id) || !Number.isInteger(quantity) || quantity < 1) throw new Error("Món hoặc số lượng không hợp lệ.");
    const cart = this.read();
    const item = cart.find(item => item.id === id);
    if ((item?.quantity || 0) + quantity > 99) throw new Error("Mỗi món tối đa 99 phần trong bài demo.");
    if (item) item.quantity += quantity;
    else cart.push({ id, quantity });
    this.save(cart);
  },
  update(id, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error("Số lượng cần là số nguyên từ 1 đến 99.");
    this.save(this.read().map(item => item.id === id ? { id, quantity } : item));
  },
  remove(id) { this.save(this.read().filter(item => item.id !== id)); },
  async lines() {
    await this.migrate();
    const menu = await MenuAPI.all();
    return this.read().map(item => ({ ...item, product: menu.find(product => product.id === item.id) }));
  },
  totals(lines) {
    const subtotal = lines.reduce((sum, line) => sum + (line.product?.price || 0) * line.quantity, 0);
    const shipping = subtotal > 0 && subtotal < 200000 ? 15000 : 0;
    return { subtotal, shipping, total: subtotal + shipping };
  }
};
