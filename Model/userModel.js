import { Schema, model } from "mongoose";
import jwt from 'jsonwebtoken'
import { config } from "dotenv";
import bcrypt from 'bcryptjs'
config()
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true,
        default: "hello"
    },
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const user = this;
    const saltValue = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, saltValue)
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
    console.log(this.password)
    console.log(password)
}

userSchema.methods.generateWebToken = async function () {
    console.log(this)
    return jwt.sign({ id: this._id }, "bhavesh  ", {
        expiresIn: '2d'
    })
}

const User = model("User", userSchema)

export default User