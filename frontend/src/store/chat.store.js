import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./auth.store";
import { saveMessage, updateChat } from "../lib/utils";

export const useChatStore = create((set, get) => ({
  messages: [],
  recentMessages: [],
  currentChats: [],
  allContacts: [],
  selectedUser: null,
  isContactsLoading: false,
  isGetMessages: false,
  isSendMessage: false,
  isOnline: false,

  getContacts: async () => {
    set({ isContactsLoading: true });
    try {
      const res = await api.get("/messages/contacts");
      set({ currentChats: res.data });


      const authUser = useAuthStore.getState().authUser
      // res.data.map((chat) => saveMessage({
      //   chatId: `${authUser._id}_${chat._id}`

      // }))

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isContactsLoading: false });
    }
  },

  getAllContacts: async () => {
    set({ isContactsLoading: true });
    try {
      const res = await api.get("messages/contacts/all-contact");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error("Error while get all contacts");
      console.log("Error while get all contact", error);
    } finally {
      set({ isContactsLoading: false });
    }
  },

  getMessages: async (receiverId) => {
    set({ isGetMessages: true });
    try {
      const res = await api.get(`/messages/get/${receiverId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log(error);
      toast.error("Error while getting messages");
    } finally {
      set({ isGetMessages: false });
    }
  },

  sendMessage: async (inputMessage, inputFile, receiverId) => {
    //isOnGroup
    set({ isSendMessage: true });
    console.log(inputMessage);
    try {
      const data = {
        data: {
          receiverId: receiverId,
          text: inputMessage,
          file: {
            data: inputFile,
          },
        },
      };
      const res = await api.post("/messages/send/personal", data);
      set({ messages: [...get().messages, res.data] });
      toast.success("success");
    } catch (error) {
      console.log(error);
      toast.error("Error while sending message");
    } finally {
      set({ isSendMessage: false });
    }
  },

  getRecentMessages: async () => {
    try {
      const res = await api.get("/messages/recent");
      set({ recentMessages: res.data });

      const currentChats = get().currentChats
      const authUser = useAuthStore.getState().authUser
      // const chatIds = currentChats.map((chat) => chat._id)

      currentChats.map((chat) => updateChat(`${authUser._id}_${chat.receiverId}`, chat))
      // get().changeMessagesStatus()
    } catch (error) {
      console.log(error);
    }
  },

  changeMessagesStatus: () => {
    const recentMessages = get().recentMessages;
    console.log(Array.isArray(recentMessages));
    const socket = useAuthStore.getState().socket;
    const messageIds = Array.isArray(recentMessages)
      ? recentMessages.map((message) => message._id)
      : [];

    if (messageIds.length > 0) {
      socket.emit("messageDelivered", messageIds);
    }
  },

  resetAllContacts: () => set({ allContacts: [] }),
  setSelectedUser: (data) => {
    const currentSelectedUserData = { ...get().selectedUser };
    delete currentSelectedUserData.status;
    currentSelectedUserData === data
      ? set({ selectedUser: null })
      : set({ selectedUser: data });
  },

  subscribeToChat: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    const targetUserId = get().selectedUser._id;
    socket.on("userStatusChange", ({ userId, isOnline, user }) => {
      if (userId === targetUserId) {
        set({ isOnline: isOnline });
        if (user) {
          set({ selectedUser: user });
        }
      }
    });
  },

  unsubscribeFromChat: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },
}));
