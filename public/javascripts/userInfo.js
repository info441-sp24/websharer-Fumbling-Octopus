async function init(){
    await loadIdentity();
    console.log(`here is my`)
    loadUserInfo();
}

async function saveUserInfo(){
    //TODO: do an ajax call to save whatever info you want about the user from the user table
    //see postComment() in the index.js file as an example of how to do this
    document.getElementById("user-status").innerText = "sending data...";
    var newEmail = document.getElementById('user-email-input').value;
    var newDonut = document.getElementById('user-donut-input').value;

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    // console.log('Here is the email', newEmail)
    // console.log('Here is the donut', newDonut)
    try {
        await fetchJSON(`api/${apiVersion}/userInfo`, {
            method: "POST",
            body: {
                username: username,
                email: newEmail,
                favoriteDonut: newDonut
            }
        })
    } catch (error) {
        document.getElementById("user-status").innerText = "error"
        throw(error)
    }
    document.getElementById('user-email-input').value = "";
    document.getElementById('user-donut-input').value = "";
    document.getElementById("user-status").innerText = "Data saved!";
    document.getElementById("user_favorite_donut").innerHTML = "";
    document.getElementById("user_email").innerHTML = "";


    loadUserInfo()
}

async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    // const username = req.session.account.username
    // console.log(`here is my ${username}`)
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }
    
    //TODO: do an ajax call to load whatever info you want about the user from the user table
    let infoJSON = await fetchJSON(`api/${apiVersion}/userInfo?username=${username}`);
    let infoDiv = document.getElementById("user_info_div");

    let emailDiv = document.createElement("div");
    emailDiv.id = "user_email";
    emailDiv.innerHTML = `
        <p>Contact Email: ${escapeHTML(infoJSON.email)}</p>
    `;
    // console.log(''infoJSON.email)

    let donutDiv = document.createElement("div");
    donutDiv.id = "user_favorite_donut";
    donutDiv.innerHTML = `
        <p>Favorite Donut: ${escapeHTML(infoJSON.favoriteDonut)}</p>
    `;

    infoDiv.appendChild(emailDiv);
    infoDiv.appendChild(donutDiv);

    loadUserInfoPosts(username);
}


async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deletePost(postID){
    let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
        method: "DELETE",
        body: {postID: postID}
    })
    loadUserInfo();
}

