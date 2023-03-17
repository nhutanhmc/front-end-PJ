const customeInfor = JSON.parse(sessionStorage.getItem('userInfo-cus'));
const token = customeInfor.accessToken;
/****************Create post******************* */
const confirmBtn = document.querySelector('.confirm');
confirmBtn.addEventListener('click', () => {
    const tag = document.querySelector('#tag').value;
    const title = document.querySelector('#title').value;
    const content = document.querySelector('#content').value;
    const inputElement = document.querySelector('.chooseFileImg');
    const fileList = inputElement.files;

    if (fileList.length > 3) {
        alert('Vui lòng chọn tối đa 3 tệp tin ảnh!');
        inputElement.value = "";
        return;
    }

    const data = {
        tag: tag,
        content: content,
        title: title,
    };

    const formData = new FormData();

    if (fileList.length === 1) {
        const image = inputElement.files[0];
        formData.append('img', image);
    } else if (fileList.length === 2) {
        const image = inputElement.files[0];
        const image1 = inputElement.files[1];
        formData.append('img', image);
        formData.append('img', image1);
    } else if (fileList.length === 3) {
        const image = inputElement.files[0];
        const image1 = inputElement.files[1];
        const image2 = inputElement.files[2];
        formData.append('img', image);
        formData.append('img', image1);
        formData.append('img', image2);
    }

    formData.append('data', JSON.stringify(data));

    fetch('https://aprartment-api.onrender.com/post/new-post', {
        method: 'POST',
        headers: {
            token: `Bearer ${token}`
        },
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            alert('Tao don thanh cong');
            console.log(data)
        })
        .catch((error) => console.error(error));
});


/***********Get All tag******************** */
// gửi yêu cầu GET đến API để lấy danh sách tags
// gửi yêu cầu lấy tất cả các tags từ server
fetch("https://aprartment-api.onrender.com/post/all-tags", {
    method: 'GET',
    headers: {
        token: `Bearer ${token}`
    },
})
.then(response => response.json())
.then(allTags => {
  // lặp qua từng phần tử trong mảng allTags
  allTags.forEach(tag => {
    // tìm phần tử HTML có class là 'post-header forums-header' để thêm dữ liệu vào
    const postHeader = document.querySelector('.post-header.forums-header');

    // tạo các phần tử HTML mới
    const typeHeader = document.createElement('h3');
    const typeLink = document.createElement('a');
    const typeDiv = document.createElement('div');
    const countCell = document.createElement('td');

    typeHeader.textContent = `# ${tag.type} `;
    typeLink.href = `showforum.html`;
    typeLink.addEventListener('click', () => {
        sessionStorage.setItem('_id', tag._id);
    });
    countCell.className = 'forum-topic-count';
    countCell.textContent = tag.post_id.length;

    // tạo các phần tử HTML mới để thêm vào bảng
    const row = document.createElement('tr');
    const typeCell = document.createElement('td');

    // thêm các phần tử vào bảng
    postHeader.querySelector('tbody').appendChild(row);
    row.appendChild(typeCell);
    row.appendChild(countCell);
    typeCell.appendChild(typeLink);
    typeLink.appendChild(typeDiv);
    typeDiv.appendChild(typeHeader);
  });
})
.catch(error => console.error(error));

/********get own tag*********/

// Lấy phần tử HTML <ul> có class là "list-unstyled ticket_categories"
const ticketCategories = document.querySelector(".list-unstyled.ticket_categories");

// Gửi yêu cầu GET đến API server
fetch("https://aprartment-api.onrender.com/post/owned-posts", {
    method: 'GET',
    headers: {
        token: `Bearer ${token}`
    },
})
.then(response => response.json())
.then(data => {
    // Tạo mảng HTML chứa danh sách các bài viết
    const postList = data.posts.map(post => {
        // Tạo đường link chứa title của bài viết
        const postLink = document.createElement("a");
        postLink.className = "bbp-forum-title";
        postLink.textContent = post.title;
        postLink.href = "question.html";

        // Lưu _id của bài viết vào session storage khi người dùng nhấp vào title
        postLink.addEventListener("click", function() {
            sessionStorage.setItem("postId", post._id);
        });

        // Đếm số phần tử trong mảng comment_id nằm trong mảng posts
        const commentCount = data.posts.filter(p => p.comment_id?.includes(post._id)).length;

        // Tạo phần tử HTML <li> chứa title và số lượng comment
        const postListItem = document.createElement("li");
        postListItem.appendChild(postLink);

        const commentCountSpan = document.createElement("span");
        commentCountSpan.className = "count";
        commentCountSpan.textContent = commentCount;
        postListItem.appendChild(commentCountSpan);

        return postListItem;
    });

    // Thêm các phần tử HTML vào phần tử <ul> đã lấy ở trên
    postList.forEach(post => {
        ticketCategories.appendChild(post);
    });
})
.catch(error => {
    console.error(error);
});

