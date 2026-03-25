import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Message Type ──────────────────────────────────────────
    messageType: {
      type: String,
      enum: ["text", "image", "audio", "video", "file"],
      default: "text",
    },

    // ── Content Fields ────────────────────────────────────────
    text: { type: String, default: "" },
    image: { type: String, default: "" },
    audio: { type: String, default: "" },
    video: { type: String, default: "" },
    file: {
      url: { type: String, default: "" },
      originalName: { type: String, default: "" },
      fileType: { type: String, default: "" },
    },

    // ── Media Metadata ────────────────────────────────────────
    duration: { type: Number, default: 0 },

    // ── Reply To ──────────────────────────────────────────────
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null, 
    },

    // ── Read Receipt ──────────────────────────────────────────
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;