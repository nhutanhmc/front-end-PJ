const userInforViewCustomer = JSON.parse(sessionStorage.getItem('userInfo'));
const token = userInforViewCustomer.accessToken;
console.log(token);

const form = document.querySelector('.send-ticket-customer');
const inputElement = document.getElementById("imageFile");
inputElement.addEventListener("change", handleFiles, false);

function handleFiles() {
    const fileList = this.files;
    const maxFiles = 3; // số lượng tệp ảnh tối đa
    if (fileList.length > maxFiles) {
        alert(`Bạn chỉ được chọn tối đa ${maxFiles} tệp ảnh`);
        // hủy các tệp ảnh đã chọn
        inputElement.value = "";
    } else {
        console.log("Bạn đã chọn đúng số lượng tệp ảnh");
        // xử lý các tệp ảnh ở đây
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const roomnum = document.querySelector('input[name="roomnum"]').value;
    const type = document.querySelector('input[name="type"]').value;
    const bedroom = document.querySelector('input[name="bedroom"]').value;
    const livingroom = document.querySelector('input[name="livingroom"]').value;
    const bathroom = document.querySelector('input[name="bathroom"]').value;
    const kitchen = document.querySelector('input[name="kitchen"]').value;
    const view = document.querySelector('input[name="view"]').value;
    const price = document.querySelector('input[name="price"]').value;


    const fileList = inputElement.files;

    const data = {
        roomnum: roomnum,
        type: type,
        furniture: {
            bedroom: bedroom,
            livingroom: livingroom,
            bathroom: bathroom,
            kitchen: kitchen,
            view: view,
        },
        price: price,
    };
    console.log(data)

    const formData = new FormData();

    if (fileList.length === 1) {
        const image = inputElement.files[0];
        formData.append('img', image);
    } else if (fileList.length === 2) {
        const image = inputElement.files[0];
        const image1 = inputElement.files[1];
        formData.append('img', image);
        formData.append('img', image1);
    } else if (fileList.length === 3) {
        const image = inputElement.files[0];
        const image1 = inputElement.files[1];
        const image2 = inputElement.files[2];
        formData.append('img', image);
        formData.append('img', image1);
        formData.append('img', image2);
    }

    formData.append('data', JSON.stringify(data));

    fetch('https://aprartment-api.onrender.com/room/new-room', {
        method: 'POST',
        headers: {
            token: `Bearer ${token}`
        },
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Đã tạo đơn thành công');
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

/*fetch này lấy count trc */
let count = 10;

fetch("https://aprartment-api.onrender.com/room/all-rooms", {
    method: 'GET',
    headers: {
        token: `Bearer ${token}`,
    },
})
    .then((response) => response.json())
    .then((data) => {
        count = data.count;
        createPagination();
    })
    .catch((error) => console.error(error));

const paginationDiv = document.querySelector(".pagination");
const paginationButtonsDiv = paginationDiv.querySelector(".pagination__buttons");
let currentPage = 1;
let page = currentPage;
let isPrevNextButtonAdded = false; // Biến flag để đánh dấu đã thêm nút '<' và '>' hay chưa

function createPagination() {
    // Xóa nội dung cũ của thanh phân trang
    paginationButtonsDiv.innerHTML = "";

    // Tạo nút phân trang
    for (let i = 1; i <= count; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", () => {
            currentPage = i;
            page = currentPage;
            updatePage();
        });
        if (i === currentPage) {
            button.classList.add("active");
        }
        paginationButtonsDiv.appendChild(button);
    }

    // Nếu chưa thêm nút '<' và '>' thì mới thêm
    if (!isPrevNextButtonAdded) {
        // Tạo nút '<'
        const prevButton = document.createElement("button");
        prevButton.innerHTML = "&lt;";
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                page = currentPage;
                updatePage();
            }
        });
        paginationDiv.insertBefore(prevButton, paginationButtonsDiv);

        // Tạo nút '>'
        const nextButton = document.createElement("button");
        nextButton.innerHTML = "&gt;";
        nextButton.addEventListener("click", () => {
            if (currentPage < count) {
                currentPage++;
                page = currentPage;
                updatePage();
            }
        });
        paginationDiv.appendChild(nextButton);

        // Đánh dấu đã thêm nút '<' và '>' rồi
        isPrevNextButtonAdded = true;
    }
}

function updatePage() {
    // Thay đổi class của các nút phân trang
    const pageButtons = document.querySelectorAll(".pagination button:not(.pagination__prev):not(.pagination__next)");
    pageButtons.forEach((button) => {
        button.classList.remove("active");
        if (button.textContent == currentPage) {
            button.classList.add("active");
        }
    });

    console.log(`Current page: ${page}`);
    loadData(page);
}

/*******************************lấy dữ liệu truyền vào***************/
// Lấy các phần tử DOM cần sử dụng
const tableBody = document.getElementById('table-body');


// Gửi yêu cầu lấy dữ liệu từ API



document.addEventListener('DOMContentLoaded', () => {
    loadData(1);
});

const filterStatus = document.getElementById('filterStatus');


let statusSort = "All";


filterStatus.addEventListener('change', function () {
    statusSort = filterStatus.value;
    console.log(statusSort);
    loadData(1); // load dữ liệu lại khi thay đổi giá trị dropdown
});



function loadData(page) {
    let url = `https://aprartment-api.onrender.com/room/all-rooms?page=${page}`;
    if (statusSort !== "All") {
        url += `&status=${statusSort}`;
    }

    console.log(url);
    tableBody.innerHTML = "";
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            const rooms = data.rooms;
            rooms.forEach(room => {
                const tr = document.createElement('tr');
                const roomNumTd = document.createElement('td');
                const typeTd = document.createElement('td');
                const statusTd = document.createElement('td');
                const priceTd = document.createElement('td');
                const detailTd = document.createElement('td');
                const editTd = document.createElement('td');
                const detailBtn = document.createElement('button');
                const editBtn = document.createElement('button');

                roomNumTd.innerText = room.roomnum;
                typeTd.innerText = room.type;
                statusTd.innerText = room.status;
                priceTd.innerText = room.price;
                detailBtn.innerText = 'Detail';
                editBtn.innerText = 'Edit';


                editTd.appendChild(editBtn);
                editBtn.addEventListener('click', () => {
                    // get room id from the row data attribute

                    // open the dialog
                    const dialog = document.querySelector('#roomDetailDialog');
                    dialog.showModal();

                    // populate the dialog with the room data
                    document.querySelector('#type').value = room.type;
                    document.querySelector('#bedroom').value = room.furniture.bedroom;
                    document.querySelector('#livingroom').value = room.furniture.livingroom;
                    document.querySelector('#bathroom').value = room.furniture.bathroom;
                    document.querySelector('#kitchen').value = room.furniture.kitchen;
                    document.querySelector('#view').value = room.furniture.view;
                    document.querySelector('#price').value = room.price;

                    const inputElement = document.getElementById("imageFile1");
                    inputElement.addEventListener("change", handleFiles, false);

                    function handleFiles() {
                        const fileList = this.files;
                        const maxFiles = 3; // số lượng tệp ảnh tối đa
                        if (fileList.length > maxFiles) {
                            alert(`Bạn chỉ được chọn tối đa ${maxFiles} tệp ảnh`);
                            // hủy các tệp ảnh đã chọn
                            inputElement.value = "";
                        } else {
                            console.log("Bạn đã chọn đúng số lượng tệp ảnh");
                            // xử lý các tệp ảnh ở đây
                        }
                    }

                    // handle submit button click
                    const submitBtn = document.querySelector('#submit-edit');
                    submitBtn.addEventListener('click', () => {
                        // get updated room data from the dialog inputs
                        const formData = new FormData();
                        console.log(room._id);
                        const data = {
                            type: document.querySelector('#type').value,
                            furniture: {
                                bedroom: document.querySelector('#bedroom').value,
                                livingroom: document.querySelector('#livingroom').value,
                                bathroom: document.querySelector('#bathroom').value,
                                kitchen: document.querySelector('#kitchen').value,
                                view: document.querySelector('#view').value,
                            },
                            price: document.querySelector('#price').value,
                        };
                        formData.append('data', JSON.stringify(data));

                        const fileList = inputElement.files;

                        if (fileList.length === 1) {
                            const image = inputElement.files[0];
                            formData.append('img', image);
                        } else if (fileList.length === 2) {
                            const image = inputElement.files[0];
                            const image1 = inputElement.files[1];
                            formData.append('img', image);
                            formData.append('img', image1);
                        } else if (fileList.length === 3) {
                            const image = inputElement.files[0];
                            const image1 = inputElement.files[1];
                            const image2 = inputElement.files[2];
                            formData.append('img', image);
                            formData.append('img', image1);
                            formData.append('img', image2);
                        }
                        // send updated room data to the API
                        fetch(`https://aprartment-api.onrender.com/room/update-room/${room._id}`, {
                            method: 'POST',
                            headers: {
                                token: `Bearer ${token}`,
                            },
                            body: formData,
                        })
                            .then(response => response.json())
                            .then(data => {
                                // close the dialog and reload the data
                                dialog.close();
                                loadData(currentPage);
                            })
                            .catch(error => console.error(error));
                    });
                });

                detailTd.appendChild(detailBtn);
                detailBtn.addEventListener('click', () => {
                    showRoomDetail(room);
                });

                function showRoomDetail(room) {
                    // tạo dialog
                    const dialog = document.createElement('dialog');

                    // thêm id vào dialog
                    dialog.setAttribute('id', 'room-detail-dialog');

                    // tạo nội dung dialog
                    let content = `
          <p><strong>Bedroom:</strong> ${room.furniture.bedroom}</p>
          <p><strong>Living Room:</strong> ${room.furniture.livingroom}</p>
          <p><strong>Bathroom:</strong> ${room.furniture.bathroom}</p>
          <p><strong>Kitchen:</strong> ${room.furniture.kitchen}</p>
          <p><strong>View:</strong> ${room.furniture.view}</p>
        `;

                    // thêm ảnh vào nội dung dialog
                    room.imgURLs.forEach(imgURL => {
                        content += `<img src="${imgURL}" alt="Room image" />`;
                    });

                    // thêm nội dung vào dialog
                    dialog.innerHTML = content;

                    // tạo nút đóng dialog
                    const closeButton = document.createElement('button');
                    closeButton.innerText = 'X';

                    // thêm sự kiện click vào nút đóng dialog
                    closeButton.addEventListener('click', () => {
                        const dialog = document.getElementById('room-detail-dialog');
                        dialog.close();
                        dialog.remove(); // xóa dialog khỏi DOM
                    });



                    // thêm nút đóng vào dialog
                    dialog.appendChild(closeButton);

                    // hiển thị dialog
                    document.body.appendChild(dialog);
                    dialog.showModal();
                }

                tr.appendChild(roomNumTd);
                tr.appendChild(typeTd);
                tr.appendChild(statusTd);
                tr.appendChild(priceTd);
                tr.appendChild(detailTd);
                tr.appendChild(editTd);

                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error(error));
}