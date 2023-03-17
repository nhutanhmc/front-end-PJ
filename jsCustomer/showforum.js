const customeInfor = JSON.parse(sessionStorage.getItem('userInfo-cus'));
const token = customeInfor.accessToken;
// Lấy giá trị _id từ sessionStorage
const id = sessionStorage.getItem('_id');

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


// Gửi yêu cầu đến API để lấy dữ liệu
// Lấy các phần tử DOM cần tương tác
const postWrapper = document.querySelector('.post-wraper');
const Num = -1;
fetch(`https://aprartment-api.onrender.com/post/all-posts?sort=${Num}&tagId=${id}`, {
    method: 'GET',
    headers: {
        token: `Bearer ${token}`
    },
})
    .then(response => response.json())
    .then(data => {
        const count = data.count;
        const posts = data.posts;

        // lặp qua từng phần tử trong mảng posts
        posts.forEach(post => {
            // tạo các phần tử HTML mới
            const postDiv = document.createElement('div');
            const postContentDiv = document.createElement('div');
            const authorAvataDiv = document.createElement('div');
            const avatarImg = document.createElement('img');
            const entryContentDiv = document.createElement('div');
            const postTitleH3 = document.createElement('h3');
            const postTitleLink = document.createElement('a');
            const metaUl = document.createElement('ul');
            const metaLi = document.createElement('li');

            // thêm class cho các phần tử HTML mới
            postDiv.className = 'post';
            postContentDiv.className = 'post-content';
            authorAvataDiv.className = 'author-avata';
            avatarImg.className = 'avatar avatar-40 photo';
            entryContentDiv.className = 'entry-content';
            postTitleH3.className = 'post-title';
            metaUl.className = 'meta';

            // thiết lập giá trị cho các phần tử HTML mới
            postTitleLink.href = 'question.html';
            postTitleLink.textContent = post.title;
            postTitleLink.addEventListener('click', () => {
                sessionStorage.removeItem('postId'); // Xóa dữ liệu đã lưu trong sessionStorage
                sessionStorage.setItem('postId', post._id); // Lưu dữ liệu mới là post._id vào sessionStorage
            });

            if (post.imgUrls && post.imgUrls.length > 0) {
                avatarImg.src = post.imgUrls[0];
            } else {
                avatarImg.src = './img/avatar.JPG';
            }

            if (post.createdAt) {
                const dateStr = post.createdAt.split('T')[0].split('-').reverse().join('/');
                metaLi.textContent = dateStr;
            }

            // thêm các phần tử vào phần tử cha
            document.querySelector('.load-forum').appendChild(postDiv);
            postDiv.appendChild(postContentDiv);
            postContentDiv.appendChild(authorAvataDiv);
            authorAvataDiv.appendChild(avatarImg);
            postContentDiv.appendChild(entryContentDiv);
            entryContentDiv.appendChild(postTitleH3);
            postTitleH3.appendChild(postTitleLink);
            entryContentDiv.appendChild(metaUl);
            metaUl.appendChild(metaLi);
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