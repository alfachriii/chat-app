import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model.js";
import { config } from "dotenv";
config();

const JWT_SECRET = process.env.JWT_SECRET;

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded)
      return res.status(401).json({ message: "Unauthorized - Invalid token." });

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
