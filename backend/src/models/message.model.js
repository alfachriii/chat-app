import mongoose from "mongoose";

const baseOptions = {
  discriminatorKey: "messageType", // Membuat kolom tipe pesan
  collection: "messages",
};

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: false,
    },
    text: { type: String, required: false },
    file: {
      type: {
        name: { type: String },
        sentAs: { type: String, enum: ["image", "video", "audio", "document"]},
        size: { type: String },
        mimeType: { type: String },
        url: { type: String }
      },
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true },
  baseOptions
);

const Message = mongoose.model("Message", messageSchema);

export const PersonalMessage = Message.discriminator(
  "personal",
  new mongoose.Schema({
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  })
);

// Model untuk pesan grup
export const GroupMessage = Message.discriminator(
  "group",
  new mongoose.Schema({
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
  })
);

export default Message