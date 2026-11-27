"use strict";
const ordersRoot = document.getElementById("orders-list");
const orderUser = DemoStore.currentUser();
if (!orderUser) ordersRoot.textContent = "Đăng nhập để xem đơn demo của tài khoản trên trình duyệt này.";
else {
  const orders = DemoStore.list("foodMenuOrders").filter(order => order && order.email === orderUser.email && Array.isArray(order.items));
  if (!orders.length) ordersRoot.textContent = "Bạn chưa có đơn demo. Chọn món ở thực đơn để thử luồng đặt hàng.";
  orders.forEach(order => {
    const card = document.createElement("article"); card.className = "surface mb-4";
    const title = document.createElement("h2"); title.className = "h5"; title.textContent = order.id;
    const meta = document.createElement("p"); meta.className = "small text-secondary";
    meta.textContent = `${new Date(order.date).toLocaleString("vi-VN")} · ${order.status}`;
    const address = document.createElement("p"); address.textContent = `${order.recipient?.name || ""} · ${order.recipient?.address || ""}`;
    card.append(title, meta, address);
    order.items.forEach(item => {
      const line = document.createElement("p"); line.className = "mb-2";
      line.textContent = `${item.name} × ${item.quantity} — ${money(item.price * item.quantity)}`; card.append(line);
    });
    const total = document.createElement("strong"); total.textContent = `Tổng: ${money(order.total)} (phí giao ${money(order.shipping)})`;
    card.append(total); ordersRoot.append(card);
  });
}
