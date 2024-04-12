
// // // import jwt from "jsonwebtoken";
// // // import User from "../model/userModel.js";
// // // import asyncHandler from 'express-async-handler'
// // // const protect = asyncHandler(async (req, res, next) => {
// // //     let token;

// // //     if (
// // //         req.headers.authorization &&
// // //         req.headers.authorization.startsWith("Bearer")
// // //     ) {
// // //         try {
// // //             token = req.headers.authorization.split(" ")[1];

// // //             //decodes token id
// // //             const decoded = jwt.verify(token, 'bhavesh');

// // //             req.user = await User.findById(decoded.id).select("-password");
// // //             next();
// // //         } catch (error) {
// // //             res.status(401);
// // //             throw new Error("Not authorized, token failed");
// // //         }
// // //     }

// // //     if (!token) {
// // //         res.status(401);
// // //         throw new Error("Not authorized, no token");
// // //     }
// // // });

// // // export {
// // //     protect
// // // }




// // import jwt from "jsonwebtoken";
// // import User from "../model/userModel.js";
// // import asyncHandler from 'express-async-handler';

// // const protect = asyncHandler(async (req, res, next) => {
// //     let token;

// //     // Check if authorization header exists and starts with "Bearer"
// //     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
// //         try {
// //             // Extract token from authorization header
// //             token = req.headers.authorization.split(" ")[1];

// //             // Verify the token
// //             const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //             // Find user by decoded id
// //             req.user = await User.findById(decoded.id).select("-password");

// //             // If user is found, proceed to the next middleware
// //             if (req.user) {
// //                 return next();
// //             } else {
// //                 // If user is not found, return error
// //                 res.status(401);
// //                 throw new Error("Not authorized, user not found");
// //             }
// //         } catch (error) {
// //             // If token verification fails, return error
// //             res.status(401);
// //             throw new Error("Not authorized, token failed");
// //         }
// //     }

// //     // If no token is provided, return error
// //     if (!token) {
// //         res.status(401);
// //         throw new Error("Not authorized, no token");
// //     }
// // });

// // export {
// //     protect
// // };


import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import asyncHandler from 'express-async-handler';
import { config } from "dotenv";
config()
const protect = asyncHandler(async (req, res, next) => {

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            let token;
            token = req.headers.authorization.split(" ")[1];
            console.log("Token received:", token); // Log token for debugging

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
