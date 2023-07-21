import express from "express";
const router = express.Router();
import {
  searchGames,
  addGame,
  rateGame,
  removeGame,
  commentGame,
} from "../controllers/gameController.js";
import { protect } from "../middleware/authMiddleware.js";
router.post("/search", protect, searchGames);
router.post("/add", protect, addGame);
router.post("/rate", protect, rateGame);
router.post("/remove", protect, removeGame);
router.post("/comment", protect, commentGame);

export default router;
