import express from "express";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  deleteMessage,
  typingIndicator,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/users", getUsersForSidebar);
router.get("/:id",getMessages);
router.post("/send/:id", sendMessage);
router.delete("/:id",deleteMessage);
router.post("/typing/:id", typingIndicator);

export default router;