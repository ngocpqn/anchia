import { createSession, getSession } from "./session.js"
import { BANKS as STATIC_BANKS, loadBanks } from "./banks.js"

/* ================= UTIL ================= */

function qs(id){
  return document.getElementById(id)
}

function formatMoney(n){
  return Number(n).toLocaleString("vi-VN")
}

function showError(message){
  alert(message)
}

function buildVietQR(bin, acc, name, amount, note){
  return `https://api.vietqr.io/image/${bin}-${acc}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(name)}`
}

/* ================= STATE ================= */

let BANKS = STATIC_BANKS || []
let selectedBank = null

/* ================= HOME ================= */

export async function renderHome(){

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
    <input id="total" type="text" placeholder="Tổng tiền">
    <input id="count" type="number" value="5" min="1">
    <input id="note" placeholder="Nội dung chuyển khoản">

    <button id="createBtn" disabled>Tạo phiên</button>

    <hr>

    <button id="dashboardBtn">Xem Dashboard</button>

  </div>
  `

  const bankSelect = qs("bankSelect")
  const selected = bankSelect.querySelector(".bank-selected")
  const dropdown = bankSelect.querySelector(".bank-dropdown")
  const searchInput = bankSelect.querySelector("#bankSearch")
  const listContainer = bankSelect.querySelector(".bank-list")

  const accInput = qs("acc")
  const nameInput = qs("name")
  const totalInput = qs("total")
  const countInput = qs("count")
  const noteInput = qs("note")
  const createBtn = qs("createBtn")

  /* ================= LOAD BANKS ================= */

  try{
    if(loadBanks){
      const apiBanks = await loadBanks()
      if(apiBanks && apiBanks.length){
        BANKS = apiBanks
      }
    }
  }catch(e){
    console.warn("Fallback to local banks")
  }

  /* ================= RENDER BANK LIST ================= */

  function renderBankList(filter=""){

    listContainer.innerHTML=""

    const filtered = BANKS.filter(b =>
      b.name.toLowerCase().includes(filter.toLowerCase())
    )

    filtered.forEach(bank=>{

      const item = document.createElement("div")
      item.className="bank-item"

      const logo = bank.logo || `/icons/${bank.bin}.png`

      item.innerHTML = `
        <img src="${logo}" onerror="this.src='/icons/default.png'">
        <span>${bank.name}</span>
      `

      item.onclick = ()=>{

        selectedBank = bank

        selected.innerHTML = `
          <div class="bank-selected-inner">
            <img src="${logo}" onerror="this.src='/icons/default.png'">
            <span>${bank.name}</span>
          </div>
        `

        dropdown.classList.add("hidden")

        validateForm()
      }

      listContainer.appendChild(item)
    })
  }

  renderBankList()

  /* ================= DROPDOWN ================= */

  selected.onclick = ()=>{
    dropdown.classList.toggle("hidden")
    searchInput.focus()
  }

  searchInput.oninput = (e)=>{
    renderBankList(e.target.value)
  }

  document.addEventListener("click",(e)=>{
    if(!bankSelect.contains(e.target)){
      dropdown.classList.add("hidden")
    }
  })

  /* ================= FORMAT MONEY ================= */

  totalInput.addEventListener("input", e=>{

    let value = e.target.value.replace(/\D/g,"")

    if(!value){
      e.target.value=""
      validateForm()
      return
    }

    e.target.value = formatMoney(value)
    validateForm()
  })

  /* ================= VALIDATE ================= */

  function validateForm(){

    const valid =
      selectedBank &&
      accInput.value.trim() &&
      nameInput.value.trim() &&
      totalInput.value.trim() &&
      noteInput.value.trim() &&
      Number(countInput.value) > 0

    createBtn.disabled = !valid
  }

  accInput.oninput = validateForm
  nameInput.oninput = validateForm
  countInput.oninput = validateForm
  noteInput.oninput = validateForm

  /* ================= CREATE ================= */

  createBtn.onclick = ()=>{

    try{

      createBtn.innerText="Đang tạo..."
      createBtn.disabled=true

      const totalRaw = totalInput.value.replace(/\D/g,"")

      const id = createSession({
        bin: selectedBank.bin,
        acc: accInput.value.trim(),
        name: nameInput.value.trim().toUpperCase(),
        total: Number(totalRaw),
        count: Number(countInput.value),
        note: noteInput.value.trim()
      })

      window.location="?view="+id

    }catch(err){

      console.error(err)

      showError("Có lỗi xảy ra")

      createBtn.innerText="Tạo phiên"
      createBtn.disabled=false
    }
  }

  qs("dashboardBtn").onclick = ()=>{
    window.location="?dashboard=1"
  }
}


/* ================= VIEW ================= */

export function renderView(id){

  const data = getSession(id)

  if(!data){
    qs("app").innerHTML = `
      <div class="container-lg">
        <h2>Không tìm thấy phiên</h2>
      </div>
    `
    return
  }

  const each = Math.floor(data.total / data.count)

  qs("app").innerHTML = `
  <div class="container-lg">

    <h2>Quét QR</h2>

    <p>Mỗi người: ${formatMoney(each)} VND</p>

    <div class="qr-grid"></div>

    <button id="backBtn" class="secondary-btn">← Quay lại</button>

  </div>
  `

  const grid = document.querySelector(".qr-grid")

  for(let i=1;i<=data.count;i++){

    const qrUrl = buildVietQR(
      data.bin,
      data.acc,
      data.name,
      each,
      data.note
    )

    const card = document.createElement("div")
    card.className="qr-card"

    card.innerHTML = `
      <p>Người ${i}</p>
      <img class="qr-img" src="${qrUrl}">
    `

    grid.appendChild(card)

    card.querySelector(".qr-img").onclick = ()=>{
      openQRModal(qrUrl)
    }
  }

  qs("backBtn").onclick = ()=> window.history.back()
}


/* ================= QR MODAL ================= */

function openQRModal(src){

  const modal = document.createElement("div")

  modal.className="qr-modal"

  modal.innerHTML = `
    <div class="qr-modal-box">
      <img src="${src}">
    </div>
  `

  modal.onclick = ()=> modal.remove()

  document.body.appendChild(modal)
}


/* ================= DASHBOARD ================= */

export function renderDashboard(){

  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]")

  let totalMoney = 0
  sessions.forEach(s => totalMoney += s.total)

  qs("app").innerHTML = `
  <div class="container-lg">

    <h2>Dashboard</h2>

    <div class="stat-bar">

      <div class="stat-card">
        <h3>Tổng phiên</h3>
        <strong>${sessions.length}</strong>
      </div>

      <div class="stat-card">
        <h3>Tổng tiền</h3>
        <strong>${formatMoney(totalMoney)} VND</strong>
      </div>

    </div>

    <button id="homeBtn">Về trang chính</button>

  </div>
  `

  qs("homeBtn").onclick = ()=> window.location="/"
}