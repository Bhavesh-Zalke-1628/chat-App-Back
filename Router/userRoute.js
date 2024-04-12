import { Router } from "express";
import { getUser, loginUser, registerUser } from "../Controller/userController.js";
// import { protect } from "../Middleware/authMiddleWare.js";


const router = Router();


router.route('/')
    .post(registerUser)
    .get(
        getUser)
router.route('/login').post(loginUser)

export default router