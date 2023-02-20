function editUserInfo() {
    var user = document.getElementById("user");
    var role = document.getElementById("role");
    var phone = document.getElementById("phone");
    var email = document.getElementById("email");
    var editBtn = document.querySelector(".edit-btn");
    var formGroup = document.querySelectorAll(".form-group");

    // Thay thế các phần tử HTML bằng input để chỉnh sửa giá trị
    user.innerHTML = '<input type="text" value="' + user.innerHTML + '">';
    role.innerHTML = '<input type="text" value="' + role.innerHTML + '">';
    phone.innerHTML = '<input type="text" value="' + phone.innerHTML + '">';
    email.innerHTML = '<input type="text" value="' + email.innerHTML + '">';    

    editBtn.style.display = "none";

    // Tạo nút Save và Cancel
    var saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.innerHTML = "Save";
    saveBtn.addEventListener("click", saveUserInfo);

    var cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-btn";
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.addEventListener("click", closeUserInfo);

    // Thêm nút Save và Cancel vào mỗi form-group
    for (var i = 0; i < formGroup.length; i++) {
        formGroup[i].appendChild(saveBtn);
        formGroup[i].appendChild(cancelBtn);
    }
}

function saveUserInfo() {
    var user = document.getElementById("user");
    var role = document.getElementById("role");
    var phone = document.getElementById("phone");
    var email = document.getElementById("email");
    var editBtn = document.querySelector(".edit-btn");

    // Lưu giá trị mới vào các phần tử HTML tương ứng
    user.innerHTML = user.querySelector("input").value;   role.innerHTML = role.querySelector("input").value;
    phone.innerHTML = phone.querySelector("input").value;
    email.innerHTML = email.querySelector("input").value;

    editBtn.style.display = "inline-block";

    // Xóa nút Save và Cancel
    var saveBtn = document.querySelector(".save-btn");
    saveBtn.parentNode.removeChild(saveBtn);

    var cancelBtn = document.querySelector(".cancel-btn");
    cancelBtn.parentNode.removeChild(cancelBtn);
}

function closeUserInfo() {
    var user = document.getElementById("user");
    var role = document.getElementById("role");
    var phone = document.getElementById("phone");
    var email = document.getElementById("email");
    var editBtn = document.querySelector(".edit-btn");

    // Lấy giá trị ban đầu từ các phần tử HTML
    var originalUserValue = user.querySelector("input").defaultValue;
    var originalRoleValue = role.querySelector("input").defaultValue;
    var originalPhoneValue = phone.querySelector("input").defaultValue;
    var originalEmailValue = email.querySelector("input").defaultValue;

    // Khôi phục giá trị ban đầu cho các phần tử HTML
    user.innerHTML = originalUserValue;
    role.innerHTML = originalRoleValue;
    phone.innerHTML = originalPhoneValue;
    email.innerHTML = originalEmailValue;

    editBtn.style.display = "inline-block";

    // Xóa nút Save và Cancel
    var saveBtn = document.querySelector(".save-btn");
    saveBtn.parentNode.removeChild(saveBtn);

    var cancelBtn = document.querySelector(".cancel-btn");
    cancelBtn.parentNode.removeChild(cancelBtn);
}

