
document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let fullname = document.getElementById("fullname").value.trim();
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
        document.getElementById("message").innerHTML =
            '<div class="alert alert-danger">Mật khẩu không khớp!</div>';
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(user => user.username === username)) {
        document.getElementById("message").innerHTML =
            '<div class="alert alert-danger">Tên đăng nhập đã tồn tại!</div>';
        return;
    }

    users.push({
        fullname: fullname,
        username: username,
        email: email,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("message").innerHTML =
        '<div class="alert alert-success">Đăng ký thành công! Đang chuyển đến trang đăng nhập...</div>';
    setTimeout(function() { window.location.href = "dangnhap.html"; }, 1200);
});
