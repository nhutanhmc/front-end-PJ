const loginForm = document.getElementById('form-login');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = loginForm.elements.username.value;
    const password = loginForm.elements.password.value;

    fetch('https://test-connect-api.onrender.com/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            window.location.href = 'admin.html';

        })
        .catch(error => {
            console.error(error);
            alert('Login failed');
        });
});



