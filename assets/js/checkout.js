"use strict";

const checkoutForm = document.getElementById("checkout-form");
const checkoutFeedback = document.getElementById("checkout-feedback");
const checkoutButton = document.getElementById("place-order");
let placingOrder = false;
const checkoutOrderId = `FM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

async function showCheckout() {
  checkoutButton.disabled = true;
  const user = DemoStore.currentUser();
  if (!user) {
    checkoutFeedback.textContent = "Đăng nhập tài khoản demo trước khi xác nhận đơn.";
    document.getElementById("checkout-login").hidden = false;
    return;
  }
  document.getElementById("recipient-name").value = user.fullname || "";
  try {
    const lines = await CartStore.lines();
    const summary = document.getElementById("checkout-summary");
    summary.replaceChildren();
    if (!lines.length || lines.some(line => !line.product)) throw new Error("Giỏ trống hoặc có món không còn trong thực đơn. Hãy kiểm tra lại giỏ.");
    lines.forEach(line => {
      const text = document.createElement("p");
      text.textContent = `${line.product.name} × ${line.quantity} — ${money(line.product.price * line.quantity)}`;
      summary.append(text);
    });
    const totals = CartStore.totals(lines);
    document.getElementById("checkout-total").textContent = money(totals.total);
    document.getElementById("checkout-shipping").textContent = money(totals.shipping);
    checkoutFeedback.textContent = ""; checkoutButton.disabled = false;
  } catch (error) { checkoutFeedback.textContent = error.message; }
}

checkoutForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (placingOrder) return;
  try {
    if (!checkoutForm.reportValidity()) return;
    const user = DemoStore.currentUser();
    if (!user) throw new Error("Bạn cần đăng nhập trước khi xác nhận đơn.");
    const name = document.getElementById("recipient-name").value.trim();
    const phone = document.getElementById("recipient-phone").value.trim();
    const address = document.getElementById("recipient-address").value.trim();
    const note = document.getElementById("recipient-note").value.trim();
    if (!DemoValidate.text(name, 2, 60)) throw new Error("Họ tên cần từ 2 đến 60 ký tự.");
    if (!DemoValidate.phone(phone)) throw new Error("Điện thoại cần 10 số bắt đầu bằng 0 hoặc dạng +84.");
    if (!DemoValidate.text(address, 10, 200)) throw new Error("Địa chỉ cần từ 10 đến 200 ký tự.");
    if (note.length > 500) throw new Error("Ghi chú tối đa 500 ký tự.");
    placingOrder = true; checkoutButton.disabled = true;
    // Tính lại theo file nguồn, không tin tổng tiền được hiển thị trong HTML.
    const lines = await CartStore.lines();
    if (!lines.length || lines.some(line => !line.product)) throw new Error("Giỏ không hợp lệ. Hãy quay lại giỏ kiểm tra.");
    const orders = DemoStore.list("foodMenuOrders");
    if (!orders.some(order => order.id === checkoutOrderId)) {
      orders.unshift({ id: checkoutOrderId, email: user.email, date: new Date().toISOString(),
        recipient: { name, phone, address, note },
        items: lines.map(line => ({ id: line.id, name: line.product.name, price: line.product.price, quantity: line.quantity })),
        ...CartStore.totals(lines), status: "Đơn demo đã lưu" });
      DemoStore.write("foodMenuOrders", orders);
    }
    // Lưu đơn trước rồi mới xóa giỏ; lỗi validate/storage không được làm mất giỏ.
    try { CartStore.save([]); }
    catch { checkoutFeedback.textContent = "Đơn demo đã lưu nhưng chưa xóa được giỏ. Xem Lịch sử đơn trước khi tạo đơn mới."; checkoutButton.disabled = true; return; }
    location.href = "donhang.html";
  } catch (error) { checkoutFeedback.textContent = error.message; checkoutButton.disabled = false; }
  finally { placingOrder = false; }
});
window.addEventListener("storage", event => { if (event.key === "cart" || event.key === "currentUser") showCheckout(); });
showCheckout();
