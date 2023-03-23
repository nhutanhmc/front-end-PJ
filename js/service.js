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

    const name = document.querySelector('input[name="name"]').value;
    const type = document.querySelector('input[name="type"]').value;
    const price = document.querySelector('input[name="price"]').value;
    const supplier = document.querySelector('input[name="supplier"]').value;
    const detail = document.querySelector('input[name="detail"]').value;


    const fileList = inputElement.files;

    const data = {
        name: name,
        type: type,
        price: price,
        supplier: supplier,
        detail: detail,
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

    fetch('https://aprartment-api.onrender.com/service/new-service', {
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

fetch("https://aprartment-api.onrender.com/service/all-services", {
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


const tableBody = document.getElementById("table-body");

// Gửi yêu cầu đến API
fetch("https://aprartment-api.onrender.com/service/all-services", {
    method: 'GET',
    headers: {
        token: `Bearer ${token}`,
    },
})
    .then(response => response.json()) // chuyển phản hồi từ server sang đối tượng JSON
    .then(data => {
        // Thêm các phần tử vào bảng HTML
        const services = data.services;
        services.forEach(service => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = service.name;
            row.appendChild(nameCell);

            const supplierCell = document.createElement("td");
            supplierCell.textContent = service.supplier;
            row.appendChild(supplierCell);

            const typeCell = document.createElement("td");
            typeCell.textContent = service.type;
            row.appendChild(typeCell);

            const priceCell = document.createElement("td");
            priceCell.textContent = service.price;
            row.appendChild(priceCell);

            const statusCell = document.createElement("td");
            statusCell.textContent = service.status;
            row.appendChild(statusCell);

            const detailCell = document.createElement("td");
            const detailButton = document.createElement("button");
            detailButton.textContent = "Detail";
            detailButton.addEventListener("click", () => {
                // Hiển thị dialog chứa dữ liệu detail và imgURLs
                const dialog = document.createElement("dialog");
                const detailData = document.createElement("p");
                detailData.textContent = service.detail;
                dialog.appendChild(detailData);

                if (service.imgURLs.length > 0) {
                    const imageGallery = document.createElement("div");
                    imageGallery.classList.add("image-gallery");

                    service.imgURLs.forEach(imgUrl => {
                        const img = document.createElement("img");
                        img.src = imgUrl;
                        imageGallery.appendChild(img);
                    });

                    dialog.appendChild(imageGallery);
                }

                const closeButton = document.createElement("button");
                closeButton.textContent = "X";
                closeButton.addEventListener("click", () => {
                    dialog.close();
                });
                dialog.appendChild(closeButton);

                document.body.appendChild(dialog);
                dialog.showModal();
            });
            detailCell.appendChild(detailButton);
            row.appendChild(detailCell);


            const editCell = document.createElement("td");
            editCell.innerText = "Edit";
            editCell.addEventListener('click', () => {
                // get room id from the row data attribute

                // open the dialog
                const dialog = document.querySelector('#roomDetailDialog');
                dialog.showModal();

                // populate the dialog with the room data
                document.querySelector('#name').value = service.name;
                document.querySelector('#type').value = service.type;
                document.querySelector('#price').value = service.price;
                document.querySelector('#supplier').value = service.supplier;
                document.querySelector('#detail').value = service.detail;

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
                    console.log(service._id);
                    const data = {
                        name: document.querySelector('#name').name,
                        type: document.querySelector('#type').value,
                        price: document.querySelector('#price').value,
                        supplier: document.querySelector('#supplier').value,
                        detail: document.querySelector('#detail').value,
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
                    fetch(`https://aprartment-api.onrender.com/service/update-service/${service._id}`, {
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
                        })
                        .catch(error => console.error(error));
                });
            });








            row.appendChild(editCell);









            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error(error));
