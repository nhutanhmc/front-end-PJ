const userInforViewCustomer = JSON.parse(sessionStorage.getItem('userInfo'));
const token = userInforViewCustomer.accessToken;
console.log(token);
/*fetch này lấy count trc */
let count = 10;

fetch("https://aprartment-api.onrender.com/bill/all-bill", {
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
document.addEventListener('DOMContentLoaded', () => {
    loadData(1);
});

/************************************ */

function loadData(page) {
    fetch(`https://aprartment-api.onrender.com/bill/all-bill?page=${page}`, {
        method: 'GET',
        headers: {
            token: `Bearer ${token}`,
        },
    })

        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById('table-body');
            let bills = data.bills;
            tableBody.innerHTML = "";
            for (let i = 0; i < bills.length; i++) {
                let bill = bills[i];
                let row = tableBody.insertRow();

                let numberCell = row.insertCell(0);
                numberCell.innerHTML = bill.room_id.roomnum;

                let statusCell = row.insertCell(1);
                statusCell.innerHTML = bill.status;

                let dueDateCell = row.insertCell(2);
                let dueDate = new Date(bill.dueDate);
                let formattedDate = dueDate.toISOString().split('T')[0].split('-').reverse().join('-');
                dueDateCell.innerHTML = formattedDate;


                let totalPriceCell = row.insertCell(3);
                totalPriceCell.innerHTML = bill.totalPrice;

                let detailCell = row.insertCell(4);
                let detailButton = document.createElement('button');
                detailButton.innerHTML = 'Detail';
                detailButton.addEventListener('click', () => {
                    function showServicesDialog(services) {
                    fetch(`https://aprartment-api.onrender.com/bill/detail-bill/${bill._id}`, {
                        method: 'GET',
                        headers: {
                            token: `Bearer ${token}`
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Get list of service names
                        let services = [];
                        data.serviceMonth.forEach(serviceMonth => {
                            serviceMonth.service_id.forEach(service => {
                                services.push(service.name);
                            });
                        });

                        // Show dialog with service names
                        showServicesDialog(services);
                    })
                    .catch(error => console.error(error));

                }
                });
                detailCell.appendChild(detailButton);
            }
        })
        .catch(error => console.error(error));
}
