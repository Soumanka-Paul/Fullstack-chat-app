import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,
  unreadCounts: {}, // { userId: count }

  // ── Get All Users for Sidebar ─────────────────────────────
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ── Get Messages for Selected User ───────────────────────
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });

      // Clear unread count for this user when chat is opened
      set((state) => ({
        unreadCounts: { ...state.unreadCounts, [userId]: 0 },
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ── Send Message ──────────────────────────────────────────
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // ── Delete Message ────────────────────────────────────────
  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      // Remove from local state immediately
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  // ── Typing Indicator ──────────────────────────────────────
  sendTypingIndicator: async (receiverId, isTyping) => {
    try {
      await axiosInstance.post(`/messages/typing/${receiverId}`, { isTyping });
    } catch (error) {
      console.error("Typing indicator error:", error);
    }
  },

  // ── Subscribe to Socket.io Events ────────────────────────
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // New message received
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, unreadCounts } = get();

      if (newMessage.senderId === selectedUser?._id) {
        // Message is from current chat — add to messages
        set({ messages: [...get().messages, newMessage] });
      } else {
        // Message is from another user — increment unread count
        set({
          unreadCounts: {
            ...unreadCounts,
            [newMessage.senderId]: (unreadCounts[newMessage.senderId] || 0) + 1,
          },
        });
      }
    });

    // Message deleted by sender
    socket.on("messageDeleted", ({ messageId }) => {
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    });

    // Typing indicator
    socket.on("typing", ({ senderId, isTyping }) => {
      const { selectedUser } = get();
      if (selectedUser?._id === senderId) {
        set({ isTyping });
      }
    });
  },

  // ── Unsubscribe from Socket.io Events ────────────────────
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("messageDeleted");
      socket.off("typing");
    }
  },

  // ── Set Selected User ─────────────────────────────────────
  setSelectedUser: (user) => set({ selectedUser: user }),
}));