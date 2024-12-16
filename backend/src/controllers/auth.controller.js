import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  generateToken,
  getCloudinaryUrlId,
  updateAbout,
  updateContact,
  updateName,
  updateProfilePic,
} from "../lib/utils.js";
import Contact from "../models/contact.model.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Simpan user terlebih dahulu
    if (newUser) {
      await newUser.save();

      const newContact = new Contact({
        user: newUser._id,
        contactList: ["675d2abaed702ec4fec29833"]
      });
      await newContact.save();

      // Update user dengan contactId langsung setelah contact dibuat
      newUser.contactId = newContact._id;
      await newUser.save();

      generateToken(newUser._id, newUser.contactId, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        contactId: newUser.contactId,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in singup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, user.contactId, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      contactId: user.contactId,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const logout = async (req, res) => {
  const { userId } = req.user._id;
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkStatusUser = (req, res) => {
  try {
    const { id: userId } = req.params;
  } catch (error) {}
};

export const updateProfile = (req, res) => {
  const { type: typeOfUpdate } = req.params;
  switch (typeOfUpdate) {
    case "profile-pic":
      return updateProfilePic(req, res);

    case "name":
      return updateName(req, res);

    case "about":
      return updateAbout(req, res);

    case "contact":
      return updateContact(req, res);

    default:
      return res.status(400).json({ error: "Invalid update type" });
  }
};

export const deleteProfilePic = async (req, res) => {
  const profilePicUrl = req.user.profilePic;
  const userId = req.user._id;
  const imageId = getCloudinaryUrlId(profilePicUrl);
  try {
    await cloudinary.api.delete_resources(imageId, {
      type: "upload",
      resource_type: "image",
    });
    const updateUser = await User.findByIdAndUpdate(userId, { profilePic: "" });

    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log("Error on deleteProfilePic controller: ", error);
  }
};
