import { Schema, model } from "mongoose";

const usetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})


const User = model("User", usetSchema)

export default User