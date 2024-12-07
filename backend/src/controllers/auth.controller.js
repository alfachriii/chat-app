import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import Contact from "../models/contact.model.js";

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

    const newContact = new Contact({
      email,
      contactList: [{ userId: "6753ecc116b9f58330b56a79" }],
    });

    console.log(newContact._id);

    if (newContact) {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        contactId: newContact._id,
      });

      if (newUser) {
        generateToken(newUser._id, newContact._id, res);
        await newUser.save();
        await newContact.save();

        res.status(201).json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          contactId: newUser.contactId,
          profilePic: newUser.profilePic,
        });
      }
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

export const logout = (req, res) => {
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
