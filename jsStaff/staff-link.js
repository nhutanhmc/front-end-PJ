document.getElementById("logout-link").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "login-staff.html";
});

document.getElementById("profile-link").addEventListener("click", function () {
    window.location.href = "staff.html";
});

document.getElementById("ticket-link").addEventListener("click", function () {
    window.location.href = "ticket-staff.html";
});
