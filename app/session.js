import { getSessions, saveSessions } from "./storage.js"

export function createSession(data){
 const sessions=getSessions()
 data.id=Date.now().toString()
 sessions.push(data)
 saveSessions(sessions)
 return data.id
}

export function getSession(id){
 return getSessions().find(s=>s.id===id)
}