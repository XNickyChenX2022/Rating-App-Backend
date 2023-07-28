import express from "express";
import {
  sendFriendRequest,
  respondFriendRequest,
  getAllFriends,
} from "../controllers/friendController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(protect, getAllFriends).post(protect, sendFriendRequest);
router.post("/respond", protect, respondFriendRequest);
export default router;
