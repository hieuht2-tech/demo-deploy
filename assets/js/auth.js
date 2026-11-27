"use strict";

// Tài khoản localStorage dành cho bài học. Chỉ dùng mật khẩu demo.
const DemoAuth = {
  users() {
    const users = DemoStore.list("users");
    return users.filter(user => user && typeof user.username === "string" && typeof user.email === "string" && typeof user.password === "string");
  },
  register({ fullname, username, email, password, confirmPassword }) {
    fullname = fullname.trim(); username = username.trim(); email = email.trim().toLowerCase();
    if (!DemoValidate.text(fullname, 2, 60)) throw new Error("Họ tên cần từ 2 đến 60 ký tự.");
    if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) throw new Error("Tên đăng nhập gồm 3–24 chữ không dấu, số hoặc dấu gạch dưới.");
    if (!DemoValidate.email(email)) throw new Error("Email không hợp lệ.");
    if (password.trim().length < 8 || password.length > 72) throw new Error("Mật khẩu cần 8–72 ký tự, không chỉ khoảng trắng.");
    if (password !== confirmPassword) throw new Error("Mật khẩu xác nhận chưa khớp.");
    const users = this.users();
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) throw new Error("Tên đăng nhập đã tồn tại.");
    if (users.some(user => user.email.toLowerCase() === email)) throw new Error("Email đã được đăng ký.");
    users.push({ fullname, username, email, password });
    DemoStore.write("users", users);
  },
  login(username, password) {
    const user = this.users().find(user => user.username.toLowerCase() === username.trim().toLowerCase() && user.password === password);
    if (!user) throw new Error("Tên đăng nhập hoặc mật khẩu không đúng.");
    // Phiên không giữ mật khẩu. Không trim mật khẩu khi so sánh.
    const session = { fullname: user.fullname, username: user.username, email: user.email };
    DemoStore.write("currentUser", session);
    return session;
  }
};
