const customeInfor = JSON.parse(sessionStorage.getItem('userInfo-cus'));
const token = customeInfor.accessToken;
// Lấy giá trị _id từ sessionStorage
const id = sessionStorage.getItem('billId');

console.log(id)

let pageBeingUnloaded = false;

window.addEventListener('unload', function () {
    // Nếu trang đang bị xóa, không làm gì cả
    if (pageBeingUnloaded) {
        return;
    }

    // Xóa giá trị _id khỏi sessionStorage
    sessionStorage.removeItem('_id');
});

window.addEventListener('beforeunload', function () {
    // Đánh dấu trang đang bị xóa
    pageBeingUnloaded = true;
});

fetch(`https://aprartment-api.onrender.com/bill/detail-bill/${id}`, {
    method: 'GET',
    headers: {
        token: `Bearer ${token}`
    },
})
    .then(response => response.json())
    .then(data => {
        document.querySelector('#status-detail').textContent = data.status;

        const dueDate = data.dueDate.split('T')[0].split('-').reverse().join('/');
        document.querySelector('#dueDate-detail').textContent = dueDate;

        document.querySelector('#totalPrice-detail').textContent = data.totalPrice;

        const tbody = document.querySelector('tbody');
        for (const service of data.serviceMonth) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${service.service_id.name}</td>
        <td class="text-center">${service.service_id.supplier}</td>
        <td class="text-center">${service.timePerform.split('T')[0].split('-').reverse().join('/')}</td>
        <td class="text-right">${service.service_id.price}</td>
      `;
            tbody.appendChild(tr);
        }
    })
    .catch(error => console.error('Error:', error));

/********************************/
const payButton = document.querySelector('#pay-bill');

payButton.addEventListener('click', () => {

    // Tạo request
    fetch(`https://aprartment-api.onrender.com/bill/payment/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            // Xử lý kết quả trả về
            console.log(data);
            alert('Thanh toán thành công!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Thanh toán thất bại. Vui lòng thử lại sau!');
        });
});
