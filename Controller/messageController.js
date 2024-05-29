import expressAsyncHandler from "express-async-handler"
import Message from "../Model/messageModel.js";
import User from "../model/userModel.js";
import Chat from "../Model/chatModel.js";
const sendMessage = expressAsyncHandler(async (req, res, next) => {
    const { content, chatId } = req.body
    if (!content || !chatId) {
        console.log('invalid data can pass')
        return res.statusCode(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }
    try {
        var message = await Message.create(newMessage)
        message = await message.populate("sender", "name")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name email'
        })


        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        console.log(message)
        res.json(message)
    } catch (error) {
        res.status(400)
        throw new error(error.message)
    }
})


const allMessages = expressAsyncHandler(async (req, res, next) => {


    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new error(error.message)
    }
})

export {
    sendMessage,
    allMessages
}