/*--------------------------------VIEW------------------------------*/

const userInforViewProfile = JSON.parse(sessionStorage.getItem('userInfo-cus'));
const token = userInforViewProfile.accessToken;
const profileUserInfor = JSON.parse(sessionStorage.getItem('profileUserInfor'));

fetch("https://aprartment-api.onrender.com/account/view-profile", {
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
    document.getElementById('img-info').textContent = profileUserInfor.imgURL;
  })

  .catch((error) => console.error(error));

  document.getElementById('name-input').value = profileUserInfor.name;
  document.getElementById('phone-input').value = profileUserInfor.phonenum;
  document.getElementById('email-input').value = profileUserInfor.email;
  document.getElementById('city-input').value = profileUserInfor.address.city;
  document.getElementById('district-input').value = profileUserInfor.address.district;
  document.getElementById('ward-input').value = profileUserInfor.address.ward;
  document.getElementById('street-input').value = profileUserInfor.address.street;

/*  Lay ngay thang ra */
const profileUserInfor1 = JSON.parse(sessionStorage.getItem('profileUserInfor'));
let mystring = profileUserInfor1.birth;
let arrayStrig = mystring.split("T");
let dateString = arrayStrig[0];
document.getElementById('date').textContent = dateString;

/******load image img */
// Lấy đối tượng img và thẻ div chứa nó
const img = document.querySelector('.card__img');
const imgInfo = document.querySelector('.img-info');

fetch('https://aprartment-api.onrender.com/account/view-profile', {
  method: 'GET',
  headers: {
    token: `Bearer ${token}`,
  },
})
.then(response => response.json())
.then(data => {
  // Kiểm tra xem ảnh lấy được từ server có null hay không
  const imgUrl = data.imgURL ? data.imgURL : './img/avatar.JPG';

  // Cập nhật thuộc tính src của thẻ img
  img.src = imgUrl;
})
.catch(error => console.error(error));

const imageInput = document.getElementById("imageFile");

imageInput.addEventListener("change", () => {
  const formData = new FormData();
  formData.append("img", imageInput.files[0]);

  fetch("https://aprartment-api.onrender.com/account/editimgprofile", {
    method: "POST",
    headers: {
      token: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // do something with the response data
      location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
});

/*--------------------------------EDIT------------------------------*/
function saveData() {
    // Lấy dữ liệu từ các ô input
    var nameinput = document.getElementById("name-input").value;
    var phoneinput = document.getElementById("phone-input").value;
    var emailinput = document.getElementById("email-input").value;
    var cityinput = document.getElementById("city-input").value;
    var districtinput = document.getElementById("district-input").value;
    var wardinput = document.getElementById("ward-input").value;
    var streetinput = document.getElementById("street-input").value;

    // Tạo object chứa dữ liệu mới
    var newData = {
        name: nameinput,
        phonenum: phoneinput,
        email: emailinput,
        address: {
            city: cityinput,
            district: districtinput,
            ward: wardinput,
            street: streetinput
        },
    };

    // Gửi dữ liệu lên server
    const userInforViewProfile = JSON.parse(sessionStorage.getItem('userInfo-cus'));
    const token = userInforViewProfile.accessToken;

    fetch("https://aprartment-api.onrender.com/account/editprofile", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            token: `Bearer ${token}`,
        },
        body: JSON.stringify(newData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // Cập nhật lại thông tin mới trong sessionStorage
            sessionStorage.setItem("profileUserInfor", JSON.stringify(newData));
            location.reload();
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
            location.reload();
        });
}

