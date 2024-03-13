import express from 'express'
import cors from 'cors'
import dbConnection from './Config/dbConnection.js'
import userRouter from './Router/userRoute.js'
const app = express()

app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', "DELETE", "UPDATE"],
    credentials: true
}))

app.use('/api/user', userRouter)
app.listen(5000, async () => {
    await dbConnection()
    console.log(`server is runnig at ${5000}`)
})