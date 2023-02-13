document.getElementById("form-login").addEventListener("submit", function(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const data = {
    username: username,
    password: password,
    role: role
  };

  fetch("https://test-connect-api.onrender.com/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Kiểm tra trường error trong response
      if (data.error) {
        // Hiển thị thông báo lỗi
        alert("Đăng ký thất bại: " + data.error);
      } else {
        // Hiển thị thông báo thành công
        alert("Đăng ký thành công!");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra trong quá trình gửi dữ liệu
      alert("Đăng ký thất bại, vui lòng thử lại sau.");
    });
});
