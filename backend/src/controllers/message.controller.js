import { response } from "express";
import cloudinary from "../lib/cloudinary.js";
import { findUsersByEmails } from "../lib/utils.js";
import Contact from "../models/contact.model.js";
import Message, { PersonalMessage } from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersInContact = async (req, res) => {
  try {
    const contactId = req.user.contactId;
    const contact = await Contact.findById(contactId);
    let userIds = [];
    contact.contactList.forEach((element) => {
      userIds.push(element.email);
    });

    const contacts = await findUsersByEmails(userIds);
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error in getUserInContact: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllContacts = async (req, res) => {
  const userId = req.user._id;
  try {
    const contacts = await User.find({ _id: { $ne: userId } });
    res.status(200).json(contacts);
  } catch (error) {
    console.log("Error on get all contacts controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPersonalMessages = async (req, res) => {
  
  try {
    const { id: userToChatId } = req.params
    const myId = req.user._id

    console.log(userToChatId)

    if(!userToChatId) return res.status(400).json({ message: "Fill query"})
    const messages = await Message.find({
      __t: "personal",
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    })

    res.status(200).json(messages)
  } catch (error) {
    console.log("Error on get messages controller: ", error)
    res.status(500).json({ message: "Internal serve error" })
  }
}

export const sendMessage = async (req, res) => {
  const { data } = req.body;
  const senderId = req.user._id;

  const { messageType } = req.params;
  switch (messageType) {
    case "personal":
      try {
        let file;


        if (data.file.data) {
          const uploadResponse = await cloudinary.uploader.upload(data.file.data);
          file = {
            name: uploadResponse.original_filename,
            sentAs: "image",
            size: uploadResponse.bytes,
            mimeType: uploadResponse.type,
            url: uploadResponse.secure_url
          }
        }
        console.log(file)

        const newMessage = new PersonalMessage({
          senderId,
          receiverId: data.receiverId,
          text: data.text,
          file: file
        });

        await newMessage.save();
        return  res.status(200).json(newMessage);
      } catch (error) {
        console.log("Error on send message controller: ", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      

    case "group":
      return res.status(400).json({ message: "group message coming soon" });
    default:
      return res.status(400).json({ error: "Invalid update type" });
  }
};

