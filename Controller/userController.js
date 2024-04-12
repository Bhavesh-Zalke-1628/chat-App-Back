import asynchandler from 'express-async-handler'
import User from '../model/userModel.js'
const cookieOption = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 1000, //for the 7 days login token
    secure: true
}
const registerUser = asynchandler(async (req, res) => {
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
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
        console.log(user)
        if (!user && user.comparePassword(password)) {
            res.status(400)
            throw new Error("User not found")
        }

        // Generate the JWT token
        const token = await user.generateWebToken()

        // Stored the generated token in the cookie
        res.cookie('token', token, cookieOption)

        await user.save()
        console.log(user)
        res.status(200).json({
            succss: true,
            msg: "User log in successfully",
            user,
            token
        })
    } catch (error) {
        throw new Error(error)
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