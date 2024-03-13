import asynchandler from 'express-async-handler'
import User from '../model/userModel.js'
const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false
}
const registerUser = asynchandler(async (req, res) => {
    const { name, email, password, pic } = req.body
    if (!name || !email || !password || !pic) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error('User already exist')
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    })
    const token = await user.generateWebToken()
    res.cookie("token", token, cookieOptions)
    await user.save()
    if (user) {
        res.status(200).json({
            succes: true,
            user
        })
    } else {
        throw new Error("Failed to create user")
    }
})

const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body
    console.log(email, password)
    try {

        if (!email || !password) {
            res.status(400)
            throw new Error("Please add all fields")
        }
        const user = await User.findOne({ email })
        if (!user && user.comparePassword(password)) {
            res.status(400)
            throw new Error("User not found")
        }

        const token = await user.generateWebToken()
        console.log(token)
        res.cookie('token', token, cookieOptions)
        await user.save()
        res.status(200).json({
            succss: true,
            msg: "User log in successfully",
            user,
            token
        })
    } catch (error) {

    }
})

const getUser = asynchandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            {
                name: {
                    $regex: req.query.search,
                    $options: 'i'
                },
                email: {
                    $regex: req.query.search,
                    $options: 'i'
                },
            }
        ]
    } : {}

    const user = await User.find(keyword)
    console.log(user)
    res.send(user)
})
export {
    registerUser,
    loginUser,
    getUser
}