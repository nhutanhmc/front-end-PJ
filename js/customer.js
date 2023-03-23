const userInforViewCustomer = JSON.parse(sessionStorage.getItem('userInfo'));
const token = userInforViewCustomer.accessToken;


/*fetch này lấy count trc */
let count = 10;

fetch("https://aprartment-api.onrender.com/account/all-resident", {
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




function loadData(page) {
  fetch(`https://aprartment-api.onrender.com/account/all-resident?page=${page}`, {
    method: "GET",
    headers: {
      token: `Bearer ${token}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const accounts = data.accounts;
      const accountTable = document.getElementById("accountTable").getElementsByTagName("tbody")[0];
      accountTable.innerHTML = "";
      accounts.forEach(account => {
        const tr = document.createElement("tr");
        const usernameTd = document.createElement("td");
        usernameTd.classList.add("people");
        const aTag = document.createElement("a");
        const imgTag = document.createElement("img");
        imgTag.src = account.user_id.imgURL || './img/avatar.JPG';
        aTag.appendChild(imgTag);
        usernameTd.appendChild(aTag);
        const divTag = document.createElement("div");
        divTag.classList.add("people-de");
        const usernameP = document.createElement("p");
        usernameP.textContent = account.user_id.name;
        divTag.appendChild(usernameP);
        usernameTd.appendChild(divTag);

        const roleTd = document.createElement("td");
        roleTd.classList.add("peopel-des");
        roleTd.textContent = account.role;

        const statusTd = document.createElement("td");
        statusTd.classList.add("actives");
        statusTd.textContent = account.status;

        if (account.status === "deactive") {
          statusTd.style.color = "red";
          statusTd.style.fontSize = "20px";

        } else if (account.status === "active") {
          statusTd.style.color = "#d7fada";
        }

        const noteTd = document.createElement("td");
        noteTd.classList.add("role");
        noteTd.textContent = account.user_id.email;

        const editTd = document.createElement("td");
        editTd.classList.add("edit");
        editTd.textContent = account.user_id.phonenum;

        tr.appendChild(usernameTd);
        tr.appendChild(roleTd);
        tr.appendChild(statusTd);
        tr.appendChild(noteTd);
        tr.appendChild(editTd);
        accountTable.appendChild(tr);
      });
    })
    .catch(error => console.error(error));
}

loadData(page);


