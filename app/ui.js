import { createSession, getSession } from "./session.js"
import { generateQR } from "./qr.js"

export function renderHome(){
 document.getElementById("app").innerHTML=`
 <div class="container">
   <h2>Tạo phiên chia tiền</h2>
   <input id="bin" placeholder="BIN ngân hàng">
   <input id="acc" placeholder="Số tài khoản">
   <input id="name" placeholder="Tên chủ tài khoản">
   <input id="total" type="number" placeholder="Tổng tiền">
   <input id="count" type="number" value="5" placeholder="Số người">
   <button id="createBtn">Tạo phiên</button>
   <hr>
   <button id="dashboardBtn">Xem Dashboard</button>
 </div>
 `

 document.getElementById("createBtn").onclick=()=>{
  const id=createSession({
   bin:bin.value,
   acc:acc.value,
   name:name.value.toUpperCase(),
   total:Number(total.value),
   count:Number(count.value)
  })
  window.location="?view="+id
 }

 document.getElementById("dashboardBtn").onclick=()=>{
  window.location="?dashboard=1"
 }
}

export function renderView(id){
 const data=getSession(id)
 if(!data){
  document.getElementById("app").innerHTML="Không tìm thấy phiên"
  return
 }

 const each=Math.floor(data.total/data.count)

 let html=`<div class="container">
 <h2>Quét QR</h2>
 <p>Mỗi người: ${each.toLocaleString()} VND</p>
 `

 for(let i=1;i<=data.count;i++){
  html+=`
   <div>
    <p>Người ${i}</p>
    <canvas id="qr${i}"></canvas>
   </div>
  `
 }

 html+=`</div>`
 document.getElementById("app").innerHTML=html

 for(let i=1;i<=data.count;i++){
  generateQR(
   data.bin,
   data.acc,
   data.name,
   each,
   "NGUOI_"+i,
   "qr"+i
  )
 }
}

export function renderDashboard(){
 const sessions=JSON.parse(localStorage.getItem("sessions")||"[]")

 let totalMoney=0
 sessions.forEach(s=> totalMoney+=s.total)

 document.getElementById("app").innerHTML=`
 <div class="container">
   <h2>Dashboard</h2>
   <p>Tổng phiên: ${sessions.length}</p>
   <p>Tổng tiền: ${totalMoney.toLocaleString()} VND</p>
   <button onclick="window.location='/'">Về trang chính</button>
 </div>
 `
}