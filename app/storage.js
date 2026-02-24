export function saveSessions(data){
 localStorage.setItem("sessions",JSON.stringify(data))
}

export function getSessions(){
 return JSON.parse(localStorage.getItem("sessions")||"[]")
}