import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/user.model.js";
import cloudinary from "./cloudinary.js";
import Contact from "../models/contact.model.js";
import { PersonalMessage } from "../models/message.model.js";
import { getReceiverSocketId, io } from "./socket.js";
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

export const findUsersByEmails = async (emails) => {
  try {
    const users = await User.find({
      $or: emails.map((email) => ({
        email: { $regex: email, $options: "i" }, // 'i' untuk case-insensitive
      })),
    }).select("-password");
    return users;
  } catch (err) {
    console.error("Error saat mencari data:", err);
  }
};

export const updateName = async (req, res) => {
  const userId = req.user._id
  const { newName } = req.body
  try {
    if(!newName) return res.status(400).json({ message: "Field must not be empty"})

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name: newName
      }
    )

    await user.save()

    res.status(200).json({ user: user, message: "Name updated successfully"})
  } catch (error) {
    console.log("Error on update name controller: ", error)
    res.status(500).json({ message: "Internal server error."})
  }
};

export const updateAbout = async (req, res) => {
  const userId = req.user._id
  const { newAbout } = req.body
  try {
    if(!newAbout) return res.status(400).json({ message: "Field must not be empty"})

    const user = await User.findByIdAndUpdate(
      userId,
      {
        about: newAbout
      }
    )

    await user.save()

    res.status(200).json({ user: user, message: "About updated successfully"})
  } catch (error) {
    console.log("Error on update about controller: ", error)
    res.status(500).json({ message: "Internal server error."})
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic)
      return res.status(400).json({ message: "Profile pic is required" });

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    console.log("Error in update profile pic: ", error);
    res.status(500).json({ message: "Internal servel error" });
  }
};


export const updateContact = async (req, res) => {
  const userId = req.user._id;
  const data = req.body;
  try {
    const user = await User.findById(userId);
    const contactId = user.contactId;
    const contacts = await Contact.findById(contactId);

    if (!data) return res.status(400).json({ message: "Contact required!" });

    // validasi jika sudah ada contact dalam list
    if (contacts.contactList.some(contact => contact === data.userId)) {
      console.log("pix")
      return res.status(400).json({ message: "Contact already added." });
    } else {
      contacts.contactList.push(data.userId);

      await contacts.save();
    }

    res.status(200).json({ message: "Update Contact successfully" });
  } catch (error) {
    console.log("Error on update contact controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCloudinaryUrlId = (url) => {
  const idWithExt = url.split("/")[7];
  return idWithExt.split(".")[0];
};

export const getMimeType = (base64) => {
  const un = base64.split(";")[0]
  return un.split(":")[1]
}

export const updateMessageStatus = async (
  userId,
  updateStatus,
  messageIds = null
) => {
  const BATCH_SIZE = 50;
  try {
    if (messageIds) {
      const message = await PersonalMessage.findById(messageIds[0]);

      await PersonalMessage.updateMany(
        { _id: { $in: messageIds } },
        { $set: { status: updateStatus } }
      );

      if (message) {
        const receiverSocketId = getReceiverSocketId(message.senderId);
        console.log(receiverSocketId);
        io.to(receiverSocketId).emit("updateMessageStatus", {
          status: updateStatus,
          chatId: message.receiverId,
        });
      }

      return;
    }

    while (true) {
      const messages = await PersonalMessage.find({
        receiverId: userId,
        status: "sent",
      })
        .sort({ createdAt: 1 }) // Urutkan dari yang paling lama
        .limit(BATCH_SIZE); // Ambil batch kecil

      if (messages.length === 0) break; // Jika tidak ada dokumen lagi, keluar dari loop

      // Dapatkan ID dokumen yang akan diupdate
      const ids = messages.map((msg) => msg._id);

      // Update dokumen dengan ID yang ditemukan
      const result = await PersonalMessage.updateMany(
        { _id: { $in: ids } },
        { $set: { status: updateStatus } }
      );

      const receiverSocketId = getReceiverSocketId(
        messages[0].senderId.toString()
      );

      io.to(receiverSocketId).emit("updateMessageStatus", {
        status: updateStatus,
        chatId: messages[0].receiverId,
      });
    }

    // res.status(200).json(messageIds)
  } catch (error) {
    console.log(error);
  }
};