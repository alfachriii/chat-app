import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/user.model.js";
config();
const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId, contactId, res) => {
  const token = jwt.sign({ userId, contactId }, JWT_SECRET, {
    expiresIn: "5d",
  });

  res.cookie("jwt", token, {
    masAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "dev",
  });

  return token;
};

export const findUsersByIds = async (userIds) => {
  try {
    const users = await User.find({ _id: { $in: userIds } }).select("-password");
    return users;
  } catch (err) {
    console.error("Error saat mencari data:", err);
  }
};
