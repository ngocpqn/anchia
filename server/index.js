import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

let sessions = []

// login fake
app.post("/login", (req, res) => {
  const { username } = req.body

  res.json({
    token: "abc123",
    user: {
      name: username,
      role: "admin"
    }
  })
})

// create session
app.post("/sessions", (req, res) => {
  const data = req.body
  data.id = Date.now()

  sessions.push(data)

  res.json(data)
})

// get sessions
app.get("/sessions", (req, res) => {
  res.json(sessions)
})

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000")
})