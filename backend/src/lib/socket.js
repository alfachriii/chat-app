import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return onlineUsers.get(userId);
}

const onlineUsers = new Map(); // userId -> socketId
const socketToUser = new Map(); // socketId -> userId

io.use((socket, next) => {
  const userId = socket.handshake.query.userId; // Ambil userId dari query params
  if (!userId) {
    return next(new Error("Authentication error: userId is required"));
  }
  socket.userId = userId; // Tambahkan userId ke objek socket
  next(); // Lanjutkan ke event connection
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.userId; // Ambil userId dari socket yang sudah ditambahkan oleh middleware

  // Simpan hubungan userId -> socketId dan sebaliknya

  socket.on("online", (userId) => {
    onlineUsers.set(userId, socket.id);
    socketToUser.set(socket.id, userId);
    socket.broadcast.emit("userStatusChange", { userId, isOnline: true });
  });

  socket.on("messageDelivered", async (messageIds) => {
    console.log("message ids: ", messageIds);
    const message = await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { status: "delivered" } }
    );

    // Kirimkan status terbaru ke pengirim
    // io.to(message.senderId.toString()).emit('updateMessageStatus', message);
  });

  socket.on("checkStatus", (userId) => {
    console.log("checkstatus");
    const isOnline = onlineUsers.has(userId); // Periksa apakah userId ada di onlineUsers
    socket.emit("userStatusChange", { userId, isOnline, user: null }); // Kirim status hanya ke client yang meminta
  });

  socket.on("offline", async (userId) => {
    if (userId) {
      onlineUsers.delete(userId); // Hapus dari daftar online
      socketToUser.delete(socket.id); // Hapus dari daftar socketToUser
      console.log("User offline:", userId);
    }

    const user = await User.findByIdAndUpdate(userId, {
      lastSeen: new Date(),
    });
    socket.broadcast.emit("userStatusChange", {
      userId,
      isOnline: false,
      user: user,
    });
  });

  socket.on("disconnect", async () => {
    console.log("A user disconnect", socket.io);
    const userId = socketToUser.get(socket.id); // Ambil userId dari socketId
    if (userId) {
      onlineUsers.delete(userId); // Hapus dari daftar online
      socketToUser.delete(socket.id); // Hapus dari daftar socketToUser
      console.log("User disconnected:", userId);
    }

    const user = await User.findByIdAndUpdate(userId, {
      lastSeen: new Date(),
    });
    socket.broadcast.emit("userStatusChange", {
      userId,
      isOnline: false,
      user: user,
    });
  });
});

io.on("error", (error) => {
  console.error("Socket.IO error:", error);
});

export { app, io, server };
