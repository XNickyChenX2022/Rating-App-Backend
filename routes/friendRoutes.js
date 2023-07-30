import express from "express";
import {
  sendFriendRequest,
  respondFriendRequest,
  getAllFriendRequests,
  getAllFriends,
  getFriendGames,
} from "../controllers/friendController.js";
import { protect } from "../middleware/authMiddleware.js";
import { protectFriend } from "../middleware/friendAuthMiddleware.js";
const router = express.Router();

router.route("/").get(protect, getAllFriends).post(protect, sendFriendRequest);
router.get("/requests", protect, getAllFriendRequests);
router.post("/respond", protect, respondFriendRequest);
router.get("/:username", protect, protectFriend, getFriendGames);
export default router;
