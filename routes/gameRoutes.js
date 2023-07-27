import express from "express";
const router = express.Router();
import {
  searchGames,
  addGame,
  removeGame,
  getGame,
  getAllGames,
  rateGame,
  reviewGame,
} from "../controllers/gameController.js";
import { protect } from "../middleware/authMiddleware.js";
router.post("/search", protect, searchGames);
router.get("/:_id", protect, getGame);
router
  .route("/")
  .get(protect, getAllGames)
  .post(protect, addGame)
  .delete(protect, removeGame);
router.put("/rate", protect, rateGame);
router.put("/review", protect, reviewGame);

export default router;
