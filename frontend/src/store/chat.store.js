import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./auth.store";

export const useChatStore = create((set, get) => ({
  messages: [],
  contacts: [],
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
      set({ contacts: res.data });
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

  resetAllContacts: () => set({ allContacts: [] }),
  setSelectedUser: (data) => {
    const currentSelectedUserData = { ...get().selectedUser }
    delete currentSelectedUserData.status
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

    socket.on("userStatusChange", ({ userId, isOnline }) => {
      console.log(userId, targetUserId)
      console.log("status change")
      if (userId === targetUserId) {
        console.log("online")
        // set({ selectedUser: {...selectedUser, status: isOnline }})
        set({ isOnline: isOnline });
      }
    });
  },

  unsubscribeFromChat: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

}));
