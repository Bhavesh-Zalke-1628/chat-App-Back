import express from 'express'
import { chats } from './data/data.js'
import cors from 'cors'
import dbConnection from './Config/dbConnection.js'

const app = express()

app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', "DELETE", "UPDATE"],
    credentials: true
}))

app.get('/api/chat', (req, res) => {
    res.send(chats)
})

app.get('/api/chat/:id', (req, res) => {
    // console.log(req.params.id)
    const singleChat = chats.find(c => c._id === req.params.id)
    console.log(singleChat)
    res.send(singleChat)
})
app.listen(5000, async () => {
    await dbConnection()
    console.log(`server is runnig at ${5000}`)
})