import { Router } from "express";
import { protect } from "../Middleware/authMiddleWare.js";
import { allMessages, sendMessage } from "../Controller/messageController.js";
const router = Router()

router.route('/')
    .post(protect, sendMessage)

router.route('/:chatId')
    .get(allMessages)
    

export default router