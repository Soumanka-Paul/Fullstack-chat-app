import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

// ── Helper: Upload to Cloudinary ──────────────────────────────────────────────
const uploadToCloudinary = async (base64Data, resourceType = "auto", folder = "chat") => {
  const response = await cloudinary.uploader.upload(base64Data, {
    resource_type: resourceType,
    folder: `CHATAPP/${folder}`,
  });
  return response.secure_url;
};

// ── Get Users for Sidebar ─────────────────────────────────────────────────────
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // 
    const filteredUsers = await User.find({ 
      _id: { $ne: loggedInUserId } 
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Get Messages Between Two Users ───────────────────────────────────────────
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    })
      .populate("replyTo", "text image audio video messageType senderId")
      .sort({ createdAt: 1 });

    // Mark all received messages as read
    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, isRead: false },
      { isRead: true }
    );

    // Notify sender that messages were seen
    const senderSocketId = getReceiverSocketId(userToChatId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", { by: myId });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Send Message (Text / Image / Audio / Video / File) ────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const { text, image, audio, video, file, duration, replyTo } = req.body;

    // Validate — at least one content field required
    if (!text && !image && !audio && !video && !file) {
      return res.status(400).json({ message: "Message content is required" });
    }

    let messageType = "text";
    let imageUrl = "";
    let audioUrl = "";
    let videoUrl = "";
    let fileData = {};

    // ── Upload Image ──────────────────────────────────────────
    if (image) {
      imageUrl = await uploadToCloudinary(image, "image", "images");
      messageType = "image";
    }

    // ── Upload Audio (voice recording) ────────────────────────
    if (audio) {
      audioUrl = await uploadToCloudinary(audio, "video", "audio");
      messageType = "audio";
    }

    // ── Upload Video ──────────────────────────────────────────
    if (video) {
      videoUrl = await uploadToCloudinary(video, "video", "videos");
      messageType = "video";
    }

    // ── Upload File (pdf, docx, etc.) ─────────────────────────
    if (file) {
      const fileUrl = await uploadToCloudinary(file.base64, "raw", "files");
      fileData = {
        url: fileUrl,
        originalName: file.originalName || "file",
        fileType: file.fileType || "unknown",
      };
      messageType = "file";
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      messageType: text && !image && !audio && !video && !file ? "text" : messageType,
      text: text || "",
      image: imageUrl,
      audio: audioUrl,
      video: videoUrl,
      file: fileData,
      duration: duration || 0,
      replyTo: replyTo || null,
    });

    // Populate replyTo before emitting
    await newMessage.populate("replyTo", "text image audio video messageType senderId");

    // ── Emit to receiver via Socket.io ────────────────────────
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Delete Message ────────────────────────────────────────────────────────────
export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can delete
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(messageId);

    // Notify receiver that message was deleted
    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }

    res.status(200).json({ message: "Message deleted successfully", messageId });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Typing Indicator ──────────────────────────────────────────────────────────
export const typingIndicator = (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { isTyping } = req.body;
    const senderId = req.user._id;

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId, isTyping });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in typingIndicator:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};