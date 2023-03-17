document.getElementById("logout-link").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "login.html";
});

document.getElementById("room-link").addEventListener("click", function () {
    window.location.href = "roomlist.html";
});

document.getElementById("profile-link").addEventListener("click", function () {
    window.location.href = "admin.html";
});

document.getElementById("customer-link").addEventListener("click", function () {
    window.location.href = "customer.html";
});

document.getElementById("bill-link").addEventListener("click", function () {
    window.location.href = "bill.html";
});


document.getElementById("ticket-link").addEventListener("click", function () {
    window.location.href = "ticket.html";
});
