const customeInfor = JSON.parse(sessionStorage.getItem('userInfo-cus'));
const token = customeInfor.accessToken;
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

    const title = document.querySelector('input[name="title"]').value;
    const type = document.querySelector('input[name="type"]').value;
    const content = document.querySelector('textarea[name="content"]').value;

    const fileList = inputElement.files;

    const data = {
        title: title,
        content: content,
        type: type,
    };

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

    fetch('https://aprartment-api.onrender.com/ticket/new-ticket', {
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



/*************************************/
/*fetch này lấy count trc */
let count = 10;

fetch("https://aprartment-api.onrender.com/ticket/owned-ticket", {
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



/*******  fetch này dùng gọi list dữ liệu lên****** */

// Lấy các phần tử DOM cần sử dụng
const tableBody = document.getElementById('table-body');


// Gửi yêu cầu lấy dữ liệu từ API



document.addEventListener('DOMContentLoaded', () => {
    loadData(1);
});

const filterStatus = document.getElementById('filterStatus');
const filterType = document.getElementById('filterType');

let statusSort = "All";
let typeSort = "All";

filterStatus.addEventListener('change', function () {
    statusSort = filterStatus.value;
    console.log(statusSort);
    loadData(1); // load dữ liệu lại khi thay đổi giá trị dropdown
});

filterType.addEventListener('change', function () {
    typeSort = filterType.value;
    console.log(typeSort);
    loadData(1); // load dữ liệu lại khi thay đổi giá trị dropdown
});


function loadData(page) {
    let url = `https://aprartment-api.onrender.com/ticket/owned-ticket?page=${page}`;
    if (statusSort !== "All") { // kiểm tra xem statusSort có khác "All" hay không
        url += `&status=${statusSort}`;
    }
    if (typeSort !== "All") { // kiểm tra xem statusSort có khác "All" hay không
        url += `&type=${typeSort}`;
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
        .then((response) => response.json())
        .then((data) => {
            const tickets = data.tickets;
            console.log(data);
            tickets.forEach(ticket => {
                const row = document.createElement('tr');
                const title = document.createElement('td');
                const type = document.createElement('td');
                const status = document.createElement('td');
                const info = document.createElement('td');

                title.textContent = ticket.title;
                title.classList.add('people');

                type.textContent = ticket.type;
                type.classList.add('peopel-des');

                status.textContent = ticket.status;
                status.classList.add('role');

                info.innerHTML = '';

                const detailButton = document.createElement('button');
                detailButton.textContent = 'Detail';
                detailButton.dataset.content = ticket.content;
                detailButton.dataset.feedback = ticket.feedback;
                detailButton.dataset.status = ticket.status;
                detailButton.dataset.name = ticket.staff_id ? ticket.staff_id.user_id.name : '';
                detailButton.classList.add('js-detail-button', 'edit', 'js-edit');
                info.classList.add('edit', 'js-edit');
                info.appendChild(detailButton);

                // Remove the old confirm and cancel buttons
                const oldConfirmButton = dialog.querySelector('.js-confirm-button');
                if (oldConfirmButton) {
                    oldConfirmButton.remove();
                }

                const oldCancelButton = dialog.querySelector('.js-cancel-button');
                if (oldCancelButton) {
                    oldCancelButton.remove();
                }

                const confirmButton = document.createElement('button');
                confirmButton.textContent = 'Confirm';
                confirmButton.classList.add('js-confirm-button', 'edit', 'js-edit');
                dialog.appendChild(confirmButton);

                confirmButton.addEventListener("click", () => {
                    const status = ticket.status;
                    const message = 'Đồng ý';
                    if (status === 'Đã tiếp nhận') {
                        fetch(`https://aprartment-api.onrender.com/ticket/confirm-ticket/${ticket._id}`, {
                            method: "POST",
                            headers: {
                                "token": `Bearer ${token}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                status: status,
                                message: message
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                                loadData(page);
                            })
                            .catch(error => console.error(error));
                    } else {
                        alert('Đơn đã ' + status);
                    }

                });

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.classList.add('js-cancel-button', 'edit', 'js-edit');
                dialog.appendChild(cancelButton);
                cancelButton.addEventListener("click", () => {
                    const status = ticket.status;
                    const message = 'Hủy bỏ';
                    if (status === 'Đã tiếp nhận') {
                        fetch(`https://aprartment-api.onrender.com/ticket/cancel-ticket/${ticket._id}`, {
                            method: "POST",
                            headers: {
                                "token": `Bearer ${token}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                status: status,
                                message: message
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                                loadData(page);
                            })
                            .catch(error => console.error(error));
                    } else {
                        alert('Đơn đã ' + status);
                    }
                });



                row.appendChild(title);
                row.appendChild(type);
                row.appendChild(status);
                row.appendChild(info);
                tableBody.appendChild(row);



            });


            const detailButtons = document.querySelectorAll('.js-detail-button');
            detailButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const contentText = event.target.dataset.content;
                    const feedbackText = event.target.dataset.feedback;
                    const nameText = event.target.dataset.name;

                    content.textContent = contentText;
                    feedback.textContent = feedbackText;

                    const nameLabel = document.createElement('p');
                    nameLabel.textContent = `Employee: ${nameText}`;
                    document.getElementById('name').innerHTML = '';
                    document.getElementById('name').appendChild(nameLabel);

                    dialog.classList.remove('hide');
                });
            });
            const closeDialog = document.getElementById('close-dialog');

            closeDialog.addEventListener('click', () => {
                dialog.classList.add('hide');
            });


        })
        .catch((error) => console.error(error));
    loadData(data);
}


