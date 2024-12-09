import { create } from "zustand"
import { api } from "../lib/axios"
import toast from "react-hot-toast"
import { IoEarSharp } from "react-icons/io5";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdateProfilePic: false,

    selectedProfilePic: "",
    setSelectedProfilePic: (user) => set({ selectedProfilePic: user }),
    profilePicModal: false,
    showProfilePicModal: () => set({ profilePicModal: true }),
    closeProfilePicModal: () => set({ profilePicModal: false }),

    checkAuth: async () => {
        try {
            const res = await api.get("/auth/check")

            set({ authUser: res.data })
        } catch (error) {
            console.log("Error in checkAuth: ", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningup: true })
        try {
            const res = await api.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningup: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await api.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Logged in successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await api.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged out succesfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    updateProfilePic: async (data) => {
        set({ isUpdateProfilePic: true })
        try {
            const res = await api.post("/auth/update/profile-pic", data)
            set({ authUser: res.data })
            toast.success("Profile picture updated successfully")
        } catch (error) {
            console.log("Error while update profile pic on auth store", error)
            toast.error("Error while update profile picture.")
        } finally {
            set({ isUpdateProfilePic: false })
        }
    },
    
    deleteProfilePic: async () => {
        set({ isUpdateProfilePic: true })
        try {
            const res = await api.delete("/auth/delete/profile-pic")
            set({ authUser: res.data })
            toast.success("Profile picture removed.")
        } catch (error) {
            console.log("Error while delete profile pic on auth store", error)
            toast.error("Error while delete profile pic.")
        } finally {
            set({ isUpdateProfilePic: false })
        }
    }
}));