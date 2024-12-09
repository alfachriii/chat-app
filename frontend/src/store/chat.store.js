import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  contacts: [],
  allContacts: [],
  selectedUser: null,
  isContactsLoading: false,

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
      console.log(res);
      set({ allContacts: res.data });
    } catch (error) {
      toast.error("Error while get all contacts");
      console.log("Error while get all contact", error);
    } finally {
      set({ isContactsLoading: false });
    }
  },

  resetAllContacts: () => set({ allContacts: [] }),
  setSelectedUser: (data) => {
    get().selectedUser === data
      ? set({ selectedUser: null })
      : set({ selectedUser: data });
  },
}));
