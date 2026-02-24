import { renderHome, renderView, renderDashboard } from "./ui.js"

const params=new URLSearchParams(window.location.search)

if(params.get("view")){
 renderView(params.get("view"))
}
else if(params.get("dashboard")){
 renderDashboard()
}
else{
 renderHome()
}