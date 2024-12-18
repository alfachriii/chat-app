import { response } from "express";
import cloudinary from "../lib/cloudinary.js";
import { findUsersByEmails, getMimeType } from "../lib/utils.js";
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

    const contacts = await User.find({
      _id: { $in: userIds[0].ids },
    }).select(["-password", "-contactId"]);

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
    });

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

// export const getRecentMessages = async (req, res) => {
//   const myUserId = req.user._id;
//   try {
//     const messages = await Message.find({
//       receiverId: myUserId,
//       status: "sent",
//     });

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log("Error on get recent message controller: ", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// async function ambilPesanUntukBanyakUser(userId, otherUserIds) {
//   try {
//       const promises = otherUserIds.map(async (otherUserId) => {
//           return ambilPesanTerbaruDanHitungUnreadDenganAgregasi(userId, otherUserId);
//       });

//       const results = await Promise.all(promises);
//       return results;
//   } catch (error) {
//       console.error("Gagal mengambil pesan untuk banyak user:", error);
//       throw error;
//   }
// }

async function ambilPesanUntukBanyakUserDenganAgregasi(userId, otherUserIds) {
  try {
    const objectOtherUserIds = otherUserIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const result = await PersonalMessage.aggregate([
      {
        $match: {
          $or: [
            {
              senderId: new mongoose.Types.ObjectId(userId),
              receiverId: { $in: objectOtherUserIds },
            },
            {
              senderId: { $in: objectOtherUserIds },
              receiverId: new mongoose.Types.ObjectId(userId),
            },
            {
              receiverId: new mongoose.Types.ObjectId(userId),
            },
          ],
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: {
            otherUserId: {
              $cond: {
                if: { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
                then: "$receiverId",
                else: "$senderId",
              },
            },
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: {
                if: { $eq: ["$status", "sent"] },
                then: {
                  $cond: {
                    if: {
                      $ne: ["$senderId", new mongoose.Types.ObjectId(userId)],
                    },
                    then: 1,
                    else: 0,
                  },
                },
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          otherUserId: "$_id.otherUserId",
          lastMessage: 1,
          unreadCount: 1,
        },
      },
    ]);

    return result;
  } catch (error) {
    console.error(
      "Gagal mengambil pesan untuk banyak user dengan agregasi:",
      error
    );
    throw error;
  }
}

const getMessagesForUser = async (userId) => {
  try {
    const results = await PersonalMessage.aggregate([
      {
        $match: {
          $or: [
            {receiverId: userId},
            {senderId: userId}
          ]
          
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
              if: { $eq: ["$receiverId", userId] },
              then: "$senderId",
              else: "$receiverId"
            }
          },
          lastMessage: { $first: "$$ROOT" }
        },
      },
      {
        $addFields: {
          "lastMessage.unreadCount": {
            $sum: {
              $cond: [{ $ne: ["$lastMessage.senderId", userId] }, 1, 0],
            },
          },
        },
      },
    ]);

    return results;
  } catch (error) {
    console.log("Error while get messages for user", error);
  }
};

export const getLastMessages = async (req, res) => {
  const userId = req.user._id;
  try {

    const results = await getMessagesForUser(userId)
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUndeliveredMessageIds = async (req, res) => {
  const userId = req.user._id
  try {
    const updatedMessages = await PersonalMessage.updateMany(
      { receiverId: userId, status: "sent" }, // Filter langsung berdasarkan receiverId
      { $set: { status: "terbaca" } } // Update status menjadi terbaca
    );
    
    // res.status(200).json(messageIds)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" })
  }
}