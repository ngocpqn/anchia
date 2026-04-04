import { BANKS } from "./banks.js"
import { renderHome, renderView, renderDashboard } from "./ui.js"

const params=new URLSearchParams(window.location.search)

function loadBanks(){
  const datalist = document.getElementById("bankList")
  if(!datalist) return

  datalist.innerHTML = ""

  BANKS.forEach(bank=>{
    const option = document.createElement("option")
    option.value = `${bank.name} - ${bank.bin}`
    datalist.appendChild(option)
  })
}

if(params.get("dashboard")){
 document.body.className = "hold-transition sidebar-mini"
 renderDashboard()
}
else{
 document.body.className = ""   // dùng UI cũ
 renderHome()
 loadBanks()
}
else{
 renderHome()
 loadBanks()   // ✅ GỌI Ở ĐÂY
}