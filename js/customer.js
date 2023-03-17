const userInforViewCustomer = JSON.parse(sessionStorage.getItem('userInfo'));
const token = userInforViewCustomer.accessToken;

const pagination = document.querySelector('.pagination');
const prevBtn = pagination.querySelector('.pagination__prev');
const nextBtn = pagination.querySelector('.pagination__next');
const pageBtns = pagination.querySelectorAll('.pagination__page');

let currentPage = 1;
let page = currentPage;

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    page = currentPage;
    updatePage();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < pageBtns.length) {
    currentPage++;
    page = currentPage;
    updatePage();
  }
});

pageBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    currentPage = index + 1;
    page = currentPage;
    updatePage();
  });
});

function updatePage() {
  pageBtns.forEach((btn, index) => {
    if (index === currentPage - 1) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  console.log(`Current page: ${page}`);
  loadData(page);
}

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
        imgTag.src = account.user_id.imgURL;
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
        const editA = document.createElement("a");
        editA.href = "#";
        editA.textContent = "View";
        editTd.appendChild(editA);

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


