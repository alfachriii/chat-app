import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";


export const useChatStore = create((set) => ({
    contacts: [],
    isContactsLoading: false,

    getContacts: async () => {
        set({ isContactsLoading: true })
        try {
            const res = await api.get("/messages/contacts")
            set({ contacts: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isContactsLoading: false })
        }
    }
}))