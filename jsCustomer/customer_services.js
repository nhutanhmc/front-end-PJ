const customeInfor = JSON.parse(sessionStorage.getItem('userInfo-cus'));
const token = customeInfor.accessToken;


fetch("https://aprartment-api.onrender.com/service/all-services", {
    method: 'GET',
    headers: {
        token: `Bearer ${token}`,
    },
})
    .then(response => response.json())
    .then(data => {
        const productsWrapper = document.querySelector('.products-area-wrapper');

        const services = data.services;
        services.forEach(product => {
            const productRow = document.createElement('div');
            productRow.classList.add('products-row');

            const imageCell = document.createElement('div');
            imageCell.classList.add('product-cell', 'image');

            const image = document.createElement('img');
            image.setAttribute('src', product.imgURLs[0]);
            image.setAttribute('alt', 'product');
            imageCell.appendChild(image);

            const nameCell = document.createElement('div');
            nameCell.classList.add('product-cell');

            const nameLabel = document.createElement('span');
            nameLabel.classList.add('cell-label');
            nameLabel.textContent = 'Service:';
            nameCell.appendChild(nameLabel);

            const name = document.createElement('div');
            name.textContent = product.name;
            nameCell.appendChild(name);

            const supplierCell = document.createElement('div');
            supplierCell.classList.add('product-cell');

            const supplierLabel = document.createElement('span');
            supplierLabel.classList.add('cell-label');
            supplierLabel.textContent = 'Supplier:';
            supplierCell.appendChild(supplierLabel);

            const supplier = document.createElement('div');
            supplier.textContent = product.supplier;
            supplierCell.appendChild(supplier);

            const typeCell = document.createElement('div');
            typeCell.classList.add('product-cell');

            const typeLabel = document.createElement('span');
            typeLabel.classList.add('cell-label');
            typeLabel.textContent = 'Type:';
            typeCell.appendChild(typeLabel);

            const type = document.createElement('div');
            type.textContent = product.type;
            typeCell.appendChild(type);

            const priceCell = document.createElement('div');
            priceCell.classList.add('product-cell');

            const priceLabel = document.createElement('span');
            priceLabel.classList.add('cell-label');
            priceLabel.textContent = 'Price:';
            priceCell.appendChild(priceLabel);

            const price = document.createElement('div');
            price.textContent = product.price;
            priceCell.appendChild(price);

            const detailCell = document.createElement('div');
            detailCell.classList.add('product-cell');

            const detailLabel = document.createElement('span');
            detailLabel.classList.add('cell-label');
            detailLabel.textContent = 'Detail:';
            detailCell.appendChild(detailLabel);

            const detail = document.createElement('div');
            detail.textContent = product.detail;
            detailCell.appendChild(detail);

            const statusCell = document.createElement('div');
            statusCell.classList.add('product-cell');

            const statusLabel = document.createElement('span');
            statusLabel.classList.add('cell-label');
            statusLabel.textContent = 'Status:';
            statusCell.appendChild(statusLabel);

            const status = document.createElement('span');
            if (product.status === 'Đang hoạt động') {
                status.classList.add('status', 'active');
            } else {
                status.classList.add('status', 'disabled');
            }
            status.textContent = product.status;
            statusCell.appendChild(status);

            const useButton = document.createElement('button');
            useButton.classList.add('use-service');
            useButton.setAttribute('id', 'use-service');
            useButton.textContent = 'Use';

            useButton.addEventListener('click', function () {
                const dialogOverlay = document.createElement('div');
                dialogOverlay.classList.add('dialog-overlay');

                const dialog = document.createElement('div');
                dialog.classList.add('dialog');

                const close = document.createElement('button');
                close.classList.add('close');
                close.innerHTML = '&times;';
                close.addEventListener('click', function () {
                    dialogOverlay.remove();
                });

                const h2 = document.createElement('h2');
                h2.textContent = 'Use service';

                const dateLabel = document.createElement('label');
                dateLabel.setAttribute('for', 'date');
                dateLabel.textContent = 'Date:';

                const dateInput = document.createElement('input');
                dateInput.setAttribute('type', 'date');
                dateInput.setAttribute('id', 'date');

                const commentLabel = document.createElement('label');
                commentLabel.setAttribute('for', 'comment');
                commentLabel.textContent = 'Comment:';

                const commentTextarea = document.createElement('textarea');
                commentTextarea.setAttribute('id', 'comment');

                const acceptButton = document.createElement('button');
                acceptButton.setAttribute('id', 'accept');
                acceptButton.textContent = 'Accept';
                acceptButton.addEventListener('click', function () {
                    console.log(product._id);
                    const selectedDate = new Date(dateInput.value); // Lấy giá trị ngày tháng từ input
                    const date = selectedDate.toISOString().slice(0, 10);
                    const description = commentTextarea.value; // Lấy nội dung comment từ textarea


                    const data = { date, description };
                    console.log(data)
                    fetch(`https://aprartment-api.onrender.com/service/add-service-bill/${product._id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            token: `Bearer ${token}`,
                        },
                        body: JSON.stringify(data)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(response.statusText);
                            }
                            return response.text();
                        })
                        .then(data => {
                            console.log(data); // Log ra thông báo từ server
                        })
                        .catch(error => {
                            console.log(error); // Log ra lỗi nếu có
                        });




                    dialogOverlay.remove();
                });

                dialog.appendChild(close);
                dialog.appendChild(h2);
                dialog.appendChild(dateLabel);
                dialog.appendChild(dateInput);
                dialog.appendChild(commentLabel);
                dialog.appendChild(commentTextarea);
                dialog.appendChild(acceptButton);

                dialogOverlay.appendChild(dialog);

                document.body.appendChild(dialogOverlay);
            });


            productRow.appendChild(imageCell);
            productRow.appendChild(nameCell);
            productRow.appendChild(supplierCell);
            productRow.appendChild(typeCell);
            productRow.appendChild(priceCell);
            productRow.appendChild(detailCell);
            productRow.appendChild(statusCell);
            productRow.appendChild(useButton);

            productsWrapper.appendChild(productRow);
        });
    })
    .catch(error => console.error('Error fetching data from API:', error));

