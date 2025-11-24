import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized Access - Token missing");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid or Expired Access Token");
    }

    const user = await User.findById(decodedToken._id).select(
        "-password -refreshtokens"
    );

    if (!user) {
        throw new ApiError(401, "Invalid Access Token - User not found");
    }

    req.user = user;
    next();
});
