
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(function(item) {
        return item.username === username &&
               item.password === password;
    });

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));

        sessionStorage.setItem("loginSuccess", "true");
        window.location.href = "index.html";
    } else {
        document.getElementById("message").innerHTML =
            '<div class="alert alert-danger">Tên đăng nhập hoặc mật khẩu không đúng!</div>';
    }
});
