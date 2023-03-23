const userInforViewCustomer = JSON.parse(sessionStorage.getItem('staffInfor'));
const token = userInforViewCustomer.accessToken;
console.log(token);

/*************************************/
/*fetch này lấy count trc */
let count = 10;

fetch("https://aprartment-api.onrender.com/ticket/all-assigned-ticket", {
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


function handleSortClick(option) {
    console.log('Option selected:', option);
    statusSort = option;
    dropdownMenu.classList.remove('show');
    loadData(1); // sau khi cập nhật giá trị của statusSort, gọi lại hàm loadData()
}

function loadData(page) {
    const status1 ="Đang xử lí";
    let url = `https://aprartment-api.onrender.com/ticket/all-assigned-ticket?page=${page}&status=${status1}`;
  

    fetch(url, {
        method: "GET",
        headers: {
            "token": `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const tickets = data.tickets;
            const accountTable = document.getElementById("accountTable").getElementsByTagName("tbody")[0];
            accountTable.innerHTML = "";
            tickets.forEach(account => {
                const tr = document.createElement("tr");
                const titleTd = document.createElement("td");
                titleTd.classList.add("title");
                titleTd.textContent = account.title;

                const editTd = document.createElement("td");
                editTd.classList.add("edit");
                editTd.textContent = account.type;

                const statusTd = document.createElement("td");
                statusTd.classList.add("status");
                statusTd.textContent = account.status;


                const buttonTk3 = document.createElement("td");
                const button3 = document.createElement("button");
                button3.textContent = "Detail";


                // closure để lưu trữ giá trị của account hiện tại
                const showDetail = () => {
                    const dialogOverlay = document.getElementById("dialog-overlay");
                    const dialogBox = document.getElementById("dialog-box");
                    dialogOverlay.style.display = "block";
                    dialogBox.style.display = "block";
                    const contentDiv = document.querySelector("#dialog-content div:nth-child(2)");
                    contentDiv.textContent = account.content;
                    if (account.status !== "Đang xử lí") {
                        document.getElementById("accept-button").remove();
                        document.getElementById("deny-button").remove();
                    } 
                
                    if (account.imgUrls && account.imgUrls.length > 0) {
                        const imageList = document.querySelector("#image-list");
                        const imageSlider = document.createElement("div");
                        imageSlider.classList.add("image-slider");
                        
                        account.imgUrls.forEach((url, index) => {
                          const img = document.createElement("img");
                          img.src = url;
                          img.alt = `Image ${index + 1}`;
                          img.style.display = "flex";
                          img.style.height = "120px";
                          img.style.width = "120px";
                          imageSlider.appendChild(img);
                        });
                        
                        imageList.innerHTML = "";
                        imageList.appendChild(imageSlider);
                      }
                      
                
                      acceptButton.addEventListener("click", () => {
                        const message = "Thành công";
                        fetch(`https://aprartment-api.onrender.com/ticket/complete-ticket/${account._id}`, {
                            method: "POST",
                            body: JSON.stringify({ message: message }),
                            headers: {
                                "Content-type": "application/json; charset=UTF-8",
                                "token": `Bearer ${token}`,
                            },
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            loadData(page);
                        })
                        .catch(error => console.error(error));
                    });

                    denyButton.addEventListener("click", () => {
                        const message = "Thất bại";
                        fetch(`https://aprartment-api.onrender.com/ticket/complete-ticket/${account._id}`, {
                            method: "POST",
                            body: JSON.stringify({ message: message }),
                            headers: {
                                "Content-type": "application/json; charset=UTF-8",
                                "token": `Bearer ${token}`,
                            },
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            loadData(page);
                        })
                        .catch(error => console.error(error));
                    });
                
                };
                
                button3.addEventListener("click", () => {
                    showDetail(account);
                });

                button3.addEventListener("click", showDetail);
                buttonTk3.classList.add("bt3", "js-edit");
                buttonTk3.appendChild(button3);

                const dialogClose = document.getElementById("dialog-close");
                const dialogOverlay = document.getElementById("dialog-overlay");
                const dialogBox = document.getElementById("dialog-box");

                dialogClose.addEventListener("click", () => {
                    dialogOverlay.style.display = "none";
                    dialogBox.style.display = "none";
                });

                dialogOverlay.addEventListener("click", () => {
                    dialogOverlay.style.display = "none";
                    dialogBox.style.display = "none";
                });

                // Thêm sự kiện "click" vào ô box text và ngăn chặn sự kiện "click" truyền đến dialog-box
                const acceptButton = document.getElementById("accept-button");
                const denyButton = document.getElementById("deny-button");

                

                tr.appendChild(titleTd);
                tr.appendChild(editTd);
                tr.appendChild(statusTd);
                tr.appendChild(buttonTk3);
                accountTable.appendChild(tr);
            });
        })
        .catch(error => console.error(error));
}
loadData(page);
