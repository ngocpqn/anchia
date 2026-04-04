export function renderLogin(){
  document.getElementById("app").innerHTML = `
  <div class="login-box">
    <div class="card">
      <div class="card-body login-card-body">
        <p class="login-box-msg">Đăng nhập</p>

        <input id="user" class="form-control mb-3" placeholder="User">
        <button id="loginBtn" class="btn btn-primary btn-block">Login</button>
      </div>
    </div>
  </div>
  `

  document.getElementById("loginBtn").onclick = async () => {
    const username = document.getElementById("user").value

    const res = await fetch("http://localhost:3000/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ username })
    })

    const data = await res.json()

    localStorage.setItem("token", data.token)

    window.location = "?dashboard=1"
  }
}