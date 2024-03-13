import express from 'express'
import { protect } from '../Middleware/authMiddleWare.js'
import { accessChat, createGroupChat, fetchChats, renameGroupName } from '../Controller/chatControler.js'

const router = express.Router()

router.route('/')
    .post(protect, accessChat)
router.route('/')
    .get(protect, fetchChats)
router.route('/group')
    .post(protect, createGroupChat)
router.route('/rename')
    .put(protect, renameGroupName)
// router.route('/groupremove')
//     .put(protect, removeFromGroup)
// router.route('/groupadd')
//     .put(protect, addToGroup)


export default router

