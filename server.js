import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import dbConnection from './Config/dbConnection.js'

import userRouter from './Router/userRoute.js'
import chatRouter from './Router/chatRoute.js'
import messageRoute from './Router/messageRoute.js'
import { Server } from 'socket.io';

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

const server = app.listen(5000, async () => {
    await dbConnection()
    console.log(`server is runnig at ${5000}`)
})


const io = new Server(server, {
    pingTimeout: 600000,
    cors: {
        origin: "*"
    },
});



io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});