import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./auth.store";
import {
  combineDataUser,
  fetchUserList,
  initDB,
  saveBulkDataWithCursorCheck,
  saveMessage,
  updateChat,
  updateChatMessage,
} from "../lib/utils";

export const useChatStore = create((set, get) => ({
  messages: [],
  recentMessages: [],
  currentChats: [],
  chatList: [],
  combine: [],
  allContacts: [],
  selectedUser: null,
  isContactsLoading: false,
  isGetMessages: false,
  isSendMessage: false,
  isOnline: false,

  // getContacts: async () => {
  //   set({ isContactsLoading: true });
  //   try {
  //     const res = await api.get("/messages/contacts");
  //     set({ currentChats: res.data });

  //     const authUser = useAuthStore.getState().authUser
  //     // res.data.map((chat) => saveMessage({
  //     //   chatId: `${authUser._id}_${chat._id}`

  //     // }))

  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isContactsLoading: false });
  //   }
  // },

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

      const chats = get().chatList;
      const updatedChats = updateChatMessage(chats, receiverId, {
        status: "sent",
        msg: inputMessage,
        time: new Date(),
        from: "send"
      });
      set({ chatList: updatedChats });
    } catch (error) {
      console.log(error);
      toast.error("Error while sending message");
    } finally {
      set({ isSendMessage: false });
    }
  },

  getChatListAndSaveToIndexedDb: async () => {
    try {
      const users = await api.get("/messages/get-chat-list");
      const messages = await api.get("/messages/last");
      const userDatas = combineDataUser(users.data, messages.data);

      console.log(messages.data)

      // add createdAt
      const processedData = [];
      for (let i = 0; i < userDatas.length; i++) {
        const item = userDatas[i];
        if (item.lastMessage?.createdAt) {
          item.createdAt = item.lastMessage.createdAt;
          item.updatedAt = item.lastMessage.updatedAt;
        }
        processedData.push(item);
      }

      // save to indexedDb
      // initDB()
      //   .then(() => saveBulkDataWithCursorCheck(processedData))
      //   .then(() => {
      //     console.log("Proses penyimpanan data selesai tanpa duplikasi.");
      //   })
      //   .catch((error) => {
      //     console.error("Terjadi kesalahan:", error);
      //   });

      set({ chatList: userDatas });
      console.log(userDatas);
      // const chatListFromIndexedDb = await fetchUserList();
      // console.log(chatListFromIndexedDb);
    } catch (error) {
      console.log(error);
      toast.error("Error while get chat list");
    }
  },

  updateUndeliveredMessages: async () => {
    try {
      await api.put("/messages/undelivered");
    } catch (error) {
      console.log("Error on update undelivered messages status", error);
      toast.error("Error while update undelivered messages");
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
  setChatList: (data) => set({ chatList: data }),

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

  newMessagesListener: () => {
    const socket = useAuthStore.getState().socket;

    socket?.on("newMessage", (newMessage) => {
      const chats = get().chatList;
      if (newMessage) {
        const updatedChats = updateChatMessage(chats, newMessage.senderId, {
          status: newMessage.status,
          msg: newMessage.text,
          time: newMessage.createdAt,
        });
        console.log(updatedChats)
        set({ chatList: updatedChats });
      }

      get().updateUndeliveredMessages()
    });
  },
}));
