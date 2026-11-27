"use strict";

const cartBody = document.getElementById("cart-list");
const cartFeedback = document.getElementById("cart-feedback");
const checkoutLink = document.getElementById("checkout-link");
let cartRequest = 0;

async function renderCart() {
  const current = ++cartRequest;
  cartBody.setAttribute("aria-busy", "true");
  checkoutLink.hidden = true;
  cartFeedback.textContent = "Đang tải giỏ...";
  try {
    const lines = await CartStore.lines();
    if (current !== cartRequest) return;
    cartBody.replaceChildren();
    for (const line of lines) {
      const row = document.createElement("tr");
      const name = document.createElement("td");
      name.textContent = line.product?.name || `Món ${line.id} không còn trong thực đơn`;
      const price = document.createElement("td");
      price.textContent = line.product ? money(line.product.price) : "—";
      const quantity = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number"; input.min = "1"; input.max = "99"; input.step = "1";
      input.value = line.quantity; input.className = "form-control cart-quantity";
      input.setAttribute("aria-label", `Số lượng ${line.product?.name || line.id}`);
      input.addEventListener("change", () => {
        try { CartStore.update(line.id, Number(input.value)); renderCart(); }
        catch (error) { showToast(error.message); input.value = line.quantity; }
      });
      quantity.append(input);
      const subtotal = document.createElement("td");
      subtotal.textContent = line.product ? money(line.product.price * line.quantity) : "—";
      const actions = document.createElement("td");
      const remove = document.createElement("button");
      remove.className = "btn btn-sm btn-outline-danger"; remove.textContent = "Xóa";
      remove.addEventListener("click", () => {
        try { CartStore.remove(line.id); renderCart(); }
        catch (error) { showToast(error.message); }
      });
      actions.append(remove); row.append(name, price, quantity, subtotal, actions); cartBody.append(row);
    }
    const totals = CartStore.totals(lines);
    for (const key of ["subtotal", "shipping", "total"]) document.getElementById(`cart-${key}`).textContent = money(totals[key]);
    const missing = lines.some(line => !line.product);
    checkoutLink.hidden = !lines.length || missing;
    cartFeedback.textContent = !lines.length ? "Giỏ trống. Hãy chọn món trong thực đơn demo." : missing ? "Bỏ các món không còn trong thực đơn trước khi đặt đơn." : `${lines.length} món trong giỏ.`;
  } catch (error) { cartFeedback.textContent = error.message; }
  finally { if (current === cartRequest) cartBody.setAttribute("aria-busy", "false"); }
}
document.getElementById("reload-cart").addEventListener("click", renderCart);
window.addEventListener("storage", event => { if (event.key === "cart") renderCart(); });
renderCart();
