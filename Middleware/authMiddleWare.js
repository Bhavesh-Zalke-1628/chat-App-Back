import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import asyncHandler from 'express-async-handler';
import { config } from "dotenv";
config()
const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, 'bhavesh');

            req.user = await User.findById(decoded.id).select("-password");
            if (req.user) {
                return next();
            } else {
                res.status(401);
                throw new Error("Not authorized, user not found");
            }
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

export {
    protect
};
