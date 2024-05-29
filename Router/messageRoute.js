import { Router } from "express";
import { protect } from "../Middleware/authMiddleWare";
import { allMessages, sendMessage } from "../Controller/messageController";
const router = Router()

router.route('/')
    .post(protect, sendMessage)

router.route('/:chatId')
    .get(allMessages)

export default router