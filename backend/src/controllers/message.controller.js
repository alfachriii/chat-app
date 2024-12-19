import { response } from "express";
import cloudinary from "../lib/cloudinary.js";
import { findUsersByEmails, getMimeType, updateMessageStatus } from "../lib/utils.js";
import Contact from "../models/contact.model.js";
import Message, { PersonalMessage } from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import mongoose from "mongoose";

export const getChatList = async (req, res) => {
  try {
    const targetUserId = req.user._id;
    const userIds = await PersonalMessage.aggregate([
      {
        $match: {
          $or: [{ receiverId: targetUserId }, { senderId: targetUserId }],
        },
      },
      {
        $project: {
          _id: 0,
          userId: {
            $cond: {
              if: { $eq: ["$senderId", targetUserId] },
              then: "$receiverId",
              else: "$senderId",
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          ids: { $addToSet: "$userId" },
        },
      },
    ]);

    let contacts = [];
    if (userIds[0]) {
      contacts = await User.find({
        _id: { $in: userIds[0].ids },
      }).select(["-password", "-contactId"]);
    } else {
      const results = await User.findOne({
        email: "alfachri@email.com",
      }).select(["-password", "-contactId"]);
      contacts.push(results);
    }

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
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!userToChatId) return res.status(400).json({ message: "Fill query" });
    const messages = await Message.find({
      __t: "personal",
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error on get messages controller: ", error);
    res.status(500).json({ message: "Internal serve error" });
  }
};

export const sendMessage = async (req, res) => {
  const { data } = req.body;
  const senderId = req.user._id;

  const { messageType } = req.params;
  switch (messageType) {
    case "personal":
      try {
        let file;

        if (data.file.data) {
          const mimeType = getMimeType(data.file.data);
          const type = mimeType.split("/")[0];
          console.log(mimeType);
          console.log(type);
          const uploadResponse = await cloudinary.uploader.upload(
            data.file.data,
            { resource_type: type }
          );
          file = {
            name: uploadResponse.original_filename,
            sentAs: type,
            size: uploadResponse.bytes,
            mimeType:
              mimeType ||
              `${uploadResponse.resource_type}/${uploadResponse.format}`,
            url: uploadResponse.secure_url,
          };
        }

        // const checkUserStatus = await User.findOne(
        //   { _id: data.receiverId }, // Filter berdasarkan receiverId
        //   { isLogout: 1 } // Proyeksi untuk hanya mengambil field isLogout
        // );

        const newMessage = new PersonalMessage({
          senderId,
          receiverId: data.receiverId,
          text: data.text,
          file: file,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(200).json(newMessage);
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

const getMessagesForUser = async (userId) => {
  console.log(userId.toString())
  try {
    const results = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $sort: {
          timestamp: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$senderId", userId] },
              then: "$receiverId",
              else: "$senderId",
            },
          },
          messages: { $push: "$$ROOT" },
        },
      },
      {
        $addFields: {
          // Mengurutkan array messages berdasarkan timestamp
          messages: {
            $sortArray: { input: "$messages", sortBy: { createdAt: -1 } }, // Urutkan berdasarkan createdAt descending
          },
        },
      },
      {
        $addFields: {
          latestMessage: { $arrayElemAt: ["$messages", 0] }, // Ambil pesan terbaru
        },
      },
      {
        $addFields: {
          unreadCount: {
            $cond: {
              if: { $ne: ["$latestMessage.senderId", userId] }, // Cek jika senderId dari pesan terbaru tidak sama dengan userId
              then: {
                $size: {
                  $filter: {
                    input: "$messages", // Array pesan
                    as: "message",
                    cond: { $ne: ["$$message.senderId", userId] }, // Filter pesan yang senderId bukan userId
                  },
                },
              },
              else: 0, // Tidak ada pesan yang belum dibaca
            },
          },
        },
      },
      {
        $project: {
          latestMessage: 1, // Tampilkan pesan terbaru
          unreadCount: 1, // Jumlah pesan belum dibaca
        },
      },
    ]);

    // console.log(JSON.stringify(results, null, 2));
    return results;
  } catch (error) {
    console.log("Error while get messages for user", error);
  }
};

export const getLastMessages = async (req, res) => {
  const userId = req.user._id;
  try {
    const results = await getMessagesForUser(userId);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUndeliveredMessages = async (req, res) => {
  const userId = req.user._id;
  try {
    await updateMessageStatus(userId, "delivered");

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUnreadMessage = async (req, res) => {
  const userId = req.user._id;
  const { messageIds } = req.body;
  try {
    await updateMessageStatus(userId, "read", messageIds);

    res.status(200);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
