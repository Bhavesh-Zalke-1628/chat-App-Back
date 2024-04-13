import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import asyncHandler from 'express-async-handler';
import { config } from "dotenv";
config()
const protect = asyncHandler(async (req, res, next) => {
    let token;
    console.log(req.headers.authorization.startsWith("Bearer"))
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log("Token received:", token); // Log token for debugging

            const decoded = jwt.verify(token, 'bhavesh');
            console.log("Decoded token payload:", decoded); // Log decoded token payload

            req.user = await User.findById(decoded.id).select("-password");
            if (req.user) {
                return next();
            } else {
                res.status(401);
                throw new Error("Not authorized, user not found");
            }
        } catch (error) {
            console.error("Token verification error:", error); // Log token verification error
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
