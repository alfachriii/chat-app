import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL_SERVER = "http://localhost:3001"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdateProfile: false,
  socket: null,

  profilePicModal: false,
  showProfilePicModal: () => set({ profilePicModal: true }),
  closeProfilePicModal: () => set({ profilePicModal: false }),

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check");

      set({ authUser: res.data });

    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningup: true });
    try {
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningup: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out succesfully");

      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateName: async (newName) => {
    set({ isUpdateProfile: true });
    const data = { newName: newName };
    try {
      const res = await api.post("/auth/update/name", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Error while updating name.");
    } finally {
      set({ isUpdateProfile: false });
    }
  },

  updateAbout: async (newAbout) => {
    set({ isUpdateProfile: true });
    const data = { newAbout: newAbout };
    try {
      const res = await api.post("/auth/update/about", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Error while updating about.");
    } finally {
      set({ isUpdateProfile: false });
    }
  },

  updateProfilePic: async (data) => {
    set({ isUpdateProfilePic: true });
    try {
      const res = await api.post("/auth/update/profile-pic", data);
      set({ authUser: res.data });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.log("Error while update profile pic on auth store", error);
      toast.error("Error while update profile picture.");
    } finally {
      set({ isUpdateProfilePic: false });
    }
  },

  deleteProfilePic: async () => {
    set({ isUpdateProfile: true });
    try {
      const res = await api.delete("/auth/delete/profile-pic");
      set({ authUser: res.data });
      toast.success("Profile picture removed.");
    } catch (error) {
      console.log("Error while delete profile pic on auth store", error);
      toast.error("Error while delete profile pic.");
    } finally {
      set({ isUpdateProfile: false });
    }
  },

  updateContact: async (email) => {
    set({ isUpdateProfile: true });
    const data = { email: email };
    try {
      const res = await api.post("/auth/update/contact", data);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error while update contact.");
      console.log(error);
    } finally {
      set({ isUpdateProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connect) return;

    const socket = io(BASE_URL_SERVER, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
    set({ socket: socket });
  },

  disconnectSocket: () => { 
    if (get().socket?.connect) get().socket.disconnect();
    set({ socket: null })
  },
}));
