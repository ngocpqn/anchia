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

if(params.get("view")){
 renderView(params.get("view"))
}
else if(params.get("dashboard")){
 renderDashboard()
}
else{
 renderHome()
 loadBanks()   // ✅ GỌI Ở ĐÂY
}