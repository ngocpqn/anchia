const params = new URLSearchParams(window.location.search)

console.log("params:", window.location.search)

if(params.get("dashboard") === "1"){
  console.log("👉 vào dashboard")

  document.body.className = "hold-transition sidebar-mini layout-fixed"

  renderDashboard()
}
else if(params.get("view")){
  renderView(params.get("view"))
}
else{
  renderHome()
  loadBanks()
}