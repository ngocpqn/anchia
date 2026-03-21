import { createSession, getSession } from "./session.js"
import { BANKS } from "./banks.js"

/* ================= UTIL ================= */

const qs = id => document.getElementById(id)

const formatMoney = n => Number(n).toLocaleString("vi-VN")

const buildVietQR = (bin, acc, name, amount, note) =>
  `https://img.vietqr.io/image/${bin}-${acc}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(name)}`


/* ================= HOME ================= */

export function renderHome(){

  qs("app").innerHTML = `
  <div class="container-sm">

    <h2>Tạo phiên chia tiền</h2>

    <label>Ngân hàng</label>

    <div class="bank-select" id="bankSelect">

      <div class="bank-selected">
        <span>Chọn ngân hàng</span>
        <span>▼</span>
      </div>

      <div class="bank-dropdown hidden">
        <input type="text" id="bankSearch" placeholder="Tìm ngân hàng...">
        <div class="bank-list"></div>
      </div>

    </div>

    <input id="acc" placeholder="Số tài khoản">
    <input id="name" placeholder="Tên chủ tài khoản">
    <input id="total" placeholder="Tổng tiền">
    <input id="count" type="number" value="5" min="1">
    <input id="note" placeholder="Nội dung chuyển khoản">

    <button id="createBtn" disabled>Tạo phiên</button>

    <hr>

    <button id="dashboardBtn">Xem Dashboard</button>

  </div>
  `

  let selectedBank = null

  const bankSelect = qs("bankSelect")
  const selected = bankSelect.querySelector(".bank-selected")
  const dropdown = bankSelect.querySelector(".bank-dropdown")
  const searchInput = qs("bankSearch")
  const list = bankSelect.querySelector(".bank-list")

  const acc = qs("acc")
  const name = qs("name")
  const total = qs("total")
  const count = qs("count")
  const note = qs("note")
  const btn = qs("createBtn")

  /* ===== BANK LIST ===== */

  function renderBanks(filter=""){
    list.innerHTML = ""

    BANKS
      .filter(b => b.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach(bank => {

        const el = document.createElement("div")
        el.className = "bank-item"

        el.innerHTML = `
          <img src="https://img.vietqr.io/image/${bank.bin}.png"
               onerror="this.src='https://via.placeholder.com/24'">
          <span>${bank.name}</span>
        `

        el.onclick = () => {
          selectedBank = bank

          selected.innerHTML = `
            <div class="bank-selected-inner">
              <img src="https://img.vietqr.io/image/${bank.bin}.png">
              <span>${bank.name}</span>
            </div>
          `

          dropdown.classList.add("hidden")
          validate()
        }

        list.appendChild(el)
      })
  }

  renderBanks()

  selected.onclick = () => {
    dropdown.classList.toggle("hidden")
    searchInput.focus()
  }

  searchInput.oninput = e => renderBanks(e.target.value)

  document.addEventListener("click", e=>{
    if(!bankSelect.contains(e.target)) dropdown.classList.add("hidden")
  })

  /* ===== FORMAT MONEY ===== */

  total.oninput = e=>{
    let v = e.target.value.replace(/\D/g,"")
    e.target.value = v ? formatMoney(v) : ""
    validate()
  }

  /* ===== VALIDATE ===== */

  function validate(){
    btn.disabled = !(
      selectedBank &&
      acc.value &&
      name.value &&
      total.value &&
      note.value &&
      Number(count.value) > 0
    )
  }

  acc.oninput = validate
  name.oninput = validate
  count.oninput = validate
  note.oninput = validate

  /* ===== CREATE ===== */

  btn.onclick = ()=>{
    try{
      btn.innerText = "Đang tạo..."
      btn.disabled = true

      const id = createSession({
        bin: selectedBank.bin,
        acc: acc.value.trim(),
        name: name.value.trim().toUpperCase(),
        total: Number(total.value.replace(/\D/g,"")),
        count: Number(count.value),
        note: note.value.trim()
      })

      window.location = "?view=" + id

    }catch{
      alert("Lỗi tạo phiên")
      btn.innerText = "Tạo phiên"
      btn.disabled = false
    }
  }

  qs("dashboardBtn").onclick = ()=> window.location="?dashboard=1"
}


/* ================= VIEW ================= */

export function renderView(id){

  const data = getSession(id)

  if(!data){
    qs("app").innerHTML = `<div class="container-lg"><h2>Không tìm thấy</h2></div>`
    return
  }

  const each = Math.floor(data.total / data.count)

  qs("app").innerHTML = `
  <div class="container-lg">

    <h2>Quét QR</h2>
    <p>${formatMoney(each)} VND / người</p>

    <div class="qr-grid"></div>

    <button id="backBtn" class="secondary-btn">← Quay lại</button>

  </div>
  `

  const grid = document.querySelector(".qr-grid")

  for(let i=1;i<=data.count;i++){

    const url = buildVietQR(
      data.bin,
      data.acc,
      data.name,
      each,
      data.note   // ✅ KHÔNG GHÉP _i
    )

    const card = document.createElement("div")
    card.className = "qr-card"

    card.innerHTML = `
      <p>Người ${i}</p>
      <img class="qr-img" src="${url}">
    `

    grid.appendChild(card)

    card.querySelector(".qr-img").onclick = ()=> openModal(url)
  }

  qs("backBtn").onclick = ()=> history.back()
}


/* ================= MODAL ================= */

function openModal(src){
  const m = document.createElement("div")
  m.className = "qr-modal"

  m.innerHTML = `
    <div class="qr-modal-box">
      <img src="${src}">
    </div>
  `

  m.onclick = ()=> m.remove()
  document.body.appendChild(m)
}


/* ================= DASHBOARD ================= */

export function renderDashboard(){

  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]")

  const total = sessions.reduce((s,x)=>s+x.total,0)

  qs("app").innerHTML = `
  <div class="container-lg">

    <h2>Dashboard</h2>

    <div class="stat-bar">
      <div class="stat-card">
        <h3>Số phiên</h3>
        <strong>${sessions.length}</strong>
      </div>

      <div class="stat-card">
        <h3>Tổng tiền</h3>
        <strong>${formatMoney(total)} VND</strong>
      </div>
    </div>

    <button onclick="location='/'">Trang chủ</button>

  </div>
  `
}