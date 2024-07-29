const base_url = "https://tarmeezacademy.com/api/v1"
SetupUi()
showPosts()
function showPosts (){
  document.getElementById("all_posts").innerHTML = "";

  axios.get(`${base_url}/posts`)
  .then( (response) =>{
  let posts = response.data.data
      

      
  for (post of posts){
      var PostTitle = ""
      
      if (post.title != null){
          PostTitle = post.title;
      }else {
          PostTitle = "No Title for this post !"
      }

      document.getElementById("all_posts").innerHTML += `
          <div class="card shadow mb-5">
                  
                  <div class="card-header">
                      <img class="rounded-circle border border-2 mx-2" src="${post.author.profile_image}" alt="pro_pic" height="40" width="40">
                    <b class="cursor-pointer">@${post.author.username}</b>
                  </div>
                  <div class="card-body">
                    <img onclick="openEachPostDetails(${post.id})" class="cursor-pointer w-100 h-100" src="${post.image}" alt="post_pic">
                    <h6 class="my-2" style="color: gray;">
                      ${post.created_at}
                    </h6>  
                    <h5 onclick="openEachPostDetails(${post.id})" class="cursor-pointer mt-4">
                      ${PostTitle}
                    </h5>
                    <p onclick="openEachPostDetails(${post.id})" class="cursor-pointer">${post.body}</p>
                    <hr>
                    <div>
                      <span class="cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
                              <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                              <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                            </svg>
                          (${post.comments_count}) Comments
                          <span id="post_tags_${post.id}">
                              
                          </span>
                      </span>
                      
                    </div>
                  </div>
              </div>
      `
      const currentPostTagid = `post_tag_${post.id}`
      const tags_div = document.getElementById(currentPostTagid)
      for (tag of post.tags){
        tags_div.innerHTML += `<span class="badge text-bg-secondary">${tag.name}</span>`
      }
  }
  })
  .catch(  (error)=> {
    showAlert(error.response.data.message,'danger')
  })
  }



function showAlert (message,type='success'){
  const alertPlaceholder = document.getElementById('sucess_alert')
  const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}
  appendAlert(message, type)
  const alert_tohide = bootstrap.Alert.getOrCreateInstance('#sucess_alert')
  setTimeout(() => {
    alert_tohide.close()
  }, 2000);
}

function LoginBtnClicked (){
  const username = document.getElementById("user_name").value;
  const password = document.getElementById("user_password").value;
  const url = `${base_url}/login`
  const params = {
    "username": username,
    "password": password
  }
  axios.post (url,params)
  .then((response)=>{
    localStorage.setItem("token",response.data.token)
    localStorage.setItem("user",JSON.stringify(response.data.user))
    bootstrap.Modal.getInstance(document.getElementById("exampleModal")).hide()
    showAlert('User Logged in Succesfully !','success')
    SetupUi();
  })
  .catch((error)=>{
    showAlert(error.response.data.message,'danger')
  })
}

function SetupUi (){
  const token = localStorage.getItem("token")
  const login_button = document.getElementById("loginbtn")
  const register_button = document.getElementById("registerbtn")
  const logout_button = document.getElementById("logoutBtn")
  const plus_button = document.querySelector(".plus-btn");
  const logged_user_info = document.querySelector(".to_add")
  if (token == null ){
    login_button.style.display = "block"
    register_button.style.display = "block"
    logout_button.style.display = "none"
    plus_button.style.display = "none"
    logged_user_info.style.display = "none"

  } else {
    const userData = JSON.parse(localStorage.getItem("user"));
    document.querySelector(".to_add").innerHTML += `
    <img class="logged_user_image" src="${userData.profile_image}" height="50" width="50" alt="">
    <h6 class="logged_user_name">@${userData.username}</h6>
    `
    
    

    login_button.style.display = "none"
    register_button.style.display = "none"
    logout_button.style.display = "block"
    logged_user_info.style.display = "flex"

    setTimeout(() => {
      plus_button.style.display = "block"
    }, 2000);
  }
  
}
function LogoutUser (){
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  showAlert('User Logged out Succesfully !')
  SetupUi()
}

function UserRegisterClicked(){
  const username = document.getElementById("reg_user_name").value;
  const password = document.getElementById("reg_user_password").value;
  const name = document.getElementById("reg_name").value;


  const url = `${base_url}/register`
  const params = {
    "username": username,
    "password": password,
    "name": name,
  }
  axios.post (url,params)
  .then((response)=>{
    localStorage.setItem("token",response.data.token)
    localStorage.setItem("user",JSON.stringify(response.data.user))
    bootstrap.Modal.getInstance(document.getElementById("exampleModal1")).hide()
    showAlert('User Registred Succesfully !','success')
    SetupUi();
    
  })
  .catch((error)=>{

    showAlert(error.response.data.message,'danger')
  })
}

function CreateNewPostClicked (){
  const title = document.getElementById("post_title_input").value;
  const body = document.getElementById("post_body_input").value;
  const image = document.getElementById("post_image_input").files[0];
  let formData = new FormData();
  formData.append("body",body)
  formData.append("title", title)
  formData.append("image",image)
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${token}`
  }
  const url = `${base_url}/posts`
  axios.post (url,formData,{
    headers :headers
  })
  .then((response)=>{
    bootstrap.Modal.getInstance(document.getElementById("exampleModal2")).hide()
    showAlert('Post Created Succesfully !','success')
    showPosts()
    
  })
  .catch((error)=>{

    showAlert(error.response.data.message,'danger')
  })
}


function openEachPostDetails(post_id) {
  axios.get(`${base_url}/posts/${post_id}`)
  .then(function (response) {
    const post_detail = response.data.data
    document.getElementById("all_posts").innerHTML = `
  <div class="d-flex">
  <h4 >${post_detail.author.name}'s Post : </h4>
  </div>
            <div class="card shadow mb-5 mt-3">
                  <div class="card-header">
                      <img class="rounded-circle border border-2 mx-2" src="${post_detail.author.profile_image}" alt="pro_pic" height="40" width="40">
                    <b>@${post_detail.author.username}</b>
                  </div>
                  <div class="card-body">
                    <img class="cursor-pointer w-100 h-100" src="${post_detail.image}" alt="post_pic">
                    <h6 class="my-2" style="color: gray;">
                    ${post_detail.created_at}
                    </h6>  
                    <h5 class=" mt-4">
                    ${post_detail.title}
                    </h5>
                    <p>${post_detail.body}</p>
                    <hr>
                    <div>
                      <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
                              <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                              <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                            </svg>
                          (${post_detail.comments_count}) Comments
                          <span>

                          </span>
                      </span>
                      
                      <div id="comments">
                          
                      </div>
                    </div>
                    
                  </div>
              </div>
              `
    

  const comments = post_detail.comments
  
  for (comment of comments) {
    document.getElementById("comments").innerHTML += `
    <div class="p-3">
  <hr>
    <img class="rounded-circle border border-2 mx-2" src="${comment.author.profile_image}" alt="pro_pic" height="40" width="40">
    <b>@${comment.author.username}</b>
    <p class="p-3">${comment.body}</p>
  <div>`
  }
  })

  .catch(function (error) {
    showAlert(error.response.data.message,'danger')
  })
  .finally(function () {
    token = localStorage.getItem("token");
  if (token !=null){
    document.getElementById("comments").innerHTML += `
    <div class="p-3">
    <hr/>
    <input id = "comment_input" type="text" placeholder="enter your comment">
    <button onclick="addComment(${post_id})" type="button" class="btn btn-primary">Comment</button>
  <div>`
  } else {
    document.getElementById("comments").innerHTML += ""
  }
  });
  

}

function addComment (post_id){
  var user_comment = document.getElementById("comment_input").value;
  let params = {
    "body":user_comment
  }

  let token = localStorage.getItem("token")


  axios.post(`${base_url}/posts/${post_id}/comments`,params,{
    headers : {
      "authorization":`Bearer ${token}`
    }
  })
  .then(function (response) {
    location.reload()
  })
  .catch(function (error) {
    // handle error
    showAlert(error.response.data.message,'danger')
  })
}
