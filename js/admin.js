/*--------------------------------VIEW------------------------------*/
const userInfo1 = JSON.parse(sessionStorage.getItem('userInfo'));
const token = userInfo1.accessToken;
const profileUserInfor = JSON.parse(sessionStorage.getItem('profileUserInfor'));
fetch("https://test-connect-api.onrender.com/account/view-profile", {
  method: "GET",
  headers: {
    token: `Bearer ${token}`,
  },
})

  .then((response) => response.json())

  .then(data => {
    sessionStorage.setItem('profileUserInfor', JSON.stringify(data))
    console.log(profileUserInfor); // In giá trị của đối tượng lưu trữ trong sessionStorage
      document.getElementById('name').textContent = profileUserInfor.name;
      document.getElementById('email').textContent = profileUserInfor.email;
      document.getElementById('phonenum').textContent = profileUserInfor.phonenum;
      document.getElementById('city').textContent = profileUserInfor.address.city;
      document.getElementById('district').textContent = profileUserInfor.address.district;
      document.getElementById('street').textContent = profileUserInfor.address.street;
      document.getElementById('ward').textContent = profileUserInfor.address.ward;   
  })

  .catch((error) => console.error(error));
 
/*  Lay ngay thang ra */
const profileUserInfor1 = JSON.parse(sessionStorage.getItem('profileUserInfor'));
let mystring = profileUserInfor1.birth;
let arrayStrig = mystring.split("T");
let dateString = arrayStrig[0];
document.getElementById('date').textContent = dateString;


/*--------------------------------EDIT------------------------------*/
function saveData() {
  // Lấy dữ liệu từ các ô input
  var nameinput = document.getElementById("name-input").value;

  var phoneinput = document.getElementById("phone-input").value;

  var emailinput = document.getElementById("email-input").value;

  var cityinput = document.getElementById("city-input").value;

  // Tạo object chứa dữ liệu mới
  var newData = {
    name: nameinput,
    phonenum: phoneinput,
    email: emailinput,
    address: {
      city: cityinput
    },
  };

  // Gửi dữ liệu lên server
  var xhr = new XMLHttpRequest();
  xhr.open("PATCH", "https://test-connect-api.onrender.com/account/editprofile");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("token", "Bearer " + token);
  xhr.send(JSON.stringify(newData));

  // Nhận phản hồi từ server
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Cập nhật lại thông tin mới trong sessionStorage
      sessionStorage.setItem("name", nameinput);
      sessionStorage.setItem("phone", phoneinput);
      sessionStorage.setItem("email", emailinput);
      sessionStorage.setItem("address.city", cityinput);
    } else {
      // Hiển thị thông báo lỗi
      console.log("Có lỗi xảy ra: " + xhr.status);
      location.reload();
    }
  };
  
}




