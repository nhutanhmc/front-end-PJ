const customeInfor = JSON.parse(sessionStorage.getItem('userInfo-cus'));
const token = customeInfor.accessToken;

const tableContainer = document.querySelector('.data-room table tbody');

// Gửi yêu cầu GET đến API
fetch("https://aprartment-api.onrender.com/bill/owned-bill", {
    method: 'GET',
    headers: {
        token: `Bearer ${token}`
    },
})
    .then(response => response.json())
    .then(data => {
        // Lặp qua từng phần tử của mảng trả về
        const bills = data.bills;
        let count = 0;
        bills.forEach(item => {
            // Tạo một phần tử tr mới
            const row = document.createElement('tr');
            count++;

            // Thêm nội dung cho các ô trong hàng
            const no = document.createElement('td');
            no.textContent = count;
            row.appendChild(no);


            const statusCell = document.createElement('td');
            statusCell.textContent = item.status;
            row.appendChild(statusCell);

            const dueDateCell = document.createElement('td');
            const dateStr = item.dueDate.split('T')[0];
            const [year, month, date] = dateStr.split('-').reverse();
            dueDateCell.textContent = `${date}/${month}/${year}`;
            row.appendChild(dueDateCell);

            const totalPriceCell = document.createElement('td');
            totalPriceCell.textContent = item.totalPrice;
            row.appendChild(totalPriceCell);

            const linkCell = document.createElement('td');
            const link = document.createElement('a');
            link.href = `detail.html?id=${item._id}`;
            link.className = 'detail js-detail';
            link.textContent = 'detail';
            link.addEventListener('click', () => {
                sessionStorage.setItem('billId', item._id);
            });
            linkCell.appendChild(link);
            row.appendChild(linkCell);

            // Thêm hàng mới vào bảng
            tableContainer.appendChild(row);
        });
    })
    .catch(error => console.error(error));