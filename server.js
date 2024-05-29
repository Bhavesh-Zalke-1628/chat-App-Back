import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import dbConnection from './Config/dbConnection.js'


import userRouter from './Router/userRoute.js'
import chatRouter from './Router/chatRoute.js'
import messageRoute from './Router/messageRoute.js'

const app = express()
import { config } from 'dotenv'
config()
app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', "DELETE", "UPDATE", "PUT"],
    credentials: true
}))

app.use(morgan('dev'))

app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRoute)

app.listen(5000, async () => {
    await dbConnection()
    console.log(`server is runnig at ${5000}`)
})