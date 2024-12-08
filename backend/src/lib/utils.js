import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/user.model.js";
import cloudinary from "./cloudinary.js";
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

export const updateName = async (req, res) => {

}

export const updateProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id
    
    if(!profilePic) return res.status(400).json({ message: "Profile pic is required"})
    
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    )

    res.status(200).json(updateUser)
  } catch (error) {
    console.log("Error in update profile pic: ", error)
    res.status(500).json({ message: "Internal servel error" })
  }
}

export const updateAbout = async (req, res) => {

}

export const updateContact = async (req, res) => {

}

