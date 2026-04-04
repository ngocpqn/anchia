const params = new URLSearchParams(window.location.search)

if(params.get("dashboard")){
  document.body.className = "hold-transition sidebar-mini layout-fixed"
  renderDashboard()
}
else if(params.get("view")){
  document.body.className = ""
  renderView(params.get("view"))
}
else{
  document.body.className = ""
  renderHome()
  loadBanks()
}