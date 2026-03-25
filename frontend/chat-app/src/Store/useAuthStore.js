import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const SOCKET_URL =import.meta.env.MODE === "development"? "http://localhost:3000": "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ── Check Auth ────────────────────────────────────────────
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ── Signup ────────────────────────────────────────────────
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data.user });
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ── Login ─────────────────────────────────────────────────
  login: async (formData) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSigningIn: false });
    }
  },

  // ── Logout ────────────────────────────────────────────────
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  // ── Update Profile ────────────────────────────────────────
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ── Connect Socket ────────────────────────────────────────
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(SOCKET_URL, {
      query: { userId: authUser._id || authUser.id },
    });

    socket.connect();
    set({ socket });

    // Online users list
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // ── Disconnect Socket ─────────────────────────────────────
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));