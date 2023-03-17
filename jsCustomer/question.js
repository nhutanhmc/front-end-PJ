const customeInfor = JSON.parse(sessionStorage.getItem('userInfo-cus'));
const token = customeInfor.accessToken;
// Lấy giá trị _id từ sessionStorage
const id = sessionStorage.getItem('postId');

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
/****************************************** */

fetch(`https://aprartment-api.onrender.com/post/detail-post/${id}`, {
  method: 'GET',
  headers: {
    token: `Bearer ${token}`
  },
})
  .then(response => response.json())
  .then(data => {
    // Lấy dữ liệu cần thiết từ server
    const { title, content, imgUrls, author_id, createdAt, comment_id } = data;

    // Truyền dữ liệu vào các thành phần HTML tương ứng
    document.querySelector(".q-title h1").textContent = title;

    document.querySelector(".forum-post-content .content").textContent = content;

    if (imgUrls.length > 0) {
      // Lấy đối tượng div có id="img-post-ques"
      const imgPostQues = document.getElementById("img-post-ques");

      // Lấy phần tbody của table
      const tbody = imgPostQues.querySelector("table tbody");

      // Xóa hết các phần tử cũ trong tbody
      tbody.innerHTML = "";

      // Duyệt qua mảng ảnh và thêm từng ảnh vào tbody
      imgUrls.forEach((imgUrl) => {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = "";
        img.srcset = "";
        img.height = "500";
        img.width = "500";
        td.appendChild(img);
        tr.appendChild(td);
        tbody.appendChild(tr);
      });
    } else {
      // Nếu không có ảnh thì ẩn phần div chứa ảnh đi
      const imgPostQues = document.getElementById("img-post-ques");
      imgPostQues.style.display = "none";
    }


    const authorName = author_id.user_id.name;
    const authorImgUrl = author_id.user_id.imgURL;
    document.querySelector(".author-name").textContent = authorName;

    const authorImg = document.querySelector(".author img");
    authorImg.src = authorImgUrl;

    // Lấy thông tin ngày tạo bài post
    const createdDate = new Date(createdAt.split("T")[0]);
    const formattedDate = createdDate.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Truyền thông tin ngày tạo vào thành phần HTML tương ứng
    document.querySelector(".author-badge").textContent = `Ngày đăng: ${formattedDate}`;



  })
  .catch(error => console.log(error));

fetch(`https://aprartment-api.onrender.com/post/detail-post/${id}`, {
  method: 'GET',
  headers: {
    token: `Bearer ${token}`
  },
})
  .then(response => response.json())
  .then(data => {
    const { title, content, imgUrls, author_id, createdAt, comment_id } = data;

    // Lấy element cần gán dữ liệu vào
    const commentContainer = document.getElementById("cmt-post-ques");

    // Gán dữ liệu cho từng comment
    comment_id.comment_list.forEach(comment => {
      const commentDiv = document.createElement("div");
      commentDiv.className = "post";

      const authorAvatarDiv = document.createElement("div");
      authorAvatarDiv.className = "author-avata";

      const authorAvatarImg = document.createElement("img");
      authorAvatarImg.alt = "";
      authorAvatarImg.src = comment.resident_id.user_id.imgURL;
      authorAvatarImg.className = "avatar avatar-40 photo";
      authorAvatarImg.height = "40";
      authorAvatarImg.width = "40";
      authorAvatarImg.loading = "lazy";

      authorAvatarDiv.appendChild(authorAvatarImg);

      const entryContentDiv = document.createElement("div");
      entryContentDiv.className = "entry-content";

      const postTitle = document.createElement("h3");
      const postTitleLink = document.createElement("a");
      postTitleLink.href = "question.html";
      postTitleLink.innerText = comment.resident_id.user_id.name;
      postTitle.appendChild(postTitleLink);

      const metaList = document.createElement("ul");
      metaList.className = "meta";

      const metaListItem = document.createElement("li");
      const commentTime = comment.commentTime.split("T")[0].split("-").reverse().join("-");
      metaListItem.innerText = commentTime;

      metaList.appendChild(metaListItem);

      const commentContent = document.createElement("p");
      commentContent.className = "cmt-content";
      commentContent.innerText = comment.content;

      entryContentDiv.appendChild(postTitle);
      entryContentDiv.appendChild(metaList);
      entryContentDiv.appendChild(commentContent);

      const postContentDiv = document.createElement("div");
      postContentDiv.className = "post-content";
      postContentDiv.appendChild(authorAvatarDiv);
      postContentDiv.appendChild(entryContentDiv);

      commentDiv.appendChild(postContentDiv);

      commentContainer.querySelector("tbody").appendChild(commentDiv);
    });
  })
  .catch(error => console.log(error));

/*******Create comment *******/
const commentBox = document.querySelector('textarea');
const commentButton = document.querySelector('.send-cmt');

commentBox.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendComment();
  }
});

commentButton.addEventListener('click', () => {
  sendComment();
});

function sendComment() {
  const commentData = {
    content: commentBox.value
  };

  fetch(`https://aprartment-api.onrender.com/post/new-comment/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: `Bearer ${token}`
    },
    body: JSON.stringify(commentData)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      location.reload();
    })
    .catch(error => console.error(error));
}
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
