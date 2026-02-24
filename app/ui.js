export function renderHome(){
 document.getElementById("app").innerHTML=`
 <div class="container">
   <h2>Tạo phiên chia tiền</h2>

   <label>Ngân hàng</label>
   <input 
     id="bankInput"
     list="bankList"
     placeholder="Gõ tên hoặc mã BIN..."
     autocomplete="off"
     required
   />
   <datalist id="bankList"></datalist>

   <input id="acc" placeholder="Số tài khoản">
   <input id="name" placeholder="Tên chủ tài khoản">
   <input id="total" type="number" placeholder="Tổng tiền">
   <input id="count" type="number" value="5" placeholder="Số người">

   <button id="createBtn">Tạo phiên</button>
   <hr>
   <button id="dashboardBtn">Xem Dashboard</button>
 </div>
 `

 // ===== Hàm lấy BIN =====
 function extractBIN(){
  const value = document.getElementById("bankInput").value
  const match = value.match(/\d{6}$/)
  return match ? match[0] : value
 }

 // ===== Sự kiện tạo phiên =====
 document.getElementById("createBtn").onclick=()=>{

  const acc=document.getElementById("acc")
  const name=document.getElementById("name")
  const total=document.getElementById("total")
  const count=document.getElementById("count")

  const id=createSession({
   bin: extractBIN(),
   acc: acc.value,
   name: name.value.toUpperCase(),
   total: Number(total.value),
   count: Number(count.value)
  })

  window.location="?view="+id
 }

 // ===== Dashboard =====
 document.getElementById("dashboardBtn").onclick=()=>{
  window.location="?dashboard=1"
 }
}