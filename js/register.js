document.getElementById("form-register").addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // const role = document.getElementById("role").value;
  const data = {
    username: username,
    password: password,
    // role: role
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
      // kiểm tra data trả về có bị trùng với lỗi tên là "Người dùng đã tồn tại" ở đây
      // em dùng trò này bởi vì khi em dùng data.error cái error hệ thống nó báo khác với
      // data đưa ra data lúc đó đưa ra là lỗi POST đó còn error lại ra một lỗi khác
      // hiện tại để như v mốt em sẽ sửa lại sau

      // if(data.error)
      if (data === "Người dùng đã tồn tại") {
        // Hiển thị thông báo lỗi
        alert(data);
      } else {
        // Hiển thị thông báo thành công
        alert("Đăng ký thành công!");
        var result = confirm("Ban co muon dang nhap luon");
        if (result == true) {
          sessionStorage.setItem('userInfo', JSON.stringify(data));
          window.location.href = 'admin.html';
        } else {
          sessionStorage.clear();
          window.location.href = "login.html";
        }
      }
    })
    .catch(error => {
      console.error("Error:", error);
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra trong quá trình gửi dữ liệu
      alert("Đăng ký thất bại, vui lòng thử lại sau.");
    });
});
