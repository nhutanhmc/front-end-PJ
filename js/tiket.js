const userInforViewCustomer = JSON.parse(sessionStorage.getItem('userInfo'));
const token = userInforViewCustomer.accessToken;
console.log(token);

/*************************************/
/*fetch này lấy count trc */
let count = 10;

fetch("https://aprartment-api.onrender.com/ticket/all-ticket", {
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


const filterTypeOfStaff = document.getElementById("filterTypeOfStaff");
const filterStaff = document.getElementById("filterStaff");

let typeOfStaffSort = "Vệ sinh";

filterTypeOfStaff.addEventListener('change', function () {
    typeOfStaffSort = filterTypeOfStaff.value;
    console.log(typeOfStaffSort);
    fetchStaffList();
});

function fetchStaffList() {
    fetch("https://aprartment-api.onrender.com/account/all-staff", {
        method: "POST",
        headers: {
            "token": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ detail: typeOfStaffSort })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            filterStaff.innerHTML = "";
            const users = data.map(item => ({ id: item._id, name: item.user_id.name }));

            // Thêm option null đầu tiên
            filterStaff.options.add(new Option("", ""));

            // Thêm các option của staff vào select
            users.forEach(user => {
                filterStaff.options.add(new Option(user.name, user.id));
            });
        })
        .catch(error => console.error(error));
}

let staffId = "";
filterStaff.addEventListener('change', function () {
    staffId = filterStaff.value;
    console.log(staffId);
});


function loadData(page) {
    let url = `https://aprartment-api.onrender.com/ticket/all-ticket?page=${page}`;
    if (statusSort !== "All") { // kiểm tra xem statusSort có khác "All" hay không
        url += `&status=${statusSort}`;
    }
    if (typeSort !== "All") { // kiểm tra xem statusSort có khác "All" hay không
        url += `&type=${typeSort}`;
    }

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

                const showDetail = () => {
                    const dialogOverlay = document.getElementById("dialog-overlay");
                    const dialogBox = document.getElementById("dialog-box");
                    dialogOverlay.style.display = "block";
                    dialogBox.style.display = "block";
                    const contentDiv = document.querySelector("#dialog-content div:nth-child(3)");
                    contentDiv.textContent = account.content;
                    if (account.status !== "Chờ tiếp nhận") {
                        const feedbackDiv = document.createElement("div");
                        if (account.feedback) {
                            feedbackDiv.textContent = account.feedback;
                        } else {
                            feedbackDiv.textContent = "Chưa feedback";
                        }
                        document.querySelector("#dialog-content div:nth-child(5)").replaceWith(feedbackDiv);
                        document.getElementById("accept-button").remove();
                        document.getElementById("deny-button").remove();

                    } else if (account.status === "Chờ tiếp nhận") {
                        document.getElementById("feedback-box").textContent = "";
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
                        const staffId = filterStaff.value;
                        const feedback = document.getElementById("feedback-box").textContent;
                        fetch(`https://aprartment-api.onrender.com/ticket/accept-ticket/${account._id}`, {
                            method: "POST",
                            body: JSON.stringify({ feedback: feedback, staffId: staffId }),
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

                        const feedback = document.getElementById("feedback-box").textContent;
                        fetch(`https://aprartment-api.onrender.com/ticket/deny-ticket/${account._id}`, {
                            method: "POST",
                            body: JSON.stringify({ feedback: feedback }),
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
                    /************************************************************ */

                    /***************************************************************** */
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
                const feedbackBox = document.getElementById("feedback-box");
                feedbackBox.addEventListener("click", event => {
                    event.stopPropagation();
                });

                const filterStaff1 = document.getElementById("filterStaff");
                filterStaff1.addEventListener("click", event => {
                    event.stopPropagation();
                });

                const filterTypeOfStaff1 = document.getElementById("filterTypeOfStaff");
                filterTypeOfStaff1.addEventListener("click", event => {
                    event.stopPropagation();
                });


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

